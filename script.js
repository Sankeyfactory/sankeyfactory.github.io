"use strict";
(() => {
  var __create = Object.create;
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getProtoOf = Object.getPrototypeOf;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __commonJS = (cb, mod) => function __require() {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
    // If the importer is in node compatibility mode or this is not an ESM
    // file that has been converted to a CommonJS file using a Babel-
    // compatible transform (i.e. "__esModule" has not been set), then set
    // "default" to the CommonJS "module.exports" for node compatibility.
    isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
    mod
  ));

  // node_modules/wheel/index.js
  var require_wheel = __commonJS({
    "node_modules/wheel/index.js"(exports, module) {
      module.exports = addWheelListener;
      module.exports.addWheelListener = addWheelListener;
      module.exports.removeWheelListener = removeWheelListener;
      function addWheelListener(element, listener, useCapture) {
        element.addEventListener("wheel", listener, useCapture);
      }
      function removeWheelListener(element, listener, useCapture) {
        element.removeEventListener("wheel", listener, useCapture);
      }
    }
  });

  // node_modules/bezier-easing/src/index.js
  var require_src = __commonJS({
    "node_modules/bezier-easing/src/index.js"(exports, module) {
      var NEWTON_ITERATIONS = 4;
      var NEWTON_MIN_SLOPE = 1e-3;
      var SUBDIVISION_PRECISION = 1e-7;
      var SUBDIVISION_MAX_ITERATIONS = 10;
      var kSplineTableSize = 11;
      var kSampleStepSize = 1 / (kSplineTableSize - 1);
      var float32ArraySupported = typeof Float32Array === "function";
      function A(aA1, aA2) {
        return 1 - 3 * aA2 + 3 * aA1;
      }
      function B(aA1, aA2) {
        return 3 * aA2 - 6 * aA1;
      }
      function C(aA1) {
        return 3 * aA1;
      }
      function calcBezier(aT, aA1, aA2) {
        return ((A(aA1, aA2) * aT + B(aA1, aA2)) * aT + C(aA1)) * aT;
      }
      function getSlope(aT, aA1, aA2) {
        return 3 * A(aA1, aA2) * aT * aT + 2 * B(aA1, aA2) * aT + C(aA1);
      }
      function binarySubdivide(aX, aA, aB, mX1, mX2) {
        var currentX, currentT, i = 0;
        do {
          currentT = aA + (aB - aA) / 2;
          currentX = calcBezier(currentT, mX1, mX2) - aX;
          if (currentX > 0) {
            aB = currentT;
          } else {
            aA = currentT;
          }
        } while (Math.abs(currentX) > SUBDIVISION_PRECISION && ++i < SUBDIVISION_MAX_ITERATIONS);
        return currentT;
      }
      function newtonRaphsonIterate(aX, aGuessT, mX1, mX2) {
        for (var i = 0; i < NEWTON_ITERATIONS; ++i) {
          var currentSlope = getSlope(aGuessT, mX1, mX2);
          if (currentSlope === 0) {
            return aGuessT;
          }
          var currentX = calcBezier(aGuessT, mX1, mX2) - aX;
          aGuessT -= currentX / currentSlope;
        }
        return aGuessT;
      }
      function LinearEasing(x) {
        return x;
      }
      module.exports = function bezier(mX1, mY1, mX2, mY2) {
        if (!(0 <= mX1 && mX1 <= 1 && 0 <= mX2 && mX2 <= 1)) {
          throw new Error("bezier x values must be in [0, 1] range");
        }
        if (mX1 === mY1 && mX2 === mY2) {
          return LinearEasing;
        }
        var sampleValues = float32ArraySupported ? new Float32Array(kSplineTableSize) : new Array(kSplineTableSize);
        for (var i = 0; i < kSplineTableSize; ++i) {
          sampleValues[i] = calcBezier(i * kSampleStepSize, mX1, mX2);
        }
        function getTForX(aX) {
          var intervalStart = 0;
          var currentSample = 1;
          var lastSample = kSplineTableSize - 1;
          for (; currentSample !== lastSample && sampleValues[currentSample] <= aX; ++currentSample) {
            intervalStart += kSampleStepSize;
          }
          --currentSample;
          var dist = (aX - sampleValues[currentSample]) / (sampleValues[currentSample + 1] - sampleValues[currentSample]);
          var guessForT = intervalStart + dist * kSampleStepSize;
          var initialSlope = getSlope(guessForT, mX1, mX2);
          if (initialSlope >= NEWTON_MIN_SLOPE) {
            return newtonRaphsonIterate(aX, guessForT, mX1, mX2);
          } else if (initialSlope === 0) {
            return guessForT;
          } else {
            return binarySubdivide(aX, intervalStart, intervalStart + kSampleStepSize, mX1, mX2);
          }
        }
        return function BezierEasing(x) {
          if (x === 0) {
            return 0;
          }
          if (x === 1) {
            return 1;
          }
          return calcBezier(getTForX(x), mY1, mY2);
        };
      };
    }
  });

  // node_modules/amator/index.js
  var require_amator = __commonJS({
    "node_modules/amator/index.js"(exports, module) {
      var BezierEasing = require_src();
      var animations = {
        ease: BezierEasing(0.25, 0.1, 0.25, 1),
        easeIn: BezierEasing(0.42, 0, 1, 1),
        easeOut: BezierEasing(0, 0, 0.58, 1),
        easeInOut: BezierEasing(0.42, 0, 0.58, 1),
        linear: BezierEasing(0, 0, 1, 1)
      };
      module.exports = animate;
      module.exports.makeAggregateRaf = makeAggregateRaf;
      module.exports.sharedScheduler = makeAggregateRaf();
      function animate(source, target, options) {
        var start = /* @__PURE__ */ Object.create(null);
        var diff = /* @__PURE__ */ Object.create(null);
        options = options || {};
        var easing = typeof options.easing === "function" ? options.easing : animations[options.easing];
        if (!easing) {
          if (options.easing) {
            console.warn("Unknown easing function in amator: " + options.easing);
          }
          easing = animations.ease;
        }
        var step = typeof options.step === "function" ? options.step : noop;
        var done = typeof options.done === "function" ? options.done : noop;
        var scheduler = getScheduler(options.scheduler);
        var keys = Object.keys(target);
        keys.forEach(function(key) {
          start[key] = source[key];
          diff[key] = target[key] - source[key];
        });
        var durationInMs = typeof options.duration === "number" ? options.duration : 400;
        var durationInFrames = Math.max(1, durationInMs * 0.06);
        var previousAnimationId;
        var frame = 0;
        previousAnimationId = scheduler.next(loop);
        return {
          cancel
        };
        function cancel() {
          scheduler.cancel(previousAnimationId);
          previousAnimationId = 0;
        }
        function loop() {
          var t = easing(frame / durationInFrames);
          frame += 1;
          setValues(t);
          if (frame <= durationInFrames) {
            previousAnimationId = scheduler.next(loop);
            step(source);
          } else {
            previousAnimationId = 0;
            setTimeout(function() {
              done(source);
            }, 0);
          }
        }
        function setValues(t) {
          keys.forEach(function(key) {
            source[key] = diff[key] * t + start[key];
          });
        }
      }
      function noop() {
      }
      function getScheduler(scheduler) {
        if (!scheduler) {
          var canRaf = typeof window !== "undefined" && window.requestAnimationFrame;
          return canRaf ? rafScheduler() : timeoutScheduler();
        }
        if (typeof scheduler.next !== "function") throw new Error("Scheduler is supposed to have next(cb) function");
        if (typeof scheduler.cancel !== "function") throw new Error("Scheduler is supposed to have cancel(handle) function");
        return scheduler;
      }
      function rafScheduler() {
        return {
          next: window.requestAnimationFrame.bind(window),
          cancel: window.cancelAnimationFrame.bind(window)
        };
      }
      function timeoutScheduler() {
        return {
          next: function(cb) {
            return setTimeout(cb, 1e3 / 60);
          },
          cancel: function(id) {
            return clearTimeout(id);
          }
        };
      }
      function makeAggregateRaf() {
        var frontBuffer = /* @__PURE__ */ new Set();
        var backBuffer = /* @__PURE__ */ new Set();
        var frameToken = 0;
        return {
          next,
          cancel: next,
          clearAll
        };
        function clearAll() {
          frontBuffer.clear();
          backBuffer.clear();
          cancelAnimationFrame(frameToken);
          frameToken = 0;
        }
        function next(callback) {
          backBuffer.add(callback);
          renderNextFrame();
        }
        function renderNextFrame() {
          if (!frameToken) frameToken = requestAnimationFrame(renderFrame);
        }
        function renderFrame() {
          frameToken = 0;
          var t = backBuffer;
          backBuffer = frontBuffer;
          frontBuffer = t;
          frontBuffer.forEach(function(callback) {
            callback();
          });
          frontBuffer.clear();
        }
        function cancel(callback) {
          backBuffer.delete(callback);
        }
      }
    }
  });

  // node_modules/ngraph.events/index.js
  var require_ngraph = __commonJS({
    "node_modules/ngraph.events/index.js"(exports, module) {
      module.exports = function eventify(subject) {
        validateSubject(subject);
        var eventsStorage = createEventsStorage(subject);
        subject.on = eventsStorage.on;
        subject.off = eventsStorage.off;
        subject.fire = eventsStorage.fire;
        return subject;
      };
      function createEventsStorage(subject) {
        var registeredEvents = /* @__PURE__ */ Object.create(null);
        return {
          on: function(eventName, callback, ctx) {
            if (typeof callback !== "function") {
              throw new Error("callback is expected to be a function");
            }
            var handlers = registeredEvents[eventName];
            if (!handlers) {
              handlers = registeredEvents[eventName] = [];
            }
            handlers.push({ callback, ctx });
            return subject;
          },
          off: function(eventName, callback) {
            var wantToRemoveAll = typeof eventName === "undefined";
            if (wantToRemoveAll) {
              registeredEvents = /* @__PURE__ */ Object.create(null);
              return subject;
            }
            if (registeredEvents[eventName]) {
              var deleteAllCallbacksForEvent = typeof callback !== "function";
              if (deleteAllCallbacksForEvent) {
                delete registeredEvents[eventName];
              } else {
                var callbacks = registeredEvents[eventName];
                for (var i = 0; i < callbacks.length; ++i) {
                  if (callbacks[i].callback === callback) {
                    callbacks.splice(i, 1);
                  }
                }
              }
            }
            return subject;
          },
          fire: function(eventName) {
            var callbacks = registeredEvents[eventName];
            if (!callbacks) {
              return subject;
            }
            var fireArguments;
            if (arguments.length > 1) {
              fireArguments = Array.prototype.splice.call(arguments, 1);
            }
            for (var i = 0; i < callbacks.length; ++i) {
              var callbackInfo = callbacks[i];
              callbackInfo.callback.apply(callbackInfo.ctx, fireArguments);
            }
            return subject;
          }
        };
      }
      function validateSubject(subject) {
        if (!subject) {
          throw new Error("Eventify cannot use falsy object as events subject");
        }
        var reservedWords = ["on", "fire", "off"];
        for (var i = 0; i < reservedWords.length; ++i) {
          if (subject.hasOwnProperty(reservedWords[i])) {
            throw new Error("Subject cannot be eventified, since it already has property '" + reservedWords[i] + "'");
          }
        }
      }
    }
  });

  // node_modules/panzoom/lib/kinetic.js
  var require_kinetic = __commonJS({
    "node_modules/panzoom/lib/kinetic.js"(exports, module) {
      module.exports = kinetic;
      function kinetic(getPoint, scroll, settings) {
        if (typeof settings !== "object") {
          settings = {};
        }
        var minVelocity = typeof settings.minVelocity === "number" ? settings.minVelocity : 5;
        var amplitude = typeof settings.amplitude === "number" ? settings.amplitude : 0.25;
        var cancelAnimationFrame2 = typeof settings.cancelAnimationFrame === "function" ? settings.cancelAnimationFrame : getCancelAnimationFrame();
        var requestAnimationFrame2 = typeof settings.requestAnimationFrame === "function" ? settings.requestAnimationFrame : getRequestAnimationFrame();
        var lastPoint;
        var timestamp;
        var timeConstant = 342;
        var ticker;
        var vx, targetX, ax;
        var vy, targetY, ay;
        var raf;
        return {
          start,
          stop,
          cancel: dispose
        };
        function dispose() {
          cancelAnimationFrame2(ticker);
          cancelAnimationFrame2(raf);
        }
        function start() {
          lastPoint = getPoint();
          ax = ay = vx = vy = 0;
          timestamp = /* @__PURE__ */ new Date();
          cancelAnimationFrame2(ticker);
          cancelAnimationFrame2(raf);
          ticker = requestAnimationFrame2(track);
        }
        function track() {
          var now = Date.now();
          var elapsed = now - timestamp;
          timestamp = now;
          var currentPoint = getPoint();
          var dx = currentPoint.x - lastPoint.x;
          var dy = currentPoint.y - lastPoint.y;
          lastPoint = currentPoint;
          var dt = 1e3 / (1 + elapsed);
          vx = 0.8 * dx * dt + 0.2 * vx;
          vy = 0.8 * dy * dt + 0.2 * vy;
          ticker = requestAnimationFrame2(track);
        }
        function stop() {
          cancelAnimationFrame2(ticker);
          cancelAnimationFrame2(raf);
          var currentPoint = getPoint();
          targetX = currentPoint.x;
          targetY = currentPoint.y;
          timestamp = Date.now();
          if (vx < -minVelocity || vx > minVelocity) {
            ax = amplitude * vx;
            targetX += ax;
          }
          if (vy < -minVelocity || vy > minVelocity) {
            ay = amplitude * vy;
            targetY += ay;
          }
          raf = requestAnimationFrame2(autoScroll);
        }
        function autoScroll() {
          var elapsed = Date.now() - timestamp;
          var moving = false;
          var dx = 0;
          var dy = 0;
          if (ax) {
            dx = -ax * Math.exp(-elapsed / timeConstant);
            if (dx > 0.5 || dx < -0.5) moving = true;
            else dx = ax = 0;
          }
          if (ay) {
            dy = -ay * Math.exp(-elapsed / timeConstant);
            if (dy > 0.5 || dy < -0.5) moving = true;
            else dy = ay = 0;
          }
          if (moving) {
            scroll(targetX + dx, targetY + dy);
            raf = requestAnimationFrame2(autoScroll);
          }
        }
      }
      function getCancelAnimationFrame() {
        if (typeof cancelAnimationFrame === "function") return cancelAnimationFrame;
        return clearTimeout;
      }
      function getRequestAnimationFrame() {
        if (typeof requestAnimationFrame === "function") return requestAnimationFrame;
        return function(handler) {
          return setTimeout(handler, 16);
        };
      }
    }
  });

  // node_modules/panzoom/lib/createTextSelectionInterceptor.js
  var require_createTextSelectionInterceptor = __commonJS({
    "node_modules/panzoom/lib/createTextSelectionInterceptor.js"(exports, module) {
      module.exports = createTextSelectionInterceptor;
      function createTextSelectionInterceptor(useFake) {
        if (useFake) {
          return {
            capture: noop,
            release: noop
          };
        }
        var dragObject;
        var prevSelectStart;
        var prevDragStart;
        var wasCaptured = false;
        return {
          capture,
          release
        };
        function capture(domObject) {
          wasCaptured = true;
          prevSelectStart = window.document.onselectstart;
          prevDragStart = window.document.ondragstart;
          window.document.onselectstart = disabled;
          dragObject = domObject;
          dragObject.ondragstart = disabled;
        }
        function release() {
          if (!wasCaptured) return;
          wasCaptured = false;
          window.document.onselectstart = prevSelectStart;
          if (dragObject) dragObject.ondragstart = prevDragStart;
        }
      }
      function disabled(e) {
        e.stopPropagation();
        return false;
      }
      function noop() {
      }
    }
  });

  // node_modules/panzoom/lib/transform.js
  var require_transform = __commonJS({
    "node_modules/panzoom/lib/transform.js"(exports, module) {
      module.exports = Transform;
      function Transform() {
        this.x = 0;
        this.y = 0;
        this.scale = 1;
      }
    }
  });

  // node_modules/panzoom/lib/svgController.js
  var require_svgController = __commonJS({
    "node_modules/panzoom/lib/svgController.js"(exports, module) {
      module.exports = makeSvgController;
      module.exports.canAttach = isSVGElement;
      function makeSvgController(svgElement, options) {
        if (!isSVGElement(svgElement)) {
          throw new Error("svg element is required for svg.panzoom to work");
        }
        var owner = svgElement.ownerSVGElement;
        if (!owner) {
          throw new Error(
            "Do not apply panzoom to the root <svg> element. Use its child instead (e.g. <g></g>). As of March 2016 only FireFox supported transform on the root element"
          );
        }
        if (!options.disableKeyboardInteraction) {
          owner.setAttribute("tabindex", 0);
        }
        var api = {
          getBBox,
          getScreenCTM,
          getOwner,
          applyTransform,
          initTransform
        };
        return api;
        function getOwner() {
          return owner;
        }
        function getBBox() {
          var bbox = svgElement.getBBox();
          return {
            left: bbox.x,
            top: bbox.y,
            width: bbox.width,
            height: bbox.height
          };
        }
        function getScreenCTM() {
          var ctm = owner.getCTM();
          if (!ctm) {
            return owner.getScreenCTM();
          }
          return ctm;
        }
        function initTransform(transform) {
          var screenCTM = svgElement.getCTM();
          if (screenCTM === null) {
            screenCTM = document.createElementNS("http://www.w3.org/2000/svg", "svg").createSVGMatrix();
          }
          transform.x = screenCTM.e;
          transform.y = screenCTM.f;
          transform.scale = screenCTM.a;
          owner.removeAttributeNS(null, "viewBox");
        }
        function applyTransform(transform) {
          svgElement.setAttribute("transform", "matrix(" + transform.scale + " 0 0 " + transform.scale + " " + transform.x + " " + transform.y + ")");
        }
      }
      function isSVGElement(element) {
        return element && element.ownerSVGElement && element.getCTM;
      }
    }
  });

  // node_modules/panzoom/lib/domController.js
  var require_domController = __commonJS({
    "node_modules/panzoom/lib/domController.js"(exports, module) {
      module.exports = makeDomController;
      module.exports.canAttach = isDomElement;
      function makeDomController(domElement, options) {
        var elementValid = isDomElement(domElement);
        if (!elementValid) {
          throw new Error("panzoom requires DOM element to be attached to the DOM tree");
        }
        var owner = domElement.parentElement;
        domElement.scrollTop = 0;
        if (!options.disableKeyboardInteraction) {
          owner.setAttribute("tabindex", 0);
        }
        var api = {
          getBBox,
          getOwner,
          applyTransform
        };
        return api;
        function getOwner() {
          return owner;
        }
        function getBBox() {
          return {
            left: 0,
            top: 0,
            width: domElement.clientWidth,
            height: domElement.clientHeight
          };
        }
        function applyTransform(transform) {
          domElement.style.transformOrigin = "0 0 0";
          domElement.style.transform = "matrix(" + transform.scale + ", 0, 0, " + transform.scale + ", " + transform.x + ", " + transform.y + ")";
        }
      }
      function isDomElement(element) {
        return element && element.parentElement && element.style;
      }
    }
  });

  // node_modules/panzoom/index.js
  var require_panzoom = __commonJS({
    "node_modules/panzoom/index.js"(exports, module) {
      "use strict";
      var wheel = require_wheel();
      var animate = require_amator();
      var eventify = require_ngraph();
      var kinetic = require_kinetic();
      var createTextSelectionInterceptor = require_createTextSelectionInterceptor();
      var domTextSelectionInterceptor = createTextSelectionInterceptor();
      var fakeTextSelectorInterceptor = createTextSelectionInterceptor(true);
      var Transform = require_transform();
      var makeSvgController = require_svgController();
      var makeDomController = require_domController();
      var defaultZoomSpeed = 1;
      var defaultDoubleTapZoomSpeed = 1.75;
      var doubleTapSpeedInMS = 300;
      var clickEventTimeInMS = 200;
      module.exports = createPanZoom;
      function createPanZoom(domElement, options) {
        options = options || {};
        var panController = options.controller;
        if (!panController) {
          if (makeSvgController.canAttach(domElement)) {
            panController = makeSvgController(domElement, options);
          } else if (makeDomController.canAttach(domElement)) {
            panController = makeDomController(domElement, options);
          }
        }
        if (!panController) {
          throw new Error(
            "Cannot create panzoom for the current type of dom element"
          );
        }
        var owner = panController.getOwner();
        var storedCTMResult = { x: 0, y: 0 };
        var isDirty = false;
        var transform = new Transform();
        if (panController.initTransform) {
          panController.initTransform(transform);
        }
        var filterKey = typeof options.filterKey === "function" ? options.filterKey : noop;
        var pinchSpeed = typeof options.pinchSpeed === "number" ? options.pinchSpeed : 1;
        var bounds = options.bounds;
        var maxZoom = typeof options.maxZoom === "number" ? options.maxZoom : Number.POSITIVE_INFINITY;
        var minZoom = typeof options.minZoom === "number" ? options.minZoom : 0;
        var boundsPadding = typeof options.boundsPadding === "number" ? options.boundsPadding : 0.05;
        var zoomDoubleClickSpeed = typeof options.zoomDoubleClickSpeed === "number" ? options.zoomDoubleClickSpeed : defaultDoubleTapZoomSpeed;
        var beforeWheel = options.beforeWheel || noop;
        var beforeMouseDown = options.beforeMouseDown || noop;
        var speed = typeof options.zoomSpeed === "number" ? options.zoomSpeed : defaultZoomSpeed;
        var transformOrigin = parseTransformOrigin(options.transformOrigin);
        var textSelection = options.enableTextSelection ? fakeTextSelectorInterceptor : domTextSelectionInterceptor;
        validateBounds(bounds);
        if (options.autocenter) {
          autocenter();
        }
        var frameAnimation;
        var lastTouchEndTime = 0;
        var lastTouchStartTime = 0;
        var pendingClickEventTimeout = 0;
        var lastMouseDownedEvent = null;
        var lastMouseDownTime = /* @__PURE__ */ new Date();
        var lastSingleFingerOffset;
        var touchInProgress = false;
        var panstartFired = false;
        var mouseX;
        var mouseY;
        var clickX;
        var clickY;
        var pinchZoomLength;
        var smoothScroll;
        if ("smoothScroll" in options && !options.smoothScroll) {
          smoothScroll = rigidScroll();
        } else {
          smoothScroll = kinetic(getPoint, scroll, options.smoothScroll);
        }
        var moveByAnimation;
        var zoomToAnimation;
        var multiTouch;
        var paused = false;
        listenForEvents();
        var api = {
          dispose,
          moveBy: internalMoveBy,
          moveTo,
          smoothMoveTo,
          centerOn,
          zoomTo: publicZoomTo,
          zoomAbs,
          smoothZoom,
          smoothZoomAbs,
          showRectangle,
          pause,
          resume,
          isPaused,
          getTransform: getTransformModel,
          getMinZoom,
          setMinZoom,
          getMaxZoom,
          setMaxZoom,
          getTransformOrigin,
          setTransformOrigin,
          getZoomSpeed,
          setZoomSpeed
        };
        eventify(api);
        var initialX = typeof options.initialX === "number" ? options.initialX : transform.x;
        var initialY = typeof options.initialY === "number" ? options.initialY : transform.y;
        var initialZoom = typeof options.initialZoom === "number" ? options.initialZoom : transform.scale;
        if (initialX != transform.x || initialY != transform.y || initialZoom != transform.scale) {
          zoomAbs(initialX, initialY, initialZoom);
        }
        return api;
        function pause() {
          releaseEvents();
          paused = true;
        }
        function resume() {
          if (paused) {
            listenForEvents();
            paused = false;
          }
        }
        function isPaused() {
          return paused;
        }
        function showRectangle(rect) {
          var clientRect = owner.getBoundingClientRect();
          var size = transformToScreen(clientRect.width, clientRect.height);
          var rectWidth = rect.right - rect.left;
          var rectHeight = rect.bottom - rect.top;
          if (!Number.isFinite(rectWidth) || !Number.isFinite(rectHeight)) {
            throw new Error("Invalid rectangle");
          }
          var dw = size.x / rectWidth;
          var dh = size.y / rectHeight;
          var scale = Math.min(dw, dh);
          transform.x = -(rect.left + rectWidth / 2) * scale + size.x / 2;
          transform.y = -(rect.top + rectHeight / 2) * scale + size.y / 2;
          transform.scale = scale;
        }
        function transformToScreen(x, y) {
          if (panController.getScreenCTM) {
            var parentCTM = panController.getScreenCTM();
            var parentScaleX = parentCTM.a;
            var parentScaleY = parentCTM.d;
            var parentOffsetX = parentCTM.e;
            var parentOffsetY = parentCTM.f;
            storedCTMResult.x = x * parentScaleX - parentOffsetX;
            storedCTMResult.y = y * parentScaleY - parentOffsetY;
          } else {
            storedCTMResult.x = x;
            storedCTMResult.y = y;
          }
          return storedCTMResult;
        }
        function autocenter() {
          var w;
          var h;
          var left = 0;
          var top = 0;
          var sceneBoundingBox = getBoundingBox();
          if (sceneBoundingBox) {
            left = sceneBoundingBox.left;
            top = sceneBoundingBox.top;
            w = sceneBoundingBox.right - sceneBoundingBox.left;
            h = sceneBoundingBox.bottom - sceneBoundingBox.top;
          } else {
            var ownerRect = owner.getBoundingClientRect();
            w = ownerRect.width;
            h = ownerRect.height;
          }
          var bbox = panController.getBBox();
          if (bbox.width === 0 || bbox.height === 0) {
            return;
          }
          var dh = h / bbox.height;
          var dw = w / bbox.width;
          var scale = Math.min(dw, dh);
          transform.x = -(bbox.left + bbox.width / 2) * scale + w / 2 + left;
          transform.y = -(bbox.top + bbox.height / 2) * scale + h / 2 + top;
          transform.scale = scale;
        }
        function getTransformModel() {
          return transform;
        }
        function getMinZoom() {
          return minZoom;
        }
        function setMinZoom(newMinZoom) {
          minZoom = newMinZoom;
        }
        function getMaxZoom() {
          return maxZoom;
        }
        function setMaxZoom(newMaxZoom) {
          maxZoom = newMaxZoom;
        }
        function getTransformOrigin() {
          return transformOrigin;
        }
        function setTransformOrigin(newTransformOrigin) {
          transformOrigin = parseTransformOrigin(newTransformOrigin);
        }
        function getZoomSpeed() {
          return speed;
        }
        function setZoomSpeed(newSpeed) {
          if (!Number.isFinite(newSpeed)) {
            throw new Error("Zoom speed should be a number");
          }
          speed = newSpeed;
        }
        function getPoint() {
          return {
            x: transform.x,
            y: transform.y
          };
        }
        function moveTo(x, y) {
          transform.x = x;
          transform.y = y;
          keepTransformInsideBounds();
          triggerEvent("pan");
          makeDirty();
        }
        function moveBy(dx, dy) {
          moveTo(transform.x + dx, transform.y + dy);
        }
        function keepTransformInsideBounds() {
          var boundingBox = getBoundingBox();
          if (!boundingBox) return;
          var adjusted = false;
          var clientRect = getClientRect();
          var diff = boundingBox.left - clientRect.right;
          if (diff > 0) {
            transform.x += diff;
            adjusted = true;
          }
          diff = boundingBox.right - clientRect.left;
          if (diff < 0) {
            transform.x += diff;
            adjusted = true;
          }
          diff = boundingBox.top - clientRect.bottom;
          if (diff > 0) {
            transform.y += diff;
            adjusted = true;
          }
          diff = boundingBox.bottom - clientRect.top;
          if (diff < 0) {
            transform.y += diff;
            adjusted = true;
          }
          return adjusted;
        }
        function getBoundingBox() {
          if (!bounds) return;
          if (typeof bounds === "boolean") {
            var ownerRect = owner.getBoundingClientRect();
            var sceneWidth = ownerRect.width;
            var sceneHeight = ownerRect.height;
            return {
              left: sceneWidth * boundsPadding,
              top: sceneHeight * boundsPadding,
              right: sceneWidth * (1 - boundsPadding),
              bottom: sceneHeight * (1 - boundsPadding)
            };
          }
          return bounds;
        }
        function getClientRect() {
          var bbox = panController.getBBox();
          var leftTop = client(bbox.left, bbox.top);
          return {
            left: leftTop.x,
            top: leftTop.y,
            right: bbox.width * transform.scale + leftTop.x,
            bottom: bbox.height * transform.scale + leftTop.y
          };
        }
        function client(x, y) {
          return {
            x: x * transform.scale + transform.x,
            y: y * transform.scale + transform.y
          };
        }
        function makeDirty() {
          isDirty = true;
          frameAnimation = window.requestAnimationFrame(frame);
        }
        function zoomByRatio(clientX, clientY, ratio) {
          if (isNaN(clientX) || isNaN(clientY) || isNaN(ratio)) {
            throw new Error("zoom requires valid numbers");
          }
          var newScale = transform.scale * ratio;
          if (newScale < minZoom) {
            if (transform.scale === minZoom) return;
            ratio = minZoom / transform.scale;
          }
          if (newScale > maxZoom) {
            if (transform.scale === maxZoom) return;
            ratio = maxZoom / transform.scale;
          }
          var size = transformToScreen(clientX, clientY);
          transform.x = size.x - ratio * (size.x - transform.x);
          transform.y = size.y - ratio * (size.y - transform.y);
          if (bounds && boundsPadding === 1 && minZoom === 1) {
            transform.scale *= ratio;
            keepTransformInsideBounds();
          } else {
            var transformAdjusted = keepTransformInsideBounds();
            if (!transformAdjusted) transform.scale *= ratio;
          }
          triggerEvent("zoom");
          makeDirty();
        }
        function zoomAbs(clientX, clientY, zoomLevel) {
          var ratio = zoomLevel / transform.scale;
          zoomByRatio(clientX, clientY, ratio);
        }
        function centerOn(ui) {
          var parent = ui.ownerSVGElement;
          if (!parent)
            throw new Error("ui element is required to be within the scene");
          var clientRect = ui.getBoundingClientRect();
          var cx = clientRect.left + clientRect.width / 2;
          var cy = clientRect.top + clientRect.height / 2;
          var container = parent.getBoundingClientRect();
          var dx = container.width / 2 - cx;
          var dy = container.height / 2 - cy;
          internalMoveBy(dx, dy, true);
        }
        function smoothMoveTo(x, y) {
          internalMoveBy(x - transform.x, y - transform.y, true);
        }
        function internalMoveBy(dx, dy, smooth) {
          if (!smooth) {
            return moveBy(dx, dy);
          }
          if (moveByAnimation) moveByAnimation.cancel();
          var from = { x: 0, y: 0 };
          var to = { x: dx, y: dy };
          var lastX = 0;
          var lastY = 0;
          moveByAnimation = animate(from, to, {
            step: function(v) {
              moveBy(v.x - lastX, v.y - lastY);
              lastX = v.x;
              lastY = v.y;
            }
          });
        }
        function scroll(x, y) {
          cancelZoomAnimation();
          moveTo(x, y);
        }
        function dispose() {
          releaseEvents();
        }
        function listenForEvents() {
          owner.addEventListener("mousedown", onMouseDown, { passive: false });
          owner.addEventListener("dblclick", onDoubleClick, { passive: false });
          owner.addEventListener("touchstart", onTouch, { passive: false });
          owner.addEventListener("keydown", onKeyDown, { passive: false });
          wheel.addWheelListener(owner, onMouseWheel, { passive: false });
          makeDirty();
        }
        function releaseEvents() {
          wheel.removeWheelListener(owner, onMouseWheel);
          owner.removeEventListener("mousedown", onMouseDown);
          owner.removeEventListener("keydown", onKeyDown);
          owner.removeEventListener("dblclick", onDoubleClick);
          owner.removeEventListener("touchstart", onTouch);
          if (frameAnimation) {
            window.cancelAnimationFrame(frameAnimation);
            frameAnimation = 0;
          }
          smoothScroll.cancel();
          releaseDocumentMouse();
          releaseTouches();
          textSelection.release();
          triggerPanEnd();
        }
        function frame() {
          if (isDirty) applyTransform();
        }
        function applyTransform() {
          isDirty = false;
          panController.applyTransform(transform);
          triggerEvent("transform");
          frameAnimation = 0;
        }
        function onKeyDown(e) {
          var x = 0, y = 0, z = 0;
          if (e.keyCode === 38) {
            y = 1;
          } else if (e.keyCode === 40) {
            y = -1;
          } else if (e.keyCode === 37) {
            x = 1;
          } else if (e.keyCode === 39) {
            x = -1;
          } else if (e.keyCode === 189 || e.keyCode === 109) {
            z = 1;
          } else if (e.keyCode === 187 || e.keyCode === 107) {
            z = -1;
          }
          if (filterKey(e, x, y, z)) {
            return;
          }
          if (x || y) {
            e.preventDefault();
            e.stopPropagation();
            var clientRect = owner.getBoundingClientRect();
            var offset = Math.min(clientRect.width, clientRect.height);
            var moveSpeedRatio = 0.05;
            var dx = offset * moveSpeedRatio * x;
            var dy = offset * moveSpeedRatio * y;
            internalMoveBy(dx, dy);
          }
          if (z) {
            var scaleMultiplier = getScaleMultiplier(z * 100);
            var offset = transformOrigin ? getTransformOriginOffset() : midPoint();
            publicZoomTo(offset.x, offset.y, scaleMultiplier);
          }
        }
        function midPoint() {
          var ownerRect = owner.getBoundingClientRect();
          return {
            x: ownerRect.width / 2,
            y: ownerRect.height / 2
          };
        }
        function onTouch(e) {
          beforeTouch(e);
          clearPendingClickEventTimeout();
          if (e.touches.length === 1) {
            return handleSingleFingerTouch(e, e.touches[0]);
          } else if (e.touches.length === 2) {
            pinchZoomLength = getPinchZoomLength(e.touches[0], e.touches[1]);
            multiTouch = true;
            startTouchListenerIfNeeded();
          }
        }
        function beforeTouch(e) {
          if (options.onTouch && !options.onTouch(e)) {
            return;
          }
          e.stopPropagation();
          e.preventDefault();
        }
        function beforeDoubleClick(e) {
          clearPendingClickEventTimeout();
          if (options.onDoubleClick && !options.onDoubleClick(e)) {
            return;
          }
          e.preventDefault();
          e.stopPropagation();
        }
        function handleSingleFingerTouch(e) {
          lastTouchStartTime = /* @__PURE__ */ new Date();
          var touch = e.touches[0];
          var offset = getOffsetXY(touch);
          lastSingleFingerOffset = offset;
          var point = transformToScreen(offset.x, offset.y);
          mouseX = point.x;
          mouseY = point.y;
          clickX = mouseX;
          clickY = mouseY;
          smoothScroll.cancel();
          startTouchListenerIfNeeded();
        }
        function startTouchListenerIfNeeded() {
          if (touchInProgress) {
            return;
          }
          touchInProgress = true;
          document.addEventListener("touchmove", handleTouchMove);
          document.addEventListener("touchend", handleTouchEnd);
          document.addEventListener("touchcancel", handleTouchEnd);
        }
        function handleTouchMove(e) {
          if (e.touches.length === 1) {
            e.stopPropagation();
            var touch = e.touches[0];
            var offset = getOffsetXY(touch);
            var point = transformToScreen(offset.x, offset.y);
            var dx = point.x - mouseX;
            var dy = point.y - mouseY;
            if (dx !== 0 && dy !== 0) {
              triggerPanStart();
            }
            mouseX = point.x;
            mouseY = point.y;
            internalMoveBy(dx, dy);
          } else if (e.touches.length === 2) {
            multiTouch = true;
            var t1 = e.touches[0];
            var t2 = e.touches[1];
            var currentPinchLength = getPinchZoomLength(t1, t2);
            var scaleMultiplier = 1 + (currentPinchLength / pinchZoomLength - 1) * pinchSpeed;
            var firstTouchPoint = getOffsetXY(t1);
            var secondTouchPoint = getOffsetXY(t2);
            mouseX = (firstTouchPoint.x + secondTouchPoint.x) / 2;
            mouseY = (firstTouchPoint.y + secondTouchPoint.y) / 2;
            if (transformOrigin) {
              var offset = getTransformOriginOffset();
              mouseX = offset.x;
              mouseY = offset.y;
            }
            publicZoomTo(mouseX, mouseY, scaleMultiplier);
            pinchZoomLength = currentPinchLength;
            e.stopPropagation();
            e.preventDefault();
          }
        }
        function clearPendingClickEventTimeout() {
          if (pendingClickEventTimeout) {
            clearTimeout(pendingClickEventTimeout);
            pendingClickEventTimeout = 0;
          }
        }
        function handlePotentialClickEvent(e) {
          if (!options.onClick) return;
          clearPendingClickEventTimeout();
          var dx = mouseX - clickX;
          var dy = mouseY - clickY;
          var l = Math.sqrt(dx * dx + dy * dy);
          if (l > 5) return;
          pendingClickEventTimeout = setTimeout(function() {
            pendingClickEventTimeout = 0;
            options.onClick(e);
          }, doubleTapSpeedInMS);
        }
        function handleTouchEnd(e) {
          clearPendingClickEventTimeout();
          if (e.touches.length > 0) {
            var offset = getOffsetXY(e.touches[0]);
            var point = transformToScreen(offset.x, offset.y);
            mouseX = point.x;
            mouseY = point.y;
          } else {
            var now = /* @__PURE__ */ new Date();
            if (now - lastTouchEndTime < doubleTapSpeedInMS) {
              if (transformOrigin) {
                var offset = getTransformOriginOffset();
                smoothZoom(offset.x, offset.y, zoomDoubleClickSpeed);
              } else {
                smoothZoom(lastSingleFingerOffset.x, lastSingleFingerOffset.y, zoomDoubleClickSpeed);
              }
            } else if (now - lastTouchStartTime < clickEventTimeInMS) {
              handlePotentialClickEvent(e);
            }
            lastTouchEndTime = now;
            triggerPanEnd();
            releaseTouches();
          }
        }
        function getPinchZoomLength(finger1, finger2) {
          var dx = finger1.clientX - finger2.clientX;
          var dy = finger1.clientY - finger2.clientY;
          return Math.sqrt(dx * dx + dy * dy);
        }
        function onDoubleClick(e) {
          beforeDoubleClick(e);
          var offset = getOffsetXY(e);
          if (transformOrigin) {
            offset = getTransformOriginOffset();
          }
          smoothZoom(offset.x, offset.y, zoomDoubleClickSpeed);
        }
        function onMouseDown(e) {
          clearPendingClickEventTimeout();
          if (beforeMouseDown(e)) return;
          lastMouseDownedEvent = e;
          lastMouseDownTime = /* @__PURE__ */ new Date();
          if (touchInProgress) {
            e.stopPropagation();
            return false;
          }
          var isLeftButton = e.button === 1 && window.event !== null || e.button === 0;
          if (!isLeftButton) return;
          smoothScroll.cancel();
          var offset = getOffsetXY(e);
          var point = transformToScreen(offset.x, offset.y);
          clickX = mouseX = point.x;
          clickY = mouseY = point.y;
          document.addEventListener("mousemove", onMouseMove);
          document.addEventListener("mouseup", onMouseUp);
          textSelection.capture(e.target || e.srcElement);
          return false;
        }
        function onMouseMove(e) {
          if (touchInProgress) return;
          triggerPanStart();
          var offset = getOffsetXY(e);
          var point = transformToScreen(offset.x, offset.y);
          var dx = point.x - mouseX;
          var dy = point.y - mouseY;
          mouseX = point.x;
          mouseY = point.y;
          internalMoveBy(dx, dy);
        }
        function onMouseUp() {
          var now = /* @__PURE__ */ new Date();
          if (now - lastMouseDownTime < clickEventTimeInMS) handlePotentialClickEvent(lastMouseDownedEvent);
          textSelection.release();
          triggerPanEnd();
          releaseDocumentMouse();
        }
        function releaseDocumentMouse() {
          document.removeEventListener("mousemove", onMouseMove);
          document.removeEventListener("mouseup", onMouseUp);
          panstartFired = false;
        }
        function releaseTouches() {
          document.removeEventListener("touchmove", handleTouchMove);
          document.removeEventListener("touchend", handleTouchEnd);
          document.removeEventListener("touchcancel", handleTouchEnd);
          panstartFired = false;
          multiTouch = false;
          touchInProgress = false;
        }
        function onMouseWheel(e) {
          if (beforeWheel(e)) return;
          smoothScroll.cancel();
          var delta = e.deltaY;
          if (e.deltaMode > 0) delta *= 100;
          var scaleMultiplier = getScaleMultiplier(delta);
          if (scaleMultiplier !== 1) {
            var offset = transformOrigin ? getTransformOriginOffset() : getOffsetXY(e);
            publicZoomTo(offset.x, offset.y, scaleMultiplier);
            e.preventDefault();
          }
        }
        function getOffsetXY(e) {
          var offsetX, offsetY;
          var ownerRect = owner.getBoundingClientRect();
          offsetX = e.clientX - ownerRect.left;
          offsetY = e.clientY - ownerRect.top;
          return { x: offsetX, y: offsetY };
        }
        function smoothZoom(clientX, clientY, scaleMultiplier) {
          var fromValue = transform.scale;
          var from = { scale: fromValue };
          var to = { scale: scaleMultiplier * fromValue };
          smoothScroll.cancel();
          cancelZoomAnimation();
          zoomToAnimation = animate(from, to, {
            step: function(v) {
              zoomAbs(clientX, clientY, v.scale);
            },
            done: triggerZoomEnd
          });
        }
        function smoothZoomAbs(clientX, clientY, toScaleValue) {
          var fromValue = transform.scale;
          var from = { scale: fromValue };
          var to = { scale: toScaleValue };
          smoothScroll.cancel();
          cancelZoomAnimation();
          zoomToAnimation = animate(from, to, {
            step: function(v) {
              zoomAbs(clientX, clientY, v.scale);
            }
          });
        }
        function getTransformOriginOffset() {
          var ownerRect = owner.getBoundingClientRect();
          return {
            x: ownerRect.width * transformOrigin.x,
            y: ownerRect.height * transformOrigin.y
          };
        }
        function publicZoomTo(clientX, clientY, scaleMultiplier) {
          smoothScroll.cancel();
          cancelZoomAnimation();
          return zoomByRatio(clientX, clientY, scaleMultiplier);
        }
        function cancelZoomAnimation() {
          if (zoomToAnimation) {
            zoomToAnimation.cancel();
            zoomToAnimation = null;
          }
        }
        function getScaleMultiplier(delta) {
          var sign = Math.sign(delta);
          var deltaAdjustedSpeed = Math.min(0.25, Math.abs(speed * delta / 128));
          return 1 - sign * deltaAdjustedSpeed;
        }
        function triggerPanStart() {
          if (!panstartFired) {
            triggerEvent("panstart");
            panstartFired = true;
            smoothScroll.start();
          }
        }
        function triggerPanEnd() {
          if (panstartFired) {
            if (!multiTouch) smoothScroll.stop();
            triggerEvent("panend");
          }
        }
        function triggerZoomEnd() {
          triggerEvent("zoomend");
        }
        function triggerEvent(name) {
          api.fire(name, api);
        }
      }
      function parseTransformOrigin(options) {
        if (!options) return;
        if (typeof options === "object") {
          if (!isNumber(options.x) || !isNumber(options.y))
            failTransformOrigin(options);
          return options;
        }
        failTransformOrigin();
      }
      function failTransformOrigin(options) {
        console.error(options);
        throw new Error(
          [
            "Cannot parse transform origin.",
            "Some good examples:",
            '  "center center" can be achieved with {x: 0.5, y: 0.5}',
            '  "top center" can be achieved with {x: 0.5, y: 0}',
            '  "bottom right" can be achieved with {x: 1, y: 1}'
          ].join("\n")
        );
      }
      function noop() {
      }
      function validateBounds(bounds) {
        var boundsType = typeof bounds;
        if (boundsType === "undefined" || boundsType === "boolean") return;
        var validBounds = isNumber(bounds.left) && isNumber(bounds.top) && isNumber(bounds.bottom) && isNumber(bounds.right);
        if (!validBounds)
          throw new Error(
            "Bounds object is not valid. It can be: undefined, boolean (true|false) or an object {left, top, right, bottom}"
          );
      }
      function isNumber(x) {
        return Number.isFinite(x);
      }
      function isNaN(value) {
        if (Number.isNaN) {
          return Number.isNaN(value);
        }
        return value !== value;
      }
      function rigidScroll() {
        return {
          start: noop,
          stop: noop,
          cancel: noop
        };
      }
      function autoRun() {
        if (typeof document === "undefined") return;
        var scripts = document.getElementsByTagName("script");
        if (!scripts) return;
        var panzoomScript;
        for (var i = 0; i < scripts.length; ++i) {
          var x = scripts[i];
          if (x.src && x.src.match(/\bpanzoom(\.min)?\.js/)) {
            panzoomScript = x;
            break;
          }
        }
        if (!panzoomScript) return;
        var query = panzoomScript.getAttribute("query");
        if (!query) return;
        var globalName = panzoomScript.getAttribute("name") || "pz";
        var started = Date.now();
        tryAttach();
        function tryAttach() {
          var el = document.querySelector(query);
          if (!el) {
            var now = Date.now();
            var elapsed = now - started;
            if (elapsed < 2e3) {
              setTimeout(tryAttach, 100);
              return;
            }
            console.error("Cannot find the panzoom element", globalName);
            return;
          }
          var options = collectOptions(panzoomScript);
          console.log(options);
          window[globalName] = createPanZoom(el, options);
        }
        function collectOptions(script) {
          var attrs = script.attributes;
          var options = {};
          for (var j = 0; j < attrs.length; ++j) {
            var attr = attrs[j];
            var nameValue = getPanzoomAttributeNameValue(attr);
            if (nameValue) {
              options[nameValue.name] = nameValue.value;
            }
          }
          return options;
        }
        function getPanzoomAttributeNameValue(attr) {
          if (!attr.name) return;
          var isPanZoomAttribute = attr.name[0] === "p" && attr.name[1] === "z" && attr.name[2] === "-";
          if (!isPanZoomAttribute) return;
          var name = attr.name.substr(3);
          var value = JSON.parse(attr.value);
          return { name, value };
        }
      }
      autoRun();
    }
  });

  // dist/GameData/Satisfactory.json
  var Satisfactory_default = { gameVersion: "0.8.3.3", machines: [{ id: "Build_SmelterMk1_C", displayName: "Smelter", description: "Smelts ore into ingots.\n\nCan be automated by feeding ore into it with a conveyor belt connected to the input. The produced ingots can be automatically extracted by connecting a conveyor belt to the output.", iconPath: "Buildable/Factory/SmelterMk1/SmelterMk1.png", powerConsumption: 4, powerConsumptionExponent: 1.321929, recipes: [{ id: "Recipe_XmasBall1_C", displayName: "Red FICSMAS Ornament", ingredients: [{ id: "Desc_Gift_C", amount: 1 }], products: [{ id: "Desc_XmasBall1_C", amount: 1 }], manufacturingDuration: 12 }, { id: "Recipe_XmasBall2_C", displayName: "Blue FICSMAS Ornament", ingredients: [{ id: "Desc_Gift_C", amount: 1 }], products: [{ id: "Desc_XmasBall2_C", amount: 2 }], manufacturingDuration: 12 }, { id: "Recipe_IngotIron_C", displayName: "Iron Ingot", ingredients: [{ id: "Desc_OreIron_C", amount: 1 }], products: [{ id: "Desc_IronIngot_C", amount: 1 }], manufacturingDuration: 2 }, { id: "Recipe_IngotCopper_C", displayName: "Copper Ingot", ingredients: [{ id: "Desc_OreCopper_C", amount: 1 }], products: [{ id: "Desc_CopperIngot_C", amount: 1 }], manufacturingDuration: 2 }, { id: "Recipe_IngotCaterium_C", displayName: "Caterium Ingot", ingredients: [{ id: "Desc_OreGold_C", amount: 3 }], products: [{ id: "Desc_GoldIngot_C", amount: 1 }], manufacturingDuration: 4 }], alternateRecipes: [{ id: "Recipe_PureAluminumIngot_C", displayName: "Alternate: Pure Aluminum Ingot", ingredients: [{ id: "Desc_AluminumScrap_C", amount: 2 }], products: [{ id: "Desc_AluminumIngot_C", amount: 1 }], manufacturingDuration: 2 }] }, { id: "Build_ConstructorMk1_C", displayName: "Constructor", description: "Crafts one part into another part.\n\nCan be automated by feeding parts into it with a conveyor belt connected to the input. The produced parts can be automatically extracted by connecting a conveyor belt to the output.", iconPath: "Buildable/Factory/ConstructorMk1/ConstructorMk1.png", powerConsumption: 4, powerConsumptionExponent: 1.321929, recipes: [{ id: "Recipe_Snowball_C", displayName: "Snowball", ingredients: [{ id: "Desc_Snow_C", amount: 3 }], products: [{ id: "Desc_SnowballProjectile_C", amount: 1 }], manufacturingDuration: 12 }, { id: "Recipe_Snow_C", displayName: "Actual Snow", ingredients: [{ id: "Desc_Gift_C", amount: 5 }], products: [{ id: "Desc_Snow_C", amount: 2 }], manufacturingDuration: 12 }, { id: "Recipe_XmasBranch_C", displayName: "FICSMAS Tree Branch", ingredients: [{ id: "Desc_Gift_C", amount: 1 }], products: [{ id: "Desc_XmasBranch_C", amount: 1 }], manufacturingDuration: 6 }, { id: "Recipe_XmasBow_C", displayName: "FICSMAS Bow", ingredients: [{ id: "Desc_Gift_C", amount: 2 }], products: [{ id: "Desc_XmasBow_C", amount: 1 }], manufacturingDuration: 12 }, { id: "Recipe_CandyCane_C", displayName: "Candy Cane", ingredients: [{ id: "Desc_Gift_C", amount: 3 }], products: [{ id: "Desc_CandyCane_C", amount: 1 }], manufacturingDuration: 12 }, { id: "Recipe_IronRod_C", displayName: "Iron Rod", ingredients: [{ id: "Desc_IronIngot_C", amount: 1 }], products: [{ id: "Desc_IronRod_C", amount: 1 }], manufacturingDuration: 4 }, { id: "Recipe_Screw_C", displayName: "Screw", ingredients: [{ id: "Desc_IronRod_C", amount: 1 }], products: [{ id: "Desc_IronScrew_C", amount: 4 }], manufacturingDuration: 6 }, { id: "Recipe_IronPlate_C", displayName: "Iron Plate", ingredients: [{ id: "Desc_IronIngot_C", amount: 3 }], products: [{ id: "Desc_IronPlate_C", amount: 2 }], manufacturingDuration: 6 }, { id: "Recipe_Wire_C", displayName: "Wire", ingredients: [{ id: "Desc_CopperIngot_C", amount: 1 }], products: [{ id: "Desc_Wire_C", amount: 2 }], manufacturingDuration: 4 }, { id: "Recipe_SpikedRebar_C", displayName: "Iron Rebar", ingredients: [{ id: "Desc_IronRod_C", amount: 1 }], products: [{ id: "Desc_SpikedRebar_C", amount: 1 }], manufacturingDuration: 4 }, { id: "Recipe_ColorCartridge_C", displayName: "Color Cartridge", ingredients: [{ id: "Desc_FlowerPetals_C", amount: 5 }], products: [{ id: "Desc_ColorCartridge_C", amount: 10 }], manufacturingDuration: 6 }, { id: "Recipe_Biomass_AlienProtein_C", displayName: "Biomass (Alien Protein)", ingredients: [{ id: "Desc_AlienProtein_C", amount: 1 }], products: [{ id: "Desc_GenericBiomass_C", amount: 100 }], manufacturingDuration: 4 }, { id: "Recipe_Biomass_Mycelia_C", displayName: "Biomass (Mycelia)", ingredients: [{ id: "Desc_Mycelia_C", amount: 1 }], products: [{ id: "Desc_GenericBiomass_C", amount: 10 }], manufacturingDuration: 4 }, { id: "Recipe_Biomass_Leaves_C", displayName: "Biomass (Leaves)", ingredients: [{ id: "Desc_Leaves_C", amount: 10 }], products: [{ id: "Desc_GenericBiomass_C", amount: 5 }], manufacturingDuration: 5 }, { id: "Recipe_Concrete_C", displayName: "Concrete", ingredients: [{ id: "Desc_Stone_C", amount: 3 }], products: [{ id: "Desc_Cement_C", amount: 1 }], manufacturingDuration: 4 }, { id: "Recipe_Silica_C", displayName: "Silica", ingredients: [{ id: "Desc_RawQuartz_C", amount: 3 }], products: [{ id: "Desc_Silica_C", amount: 5 }], manufacturingDuration: 8 }, { id: "Recipe_SteelPipe_C", displayName: "Steel Pipe", ingredients: [{ id: "Desc_SteelIngot_C", amount: 3 }], products: [{ id: "Desc_SteelPipe_C", amount: 2 }], manufacturingDuration: 6 }, { id: "Recipe_CopperSheet_C", displayName: "Copper Sheet", ingredients: [{ id: "Desc_CopperIngot_C", amount: 2 }], products: [{ id: "Desc_CopperSheet_C", amount: 1 }], manufacturingDuration: 6 }, { id: "Recipe_Cable_C", displayName: "Cable", ingredients: [{ id: "Desc_Wire_C", amount: 2 }], products: [{ id: "Desc_Cable_C", amount: 1 }], manufacturingDuration: 2 }, { id: "Recipe_Biomass_Wood_C", displayName: "Biomass (Wood)", ingredients: [{ id: "Desc_Wood_C", amount: 4 }], products: [{ id: "Desc_GenericBiomass_C", amount: 20 }], manufacturingDuration: 4 }, { id: "Recipe_Quickwire_C", displayName: "Quickwire", ingredients: [{ id: "Desc_GoldIngot_C", amount: 1 }], products: [{ id: "Desc_HighSpeedWire_C", amount: 5 }], manufacturingDuration: 5 }, { id: "Recipe_Biofuel_C", displayName: "Solid Biofuel", ingredients: [{ id: "Desc_GenericBiomass_C", amount: 8 }], products: [{ id: "Desc_Biofuel_C", amount: 4 }], manufacturingDuration: 4 }, { id: "Recipe_QuartzCrystal_C", displayName: "Quartz Crystal", ingredients: [{ id: "Desc_RawQuartz_C", amount: 5 }], products: [{ id: "Desc_QuartzCrystal_C", amount: 3 }], manufacturingDuration: 8 }, { id: "Recipe_SteelBeam_C", displayName: "Steel Beam", ingredients: [{ id: "Desc_SteelIngot_C", amount: 4 }], products: [{ id: "Desc_SteelPlate_C", amount: 1 }], manufacturingDuration: 4 }, { id: "Recipe_CopperDust_C", displayName: "Copper Powder", ingredients: [{ id: "Desc_CopperIngot_C", amount: 30 }], products: [{ id: "Desc_CopperDust_C", amount: 5 }], manufacturingDuration: 6 }, { id: "Recipe_FluidCanister_C", displayName: "Empty Canister", ingredients: [{ id: "Desc_Plastic_C", amount: 2 }], products: [{ id: "Desc_FluidCanister_C", amount: 4 }], manufacturingDuration: 4 }, { id: "Recipe_GasTank_C", displayName: "Empty Fluid Tank", ingredients: [{ id: "Desc_AluminumIngot_C", amount: 1 }], products: [{ id: "Desc_GasTank_C", amount: 1 }], manufacturingDuration: 1 }, { id: "Recipe_AluminumCasing_C", displayName: "Aluminum Casing", ingredients: [{ id: "Desc_AluminumIngot_C", amount: 3 }], products: [{ id: "Desc_AluminumCasing_C", amount: 2 }], manufacturingDuration: 2 }, { id: "Recipe_Protein_Stinger_C", displayName: "Stinger Protein", ingredients: [{ id: "Desc_StingerParts_C", amount: 1 }], products: [{ id: "Desc_AlienProtein_C", amount: 1 }], manufacturingDuration: 3 }, { id: "Recipe_Protein_Spitter_C", displayName: "Spitter Protein", ingredients: [{ id: "Desc_SpitterParts_C", amount: 1 }], products: [{ id: "Desc_AlienProtein_C", amount: 1 }], manufacturingDuration: 3 }, { id: "Recipe_Protein_Hog_C", displayName: "Hog Protein", ingredients: [{ id: "Desc_HogParts_C", amount: 1 }], products: [{ id: "Desc_AlienProtein_C", amount: 1 }], manufacturingDuration: 3 }, { id: "Recipe_Protein_Crab_C", displayName: "Hatcher Protein", ingredients: [{ id: "Desc_HatcherParts_C", amount: 1 }], products: [{ id: "Desc_AlienProtein_C", amount: 1 }], manufacturingDuration: 3 }, { id: "Recipe_AlienDNACapsule_C", displayName: "Alien DNA Capsule", ingredients: [{ id: "Desc_AlienProtein_C", amount: 1 }], products: [{ id: "Desc_AlienDNACapsule_C", amount: 1 }], manufacturingDuration: 6 }, { id: "Recipe_PowerCrystalShard_3_C", displayName: "Power Shard (5)", ingredients: [{ id: "Desc_Crystal_mk3_C", amount: 1 }], products: [{ id: "Desc_CrystalShard_C", amount: 5 }], manufacturingDuration: 24 }, { id: "Recipe_PowerCrystalShard_2_C", displayName: "Power Shard (2)", ingredients: [{ id: "Desc_Crystal_mk2_C", amount: 1 }], products: [{ id: "Desc_CrystalShard_C", amount: 2 }], manufacturingDuration: 12 }, { id: "Recipe_PowerCrystalShard_1_C", displayName: "Power Shard (1)", ingredients: [{ id: "Desc_Crystal_C", amount: 1 }], products: [{ id: "Desc_CrystalShard_C", amount: 1 }], manufacturingDuration: 8 }], alternateRecipes: [{ id: "Recipe_Alternate_Screw_C", displayName: "Alternate: Cast Screw", ingredients: [{ id: "Desc_IronIngot_C", amount: 5 }], products: [{ id: "Desc_IronScrew_C", amount: 20 }], manufacturingDuration: 24 }, { id: "Recipe_Alternate_Wire_1_C", displayName: "Alternate: Iron Wire", ingredients: [{ id: "Desc_IronIngot_C", amount: 5 }], products: [{ id: "Desc_Wire_C", amount: 9 }], manufacturingDuration: 24 }, { id: "Recipe_Alternate_SteelRod_C", displayName: "Alternate: Steel Rod", ingredients: [{ id: "Desc_SteelIngot_C", amount: 1 }], products: [{ id: "Desc_IronRod_C", amount: 4 }], manufacturingDuration: 5 }, { id: "Recipe_Alternate_Coal_2_C", displayName: "Alternate: Biocoal", ingredients: [{ id: "Desc_GenericBiomass_C", amount: 5 }], products: [{ id: "Desc_Coal_C", amount: 6 }], manufacturingDuration: 8 }, { id: "Recipe_Alternate_Coal_1_C", displayName: "Alternate: Charcoal", ingredients: [{ id: "Desc_Wood_C", amount: 1 }], products: [{ id: "Desc_Coal_C", amount: 10 }], manufacturingDuration: 4 }, { id: "Recipe_Alternate_Wire_2_C", displayName: "Alternate: Caterium Wire", ingredients: [{ id: "Desc_GoldIngot_C", amount: 1 }], products: [{ id: "Desc_Wire_C", amount: 8 }], manufacturingDuration: 4 }, { id: "Recipe_Alternate_SteelCanister_C", displayName: "Alternate: Steel Canister", ingredients: [{ id: "Desc_SteelIngot_C", amount: 3 }], products: [{ id: "Desc_FluidCanister_C", amount: 2 }], manufacturingDuration: 3 }, { id: "Recipe_Alternate_Screw_2_C", displayName: "Alternate: Steel Screw", ingredients: [{ id: "Desc_SteelPlate_C", amount: 1 }], products: [{ id: "Desc_IronScrew_C", amount: 52 }], manufacturingDuration: 12 }] }, { id: "Build_AssemblerMk1_C", displayName: "Assembler", description: "Crafts two parts into another part.\n\nCan be automated by feeding parts into it with a conveyor belt connected to the input. The produced parts can be automatically extracted by connecting a conveyor belt to the output.", iconPath: "Buildable/Factory/AssemblerMk1/AssemblerMk1.png", powerConsumption: 15, powerConsumptionExponent: 1.321929, recipes: [{ id: "Recipe_XmasStar_C", displayName: "FICSMAS Wonder Star", ingredients: [{ id: "Desc_XmasWreath_C", amount: 5 }, { id: "Desc_CandyCane_C", amount: 20 }], products: [{ id: "Desc_XmasStar_C", amount: 1 }], manufacturingDuration: 60 }, { id: "Recipe_XmasWreath_C", displayName: "FICSMAS Decoration", ingredients: [{ id: "Desc_XmasBranch_C", amount: 15 }, { id: "Desc_XmasBallCluster_C", amount: 6 }], products: [{ id: "Desc_XmasWreath_C", amount: 2 }], manufacturingDuration: 60 }, { id: "Recipe_XmasBallCluster_C", displayName: "FICSMAS Ornament Bundle", ingredients: [{ id: "Desc_XmasBall3_C", amount: 1 }, { id: "Desc_XmasBall4_C", amount: 1 }], products: [{ id: "Desc_XmasBallCluster_C", amount: 1 }], manufacturingDuration: 12 }, { id: "Recipe_Fireworks_03_C", displayName: "Sparkly Fireworks", ingredients: [{ id: "Desc_XmasBranch_C", amount: 3 }, { id: "Desc_Snow_C", amount: 2 }], products: [{ id: "Desc_Fireworks_Projectile_03_C", amount: 1 }], manufacturingDuration: 24 }, { id: "Recipe_Gunpowder_C", displayName: "Black Powder", ingredients: [{ id: "Desc_Coal_C", amount: 1 }, { id: "Desc_Sulfur_C", amount: 1 }], products: [{ id: "Desc_Gunpowder_C", amount: 2 }], manufacturingDuration: 4 }, { id: "Recipe_Fireworks_02_C", displayName: "Fancy Fireworks", ingredients: [{ id: "Desc_XmasBranch_C", amount: 4 }, { id: "Desc_XmasBow_C", amount: 3 }], products: [{ id: "Desc_Fireworks_Projectile_02_C", amount: 1 }], manufacturingDuration: 24 }, { id: "Recipe_Fireworks_01_C", displayName: "Sweet Fireworks", ingredients: [{ id: "Desc_XmasBranch_C", amount: 6 }, { id: "Desc_CandyCane_C", amount: 3 }], products: [{ id: "Desc_Fireworks_Projectile_01_C", amount: 1 }], manufacturingDuration: 24 }, { id: "Recipe_Cartridge_C", displayName: "Rifle Ammo", ingredients: [{ id: "Desc_CopperSheet_C", amount: 3 }, { id: "Desc_GunpowderMK2_C", amount: 2 }], products: [{ id: "Desc_CartridgeStandard_C", amount: 15 }], manufacturingDuration: 12 }, { id: "Recipe_IronPlateReinforced_C", displayName: "Reinforced Iron Plate", ingredients: [{ id: "Desc_IronPlate_C", amount: 6 }, { id: "Desc_IronScrew_C", amount: 12 }], products: [{ id: "Desc_IronPlateReinforced_C", amount: 1 }], manufacturingDuration: 12 }, { id: "Recipe_Rotor_C", displayName: "Rotor", ingredients: [{ id: "Desc_IronRod_C", amount: 5 }, { id: "Desc_IronScrew_C", amount: 25 }], products: [{ id: "Desc_Rotor_C", amount: 1 }], manufacturingDuration: 15 }, { id: "Recipe_Fabric_C", displayName: "Fabric", ingredients: [{ id: "Desc_Mycelia_C", amount: 1 }, { id: "Desc_GenericBiomass_C", amount: 5 }], products: [{ id: "Desc_Fabric_C", amount: 1 }], manufacturingDuration: 4 }, { id: "Recipe_Nobelisk_C", displayName: "Nobelisk", ingredients: [{ id: "Desc_Gunpowder_C", amount: 2 }, { id: "Desc_SteelPipe_C", amount: 2 }], products: [{ id: "Desc_NobeliskExplosive_C", amount: 1 }], manufacturingDuration: 6 }, { id: "Recipe_Rebar_Stunshot_C", displayName: "Stun Rebar", ingredients: [{ id: "Desc_SpikedRebar_C", amount: 1 }, { id: "Desc_HighSpeedWire_C", amount: 5 }], products: [{ id: "Desc_Rebar_Stunshot_C", amount: 1 }], manufacturingDuration: 6 }, { id: "Recipe_Stator_C", displayName: "Stator", ingredients: [{ id: "Desc_SteelPipe_C", amount: 3 }, { id: "Desc_Wire_C", amount: 8 }], products: [{ id: "Desc_Stator_C", amount: 1 }], manufacturingDuration: 12 }, { id: "Recipe_AluminumSheet_C", displayName: "Alclad Aluminum Sheet", ingredients: [{ id: "Desc_AluminumIngot_C", amount: 3 }, { id: "Desc_CopperIngot_C", amount: 1 }], products: [{ id: "Desc_AluminumPlate_C", amount: 3 }], manufacturingDuration: 6 }, { id: "Recipe_Rebar_Spreadshot_C", displayName: "Shatter Rebar", ingredients: [{ id: "Desc_SpikedRebar_C", amount: 2 }, { id: "Desc_QuartzCrystal_C", amount: 3 }], products: [{ id: "Desc_Rebar_Spreadshot_C", amount: 1 }], manufacturingDuration: 12 }, { id: "Recipe_ModularFrame_C", displayName: "Modular Frame", ingredients: [{ id: "Desc_IronPlateReinforced_C", amount: 3 }, { id: "Desc_IronRod_C", amount: 12 }], products: [{ id: "Desc_ModularFrame_C", amount: 2 }], manufacturingDuration: 60 }, { id: "Recipe_SpaceElevatorPart_1_C", displayName: "Smart Plating", ingredients: [{ id: "Desc_IronPlateReinforced_C", amount: 1 }, { id: "Desc_Rotor_C", amount: 1 }], products: [{ id: "Desc_SpaceElevatorPart_1_C", amount: 1 }], manufacturingDuration: 30 }, { id: "Recipe_NobeliskGas_C", displayName: "Gas Nobelisk", ingredients: [{ id: "Desc_NobeliskExplosive_C", amount: 1 }, { id: "Desc_GenericBiomass_C", amount: 10 }], products: [{ id: "Desc_NobeliskGas_C", amount: 1 }], manufacturingDuration: 12 }, { id: "Recipe_EncasedIndustrialBeam_C", displayName: "Encased Industrial Beam", ingredients: [{ id: "Desc_SteelPlate_C", amount: 4 }, { id: "Desc_Cement_C", amount: 5 }], products: [{ id: "Desc_SteelPlateReinforced_C", amount: 1 }], manufacturingDuration: 10 }, { id: "Recipe_CircuitBoard_C", displayName: "Circuit Board", ingredients: [{ id: "Desc_CopperSheet_C", amount: 2 }, { id: "Desc_Plastic_C", amount: 4 }], products: [{ id: "Desc_CircuitBoard_C", amount: 1 }], manufacturingDuration: 8 }, { id: "Recipe_AILimiter_C", displayName: "AI Limiter", ingredients: [{ id: "Desc_CopperSheet_C", amount: 5 }, { id: "Desc_HighSpeedWire_C", amount: 20 }], products: [{ id: "Desc_CircuitBoardHighSpeed_C", amount: 1 }], manufacturingDuration: 12 }, { id: "Recipe_SpaceElevatorPart_2_C", displayName: "Versatile Framework", ingredients: [{ id: "Desc_ModularFrame_C", amount: 1 }, { id: "Desc_SteelPlate_C", amount: 12 }], products: [{ id: "Desc_SpaceElevatorPart_2_C", amount: 2 }], manufacturingDuration: 24 }, { id: "Recipe_NobeliskCluster_C", displayName: "Cluster Nobelisk", ingredients: [{ id: "Desc_NobeliskExplosive_C", amount: 3 }, { id: "Desc_GunpowderMK2_C", amount: 4 }], products: [{ id: "Desc_NobeliskCluster_C", amount: 1 }], manufacturingDuration: 24 }, { id: "Recipe_SpaceElevatorPart_3_C", displayName: "Automated Wiring", ingredients: [{ id: "Desc_Stator_C", amount: 1 }, { id: "Desc_Cable_C", amount: 20 }], products: [{ id: "Desc_SpaceElevatorPart_3_C", amount: 1 }], manufacturingDuration: 24 }, { id: "Recipe_Motor_C", displayName: "Motor", ingredients: [{ id: "Desc_Rotor_C", amount: 2 }, { id: "Desc_Stator_C", amount: 2 }], products: [{ id: "Desc_Motor_C", amount: 1 }], manufacturingDuration: 12 }, { id: "Recipe_ElectromagneticControlRod_C", displayName: "Electromagnetic Control Rod", ingredients: [{ id: "Desc_Stator_C", amount: 3 }, { id: "Desc_CircuitBoardHighSpeed_C", amount: 2 }], products: [{ id: "Desc_ElectromagneticControlRod_C", amount: 2 }], manufacturingDuration: 30 }, { id: "Recipe_HeatSink_C", displayName: "Heat Sink", ingredients: [{ id: "Desc_AluminumPlate_C", amount: 5 }, { id: "Desc_CopperSheet_C", amount: 3 }], products: [{ id: "Desc_AluminumPlateReinforced_C", amount: 1 }], manufacturingDuration: 8 }, { id: "Recipe_NobeliskShockwave_C", displayName: "Pulse Nobelisk", ingredients: [{ id: "Desc_NobeliskExplosive_C", amount: 5 }, { id: "Desc_CrystalOscillator_C", amount: 1 }], products: [{ id: "Desc_NobeliskShockwave_C", amount: 5 }], manufacturingDuration: 60 }, { id: "Recipe_CartridgeSmart_C", displayName: "Homing Rifle Ammo", ingredients: [{ id: "Desc_CartridgeStandard_C", amount: 20 }, { id: "Desc_HighSpeedConnector_C", amount: 1 }], products: [{ id: "Desc_CartridgeSmartProjectile_C", amount: 10 }], manufacturingDuration: 24 }, { id: "Recipe_PlutoniumCell_C", displayName: "Encased Plutonium Cell", ingredients: [{ id: "Desc_PlutoniumPellet_C", amount: 2 }, { id: "Desc_Cement_C", amount: 4 }], products: [{ id: "Desc_PlutoniumCell_C", amount: 1 }], manufacturingDuration: 12 }, { id: "Recipe_PressureConversionCube_C", displayName: "Pressure Conversion Cube", ingredients: [{ id: "Desc_ModularFrameFused_C", amount: 1 }, { id: "Desc_ModularFrameLightweight_C", amount: 2 }], products: [{ id: "Desc_PressureConversionCube_C", amount: 1 }], manufacturingDuration: 60 }, { id: "Recipe_SpaceElevatorPart_7_C", displayName: "Assembly Director System", ingredients: [{ id: "Desc_SpaceElevatorPart_5_C", amount: 2 }, { id: "Desc_ComputerSuper_C", amount: 1 }], products: [{ id: "Desc_SpaceElevatorPart_7_C", amount: 1 }], manufacturingDuration: 80 }], alternateRecipes: [{ id: "Recipe_Alternate_Silica_C", displayName: "Alternate: Cheap Silica", ingredients: [{ id: "Desc_RawQuartz_C", amount: 3 }, { id: "Desc_Stone_C", amount: 5 }], products: [{ id: "Desc_Silica_C", amount: 7 }], manufacturingDuration: 16 }, { id: "Recipe_Alternate_Concrete_C", displayName: "Alternate: Fine Concrete", ingredients: [{ id: "Desc_Silica_C", amount: 3 }, { id: "Desc_Stone_C", amount: 12 }], products: [{ id: "Desc_Cement_C", amount: 10 }], manufacturingDuration: 24 }, { id: "Recipe_Alternate_EnrichedCoal_C", displayName: "Alternate: Compacted Coal", ingredients: [{ id: "Desc_Coal_C", amount: 5 }, { id: "Desc_Sulfur_C", amount: 5 }], products: [{ id: "Desc_CompactedCoal_C", amount: 5 }], manufacturingDuration: 12 }, { id: "Recipe_Alternate_Gunpowder_1_C", displayName: "Alternate: Fine Black Powder", ingredients: [{ id: "Desc_Sulfur_C", amount: 2 }, { id: "Desc_CompactedCoal_C", amount: 1 }], products: [{ id: "Desc_Gunpowder_C", amount: 4 }], manufacturingDuration: 16 }, { id: "Recipe_Alternate_FusedWire_C", displayName: "Alternate: Fused Wire", ingredients: [{ id: "Desc_CopperIngot_C", amount: 4 }, { id: "Desc_GoldIngot_C", amount: 1 }], products: [{ id: "Desc_Wire_C", amount: 30 }], manufacturingDuration: 20 }, { id: "Recipe_Alternate_Quickwire_C", displayName: "Alternate: Fused Quickwire", ingredients: [{ id: "Desc_GoldIngot_C", amount: 1 }, { id: "Desc_CopperIngot_C", amount: 5 }], products: [{ id: "Desc_HighSpeedWire_C", amount: 12 }], manufacturingDuration: 8 }, { id: "Recipe_Alternate_RubberConcrete_C", displayName: "Alternate: Rubber Concrete", ingredients: [{ id: "Desc_Stone_C", amount: 10 }, { id: "Desc_Rubber_C", amount: 2 }], products: [{ id: "Desc_Cement_C", amount: 9 }], manufacturingDuration: 12 }, { id: "Recipe_Alternate_CoatedIronCanister_C", displayName: "Alternate: Coated Iron Canister", ingredients: [{ id: "Desc_IronPlate_C", amount: 2 }, { id: "Desc_CopperSheet_C", amount: 1 }], products: [{ id: "Desc_FluidCanister_C", amount: 4 }], manufacturingDuration: 4 }, { id: "Recipe_Alternate_Cable_2_C", displayName: "Alternate: Quickwire Cable", ingredients: [{ id: "Desc_HighSpeedWire_C", amount: 3 }, { id: "Desc_Rubber_C", amount: 2 }], products: [{ id: "Desc_Cable_C", amount: 11 }], manufacturingDuration: 24 }, { id: "Recipe_Alternate_Cable_1_C", displayName: "Alternate: Insulated Cable", ingredients: [{ id: "Desc_Wire_C", amount: 9 }, { id: "Desc_Rubber_C", amount: 6 }], products: [{ id: "Desc_Cable_C", amount: 20 }], manufacturingDuration: 12 }, { id: "Recipe_Alternate_SteelCoatedPlate_C", displayName: "Alternate: Steel Coated Plate", ingredients: [{ id: "Desc_SteelIngot_C", amount: 3 }, { id: "Desc_Plastic_C", amount: 2 }], products: [{ id: "Desc_IronPlate_C", amount: 18 }], manufacturingDuration: 24 }, { id: "Recipe_Alternate_CoatedIronPlate_C", displayName: "Alternate: Coated Iron Plate", ingredients: [{ id: "Desc_IronIngot_C", amount: 10 }, { id: "Desc_Plastic_C", amount: 2 }], products: [{ id: "Desc_IronPlate_C", amount: 15 }], manufacturingDuration: 12 }, { id: "Recipe_Alternate_AdheredIronPlate_C", displayName: "Alternate: Adhered Iron Plate", ingredients: [{ id: "Desc_IronPlate_C", amount: 3 }, { id: "Desc_Rubber_C", amount: 1 }], products: [{ id: "Desc_IronPlateReinforced_C", amount: 1 }], manufacturingDuration: 16 }, { id: "Recipe_Alternate_ReinforcedIronPlate_2_C", displayName: "Alternate: Stitched Iron Plate", ingredients: [{ id: "Desc_IronPlate_C", amount: 10 }, { id: "Desc_Wire_C", amount: 20 }], products: [{ id: "Desc_IronPlateReinforced_C", amount: 3 }], manufacturingDuration: 32 }, { id: "Recipe_Alternate_ReinforcedIronPlate_1_C", displayName: "Alternate: Bolted Iron Plate", ingredients: [{ id: "Desc_IronPlate_C", amount: 18 }, { id: "Desc_IronScrew_C", amount: 50 }], products: [{ id: "Desc_IronPlateReinforced_C", amount: 3 }], manufacturingDuration: 12 }, { id: "Recipe_Alternate_CopperRotor_C", displayName: "Alternate: Copper Rotor", ingredients: [{ id: "Desc_CopperSheet_C", amount: 6 }, { id: "Desc_IronScrew_C", amount: 52 }], products: [{ id: "Desc_Rotor_C", amount: 3 }], manufacturingDuration: 16 }, { id: "Recipe_Alternate_Rotor_C", displayName: "Alternate: Steel Rotor", ingredients: [{ id: "Desc_SteelPipe_C", amount: 2 }, { id: "Desc_Wire_C", amount: 6 }], products: [{ id: "Desc_Rotor_C", amount: 1 }], manufacturingDuration: 12 }, { id: "Recipe_Alternate_Stator_C", displayName: "Alternate: Quickwire Stator", ingredients: [{ id: "Desc_SteelPipe_C", amount: 4 }, { id: "Desc_HighSpeedWire_C", amount: 15 }], products: [{ id: "Desc_Stator_C", amount: 2 }], manufacturingDuration: 15 }, { id: "Recipe_Alternate_AlcladCasing_C", displayName: "Alternate: Alclad Casing", ingredients: [{ id: "Desc_AluminumIngot_C", amount: 20 }, { id: "Desc_CopperIngot_C", amount: 10 }], products: [{ id: "Desc_AluminumCasing_C", amount: 15 }], manufacturingDuration: 8 }, { id: "Recipe_Alternate_BoltedFrame_C", displayName: "Alternate: Bolted Frame", ingredients: [{ id: "Desc_IronPlateReinforced_C", amount: 3 }, { id: "Desc_IronScrew_C", amount: 56 }], products: [{ id: "Desc_ModularFrame_C", amount: 2 }], manufacturingDuration: 24 }, { id: "Recipe_Alternate_ModularFrame_C", displayName: "Alternate: Steeled Frame", ingredients: [{ id: "Desc_IronPlateReinforced_C", amount: 2 }, { id: "Desc_SteelPipe_C", amount: 10 }], products: [{ id: "Desc_ModularFrame_C", amount: 3 }], manufacturingDuration: 60 }, { id: "Recipe_Alternate_EncasedIndustrialBeam_C", displayName: "Alternate: Encased Industrial Pipe", ingredients: [{ id: "Desc_SteelPipe_C", amount: 7 }, { id: "Desc_Cement_C", amount: 5 }], products: [{ id: "Desc_SteelPlateReinforced_C", amount: 1 }], manufacturingDuration: 15 }, { id: "Recipe_Alternate_ElectrodeCircuitBoard_C", displayName: "Alternate: Electrode Circuit Board", ingredients: [{ id: "Desc_Rubber_C", amount: 6 }, { id: "Desc_PetroleumCoke_C", amount: 9 }], products: [{ id: "Desc_CircuitBoard_C", amount: 1 }], manufacturingDuration: 12 }, { id: "Recipe_Alternate_CircuitBoard_2_C", displayName: "Alternate: Caterium Circuit Board", ingredients: [{ id: "Desc_Plastic_C", amount: 10 }, { id: "Desc_HighSpeedWire_C", amount: 30 }], products: [{ id: "Desc_CircuitBoard_C", amount: 7 }], manufacturingDuration: 48 }, { id: "Recipe_Alternate_CircuitBoard_1_C", displayName: "Alternate: Silicon Circuit Board", ingredients: [{ id: "Desc_CopperSheet_C", amount: 11 }, { id: "Desc_Silica_C", amount: 11 }], products: [{ id: "Desc_CircuitBoard_C", amount: 5 }], manufacturingDuration: 24 }, { id: "Recipe_Alternate_ElectricMotor_C", displayName: "Alternate: Electric Motor", ingredients: [{ id: "Desc_ElectromagneticControlRod_C", amount: 1 }, { id: "Desc_Rotor_C", amount: 2 }], products: [{ id: "Desc_Motor_C", amount: 2 }], manufacturingDuration: 16 }, { id: "Recipe_Alternate_HeatSink_1_C", displayName: "Alternate: Heat Exchanger", ingredients: [{ id: "Desc_AluminumCasing_C", amount: 3 }, { id: "Desc_Rubber_C", amount: 3 }], products: [{ id: "Desc_AluminumPlateReinforced_C", amount: 1 }], manufacturingDuration: 6 }, { id: "Recipe_Alternate_ElectromagneticControlRod_1_C", displayName: "Alternate: Electromagnetic Connection Rod", ingredients: [{ id: "Desc_Stator_C", amount: 2 }, { id: "Desc_HighSpeedConnector_C", amount: 1 }], products: [{ id: "Desc_ElectromagneticControlRod_C", amount: 2 }], manufacturingDuration: 15 }, { id: "Recipe_Alternate_Computer_2_C", displayName: "Alternate: Crystal Computer", ingredients: [{ id: "Desc_CircuitBoard_C", amount: 8 }, { id: "Desc_CrystalOscillator_C", amount: 3 }], products: [{ id: "Desc_Computer_C", amount: 3 }], manufacturingDuration: 64 }, { id: "Recipe_Alternate_OCSupercomputer_C", displayName: "Alternate: OC Supercomputer", ingredients: [{ id: "Desc_ModularFrameLightweight_C", amount: 3 }, { id: "Desc_CoolingSystem_C", amount: 3 }], products: [{ id: "Desc_ComputerSuper_C", amount: 1 }], manufacturingDuration: 20 }, { id: "Recipe_Alternate_PlutoniumFuelUnit_C", displayName: "Alternate: Plutonium Fuel Unit", ingredients: [{ id: "Desc_PlutoniumCell_C", amount: 20 }, { id: "Desc_PressureConversionCube_C", amount: 1 }], products: [{ id: "Desc_PlutoniumFuelRod_C", amount: 1 }], manufacturingDuration: 120 }] }, { id: "Build_FoundryMk1_C", displayName: "Foundry", description: "Smelts two resources into alloy ingots.\n\nCan be automated by feeding ore into it with a conveyor belt connected to the inputs. The produced ingots can be automatically extracted by connecting a conveyor belt to the output.", iconPath: "Buildable/Factory/FoundryMk1/Foundry.png", powerConsumption: 16, powerConsumptionExponent: 1.321929, recipes: [{ id: "Recipe_XmasBall4_C", displayName: "Iron FICSMAS Ornament", ingredients: [{ id: "Desc_XmasBall2_C", amount: 3 }, { id: "Desc_IronIngot_C", amount: 3 }], products: [{ id: "Desc_XmasBall4_C", amount: 1 }], manufacturingDuration: 12 }, { id: "Recipe_XmasBall3_C", displayName: "Copper FICSMAS Ornament", ingredients: [{ id: "Desc_XmasBall1_C", amount: 2 }, { id: "Desc_CopperIngot_C", amount: 2 }], products: [{ id: "Desc_XmasBall3_C", amount: 1 }], manufacturingDuration: 12 }, { id: "Recipe_IngotSteel_C", displayName: "Steel Ingot", ingredients: [{ id: "Desc_OreIron_C", amount: 3 }, { id: "Desc_Coal_C", amount: 3 }], products: [{ id: "Desc_SteelIngot_C", amount: 3 }], manufacturingDuration: 4 }, { id: "Recipe_IngotAluminum_C", displayName: "Aluminum Ingot", ingredients: [{ id: "Desc_AluminumScrap_C", amount: 6 }, { id: "Desc_Silica_C", amount: 5 }], products: [{ id: "Desc_AluminumIngot_C", amount: 4 }], manufacturingDuration: 4 }], alternateRecipes: [{ id: "Recipe_Alternate_IngotIron_C", displayName: "Alternate: Iron Alloy Ingot", ingredients: [{ id: "Desc_OreIron_C", amount: 2 }, { id: "Desc_OreCopper_C", amount: 2 }], products: [{ id: "Desc_IronIngot_C", amount: 5 }], manufacturingDuration: 6 }, { id: "Recipe_Alternate_CopperAlloyIngot_C", displayName: "Alternate: Copper Alloy Ingot", ingredients: [{ id: "Desc_OreCopper_C", amount: 10 }, { id: "Desc_OreIron_C", amount: 5 }], products: [{ id: "Desc_CopperIngot_C", amount: 20 }], manufacturingDuration: 12 }, { id: "Recipe_Alternate_IngotSteel_1_C", displayName: "Alternate: Solid Steel Ingot", ingredients: [{ id: "Desc_IronIngot_C", amount: 2 }, { id: "Desc_Coal_C", amount: 2 }], products: [{ id: "Desc_SteelIngot_C", amount: 3 }], manufacturingDuration: 3 }, { id: "Recipe_Alternate_CokeSteelIngot_C", displayName: "Alternate: Coke Steel Ingot", ingredients: [{ id: "Desc_OreIron_C", amount: 15 }, { id: "Desc_PetroleumCoke_C", amount: 15 }], products: [{ id: "Desc_SteelIngot_C", amount: 20 }], manufacturingDuration: 12 }, { id: "Recipe_Alternate_IngotSteel_2_C", displayName: "Alternate: Compacted Steel Ingot", ingredients: [{ id: "Desc_OreIron_C", amount: 6 }, { id: "Desc_CompactedCoal_C", amount: 3 }], products: [{ id: "Desc_SteelIngot_C", amount: 10 }], manufacturingDuration: 16 }] }, { id: "Build_OilRefinery_C", displayName: "Refinery", description: "Refines fluid and/or solid parts into other parts.\nHead Lift: 10 meters.\n(Allows fluids to be transported 10 meters upwards.)\n\nContains both a Conveyor Belt and Pipe input and output, to allow for the automation of various recipes.", iconPath: "Buildable/Factory/OilRefinery/OilRefinery.png", powerConsumption: 30, powerConsumptionExponent: 1.321929, recipes: [{ id: "Recipe_SulfuricAcid_C", displayName: "Sulfuric Acid", ingredients: [{ id: "Desc_Sulfur_C", amount: 5 }, { id: "Desc_Water_C", amount: 5 }], products: [{ id: "Desc_SulfuricAcid_C", amount: 5 }], manufacturingDuration: 6 }, { id: "Recipe_AluminaSolution_C", displayName: "Alumina Solution", ingredients: [{ id: "Desc_OreBauxite_C", amount: 12 }, { id: "Desc_Water_C", amount: 18 }], products: [{ id: "Desc_AluminaSolution_C", amount: 12 }, { id: "Desc_Silica_C", amount: 5 }], manufacturingDuration: 6 }, { id: "Recipe_AluminumScrap_C", displayName: "Aluminum Scrap", ingredients: [{ id: "Desc_AluminaSolution_C", amount: 4 }, { id: "Desc_Coal_C", amount: 2 }], products: [{ id: "Desc_AluminumScrap_C", amount: 6 }, { id: "Desc_Water_C", amount: 2 }], manufacturingDuration: 1 }, { id: "Recipe_PetroleumCoke_C", displayName: "Petroleum Coke", ingredients: [{ id: "Desc_HeavyOilResidue_C", amount: 4 }], products: [{ id: "Desc_PetroleumCoke_C", amount: 12 }], manufacturingDuration: 6 }, { id: "Recipe_GunpowderMK2_C", displayName: "Smokeless Powder", ingredients: [{ id: "Desc_Gunpowder_C", amount: 2 }, { id: "Desc_HeavyOilResidue_C", amount: 1 }], products: [{ id: "Desc_GunpowderMK2_C", amount: 2 }], manufacturingDuration: 6 }, { id: "Recipe_Rubber_C", displayName: "Rubber", ingredients: [{ id: "Desc_LiquidOil_C", amount: 3 }], products: [{ id: "Desc_Rubber_C", amount: 2 }, { id: "Desc_HeavyOilResidue_C", amount: 2 }], manufacturingDuration: 6 }, { id: "Recipe_ResidualRubber_C", displayName: "Residual Rubber", ingredients: [{ id: "Desc_PolymerResin_C", amount: 4 }, { id: "Desc_Water_C", amount: 4 }], products: [{ id: "Desc_Rubber_C", amount: 2 }], manufacturingDuration: 6 }, { id: "Recipe_LiquidFuel_C", displayName: "Fuel", ingredients: [{ id: "Desc_LiquidOil_C", amount: 6 }], products: [{ id: "Desc_LiquidFuel_C", amount: 4 }, { id: "Desc_PolymerResin_C", amount: 3 }], manufacturingDuration: 6 }, { id: "Recipe_Plastic_C", displayName: "Plastic", ingredients: [{ id: "Desc_LiquidOil_C", amount: 3 }], products: [{ id: "Desc_Plastic_C", amount: 2 }, { id: "Desc_HeavyOilResidue_C", amount: 1 }], manufacturingDuration: 6 }, { id: "Recipe_ResidualFuel_C", displayName: "Residual Fuel", ingredients: [{ id: "Desc_HeavyOilResidue_C", amount: 6 }], products: [{ id: "Desc_LiquidFuel_C", amount: 4 }], manufacturingDuration: 6 }, { id: "Recipe_ResidualPlastic_C", displayName: "Residual Plastic", ingredients: [{ id: "Desc_PolymerResin_C", amount: 6 }, { id: "Desc_Water_C", amount: 2 }], products: [{ id: "Desc_Plastic_C", amount: 2 }], manufacturingDuration: 6 }, { id: "Recipe_Alternate_Turbofuel_C", displayName: "Turbofuel", ingredients: [{ id: "Desc_LiquidFuel_C", amount: 6 }, { id: "Desc_CompactedCoal_C", amount: 4 }], products: [{ id: "Desc_LiquidTurboFuel_C", amount: 5 }], manufacturingDuration: 16 }, { id: "Recipe_LiquidBiofuel_C", displayName: "Liquid Biofuel", ingredients: [{ id: "Desc_Biofuel_C", amount: 6 }, { id: "Desc_Water_C", amount: 3 }], products: [{ id: "Desc_LiquidBiofuel_C", amount: 4 }], manufacturingDuration: 4 }], alternateRecipes: [{ id: "Recipe_Alternate_PureIronIngot_C", displayName: "Alternate: Pure Iron Ingot", ingredients: [{ id: "Desc_OreIron_C", amount: 7 }, { id: "Desc_Water_C", amount: 4 }], products: [{ id: "Desc_IronIngot_C", amount: 13 }], manufacturingDuration: 12 }, { id: "Recipe_Alternate_PureCopperIngot_C", displayName: "Alternate: Pure Copper Ingot", ingredients: [{ id: "Desc_OreCopper_C", amount: 6 }, { id: "Desc_Water_C", amount: 4 }], products: [{ id: "Desc_CopperIngot_C", amount: 15 }], manufacturingDuration: 24 }, { id: "Recipe_Alternate_WetConcrete_C", displayName: "Alternate: Wet Concrete", ingredients: [{ id: "Desc_Stone_C", amount: 6 }, { id: "Desc_Water_C", amount: 5 }], products: [{ id: "Desc_Cement_C", amount: 4 }], manufacturingDuration: 3 }, { id: "Recipe_Alternate_SloppyAlumina_C", displayName: "Alternate: Sloppy Alumina", ingredients: [{ id: "Desc_OreBauxite_C", amount: 10 }, { id: "Desc_Water_C", amount: 10 }], products: [{ id: "Desc_AluminaSolution_C", amount: 12 }], manufacturingDuration: 3 }, { id: "Recipe_Alternate_SteamedCopperSheet_C", displayName: "Alternate: Steamed Copper Sheet", ingredients: [{ id: "Desc_CopperIngot_C", amount: 3 }, { id: "Desc_Water_C", amount: 3 }], products: [{ id: "Desc_CopperSheet_C", amount: 3 }], manufacturingDuration: 8 }, { id: "Recipe_Alternate_ElectroAluminumScrap_C", displayName: "Alternate: Electrode Aluminum Scrap", ingredients: [{ id: "Desc_AluminaSolution_C", amount: 12 }, { id: "Desc_PetroleumCoke_C", amount: 4 }], products: [{ id: "Desc_AluminumScrap_C", amount: 20 }, { id: "Desc_Water_C", amount: 7 }], manufacturingDuration: 4 }, { id: "Recipe_Alternate_PolymerResin_C", displayName: "Alternate: Polymer Resin", ingredients: [{ id: "Desc_LiquidOil_C", amount: 6 }], products: [{ id: "Desc_PolymerResin_C", amount: 13 }, { id: "Desc_HeavyOilResidue_C", amount: 2 }], manufacturingDuration: 6 }, { id: "Recipe_Alternate_HeavyOilResidue_C", displayName: "Alternate: Heavy Oil Residue", ingredients: [{ id: "Desc_LiquidOil_C", amount: 3 }], products: [{ id: "Desc_HeavyOilResidue_C", amount: 4 }, { id: "Desc_PolymerResin_C", amount: 2 }], manufacturingDuration: 6 }, { id: "Recipe_Alternate_CoatedCable_C", displayName: "Alternate: Coated Cable", ingredients: [{ id: "Desc_Wire_C", amount: 5 }, { id: "Desc_HeavyOilResidue_C", amount: 2 }], products: [{ id: "Desc_Cable_C", amount: 9 }], manufacturingDuration: 8 }, { id: "Recipe_Alternate_PureCateriumIngot_C", displayName: "Alternate: Pure Caterium Ingot", ingredients: [{ id: "Desc_OreGold_C", amount: 2 }, { id: "Desc_Water_C", amount: 2 }], products: [{ id: "Desc_GoldIngot_C", amount: 1 }], manufacturingDuration: 5 }, { id: "Recipe_Alternate_PureQuartzCrystal_C", displayName: "Alternate: Pure Quartz Crystal", ingredients: [{ id: "Desc_RawQuartz_C", amount: 9 }, { id: "Desc_Water_C", amount: 5 }], products: [{ id: "Desc_QuartzCrystal_C", amount: 7 }], manufacturingDuration: 8 }, { id: "Recipe_Alternate_RecycledRubber_C", displayName: "Alternate: Recycled Rubber", ingredients: [{ id: "Desc_Plastic_C", amount: 6 }, { id: "Desc_LiquidFuel_C", amount: 6 }], products: [{ id: "Desc_Rubber_C", amount: 12 }], manufacturingDuration: 12 }, { id: "Recipe_Alternate_Plastic_1_C", displayName: "Alternate: Recycled Plastic", ingredients: [{ id: "Desc_Rubber_C", amount: 6 }, { id: "Desc_LiquidFuel_C", amount: 6 }], products: [{ id: "Desc_Plastic_C", amount: 12 }], manufacturingDuration: 12 }, { id: "Recipe_Alternate_PolyesterFabric_C", displayName: "Alternate: Polyester Fabric", ingredients: [{ id: "Desc_PolymerResin_C", amount: 1 }, { id: "Desc_Water_C", amount: 1 }], products: [{ id: "Desc_Fabric_C", amount: 1 }], manufacturingDuration: 2 }, { id: "Recipe_Alternate_TurboHeavyFuel_C", displayName: "Alternate: Turbo Heavy Fuel", ingredients: [{ id: "Desc_HeavyOilResidue_C", amount: 5 }, { id: "Desc_CompactedCoal_C", amount: 4 }], products: [{ id: "Desc_LiquidTurboFuel_C", amount: 4 }], manufacturingDuration: 8 }, { id: "Recipe_Alternate_DilutedPackagedFuel_C", displayName: "Alternate: Diluted Packaged Fuel", ingredients: [{ id: "Desc_HeavyOilResidue_C", amount: 1 }, { id: "Desc_PackagedWater_C", amount: 2 }], products: [{ id: "Desc_Fuel_C", amount: 2 }], manufacturingDuration: 2 }] }, { id: "Build_ManufacturerMk1_C", displayName: "Manufacturer", description: "Crafts three or four parts into another part.\n\nCan be automated by feeding parts into it with a conveyor belt connected to the input. The produced parts can be automatically extracted by connecting a conveyor belt to the output.", iconPath: "Buildable/Factory/ManufacturerMk1/Manufacturer.png", powerConsumption: 55, powerConsumptionExponent: 1.321929, recipes: [{ id: "Recipe_Beacon_C", displayName: "Beacon", ingredients: [{ id: "Desc_IronPlate_C", amount: 3 }, { id: "Desc_IronRod_C", amount: 1 }, { id: "Desc_Wire_C", amount: 15 }, { id: "Desc_Cable_C", amount: 2 }], products: [{ id: "BP_EquipmentDescriptorBeacon_C", amount: 1 }], manufacturingDuration: 8 }, { id: "Recipe_Rebar_Explosive_C", displayName: "Explosive Rebar", ingredients: [{ id: "Desc_SpikedRebar_C", amount: 2 }, { id: "Desc_GunpowderMK2_C", amount: 2 }, { id: "Desc_SteelPipe_C", amount: 2 }], products: [{ id: "Desc_Rebar_Explosive_C", amount: 1 }], manufacturingDuration: 12 }, { id: "Recipe_CartridgeChaos_Packaged_C", displayName: "Turbo Rifle Ammo", ingredients: [{ id: "Desc_CartridgeStandard_C", amount: 25 }, { id: "Desc_AluminumCasing_C", amount: 3 }, { id: "Desc_TurboFuel_C", amount: 3 }], products: [{ id: "Desc_CartridgeChaos_C", amount: 50 }], manufacturingDuration: 12 }, { id: "Recipe_FilterGasMask_C", displayName: "Gas Filter", ingredients: [{ id: "Desc_Coal_C", amount: 5 }, { id: "Desc_Rubber_C", amount: 2 }, { id: "Desc_Fabric_C", amount: 2 }], products: [{ id: "Desc_Filter_C", amount: 1 }], manufacturingDuration: 8 }, { id: "Recipe_FilterHazmat_C", displayName: "Iodine Infused Filter", ingredients: [{ id: "Desc_Filter_C", amount: 1 }, { id: "Desc_HighSpeedWire_C", amount: 8 }, { id: "Desc_AluminumCasing_C", amount: 1 }], products: [{ id: "Desc_HazmatFilter_C", amount: 1 }], manufacturingDuration: 16 }, { id: "Recipe_CrystalOscillator_C", displayName: "Crystal Oscillator", ingredients: [{ id: "Desc_QuartzCrystal_C", amount: 36 }, { id: "Desc_Cable_C", amount: 28 }, { id: "Desc_IronPlateReinforced_C", amount: 5 }], products: [{ id: "Desc_CrystalOscillator_C", amount: 2 }], manufacturingDuration: 120 }, { id: "Recipe_HighSpeedConnector_C", displayName: "High-Speed Connector", ingredients: [{ id: "Desc_HighSpeedWire_C", amount: 56 }, { id: "Desc_Cable_C", amount: 10 }, { id: "Desc_CircuitBoard_C", amount: 1 }], products: [{ id: "Desc_HighSpeedConnector_C", amount: 1 }], manufacturingDuration: 16 }, { id: "Recipe_SpaceElevatorPart_4_C", displayName: "Modular Engine", ingredients: [{ id: "Desc_Motor_C", amount: 2 }, { id: "Desc_Rubber_C", amount: 15 }, { id: "Desc_SpaceElevatorPart_1_C", amount: 2 }], products: [{ id: "Desc_SpaceElevatorPart_4_C", amount: 1 }], manufacturingDuration: 60 }, { id: "Recipe_ModularFrameHeavy_C", displayName: "Heavy Modular Frame", ingredients: [{ id: "Desc_ModularFrame_C", amount: 5 }, { id: "Desc_SteelPipe_C", amount: 15 }, { id: "Desc_SteelPlateReinforced_C", amount: 5 }, { id: "Desc_IronScrew_C", amount: 100 }], products: [{ id: "Desc_ModularFrameHeavy_C", amount: 1 }], manufacturingDuration: 30 }, { id: "Recipe_SpaceElevatorPart_6_C", displayName: "Magnetic Field Generator", ingredients: [{ id: "Desc_SpaceElevatorPart_2_C", amount: 5 }, { id: "Desc_ElectromagneticControlRod_C", amount: 2 }, { id: "Desc_Battery_C", amount: 10 }], products: [{ id: "Desc_SpaceElevatorPart_6_C", amount: 2 }], manufacturingDuration: 120 }, { id: "Recipe_Computer_C", displayName: "Computer", ingredients: [{ id: "Desc_CircuitBoard_C", amount: 10 }, { id: "Desc_Cable_C", amount: 9 }, { id: "Desc_Plastic_C", amount: 18 }, { id: "Desc_IronScrew_C", amount: 52 }], products: [{ id: "Desc_Computer_C", amount: 1 }], manufacturingDuration: 24 }, { id: "Recipe_RadioControlUnit_C", displayName: "Radio Control Unit", ingredients: [{ id: "Desc_AluminumCasing_C", amount: 32 }, { id: "Desc_CrystalOscillator_C", amount: 1 }, { id: "Desc_Computer_C", amount: 1 }], products: [{ id: "Desc_ModularFrameLightweight_C", amount: 2 }], manufacturingDuration: 48 }, { id: "Recipe_NobeliskNuke_C", displayName: "Nuke Nobelisk", ingredients: [{ id: "Desc_NobeliskExplosive_C", amount: 5 }, { id: "Desc_UraniumCell_C", amount: 20 }, { id: "Desc_GunpowderMK2_C", amount: 10 }, { id: "Desc_CircuitBoardHighSpeed_C", amount: 6 }], products: [{ id: "Desc_NobeliskNuke_C", amount: 1 }], manufacturingDuration: 120 }, { id: "Recipe_NuclearFuelRod_C", displayName: "Uranium Fuel Rod", ingredients: [{ id: "Desc_UraniumCell_C", amount: 50 }, { id: "Desc_SteelPlateReinforced_C", amount: 3 }, { id: "Desc_ElectromagneticControlRod_C", amount: 5 }], products: [{ id: "Desc_NuclearFuelRod_C", amount: 1 }], manufacturingDuration: 150 }, { id: "Recipe_SpaceElevatorPart_5_C", displayName: "Adaptive Control Unit", ingredients: [{ id: "Desc_SpaceElevatorPart_3_C", amount: 15 }, { id: "Desc_CircuitBoard_C", amount: 10 }, { id: "Desc_ModularFrameHeavy_C", amount: 2 }, { id: "Desc_Computer_C", amount: 2 }], products: [{ id: "Desc_SpaceElevatorPart_5_C", amount: 2 }], manufacturingDuration: 120 }, { id: "Recipe_ComputerSuper_C", displayName: "Supercomputer", ingredients: [{ id: "Desc_Computer_C", amount: 2 }, { id: "Desc_CircuitBoardHighSpeed_C", amount: 2 }, { id: "Desc_HighSpeedConnector_C", amount: 3 }, { id: "Desc_Plastic_C", amount: 28 }], products: [{ id: "Desc_ComputerSuper_C", amount: 1 }], manufacturingDuration: 32 }, { id: "Recipe_PlutoniumFuelRod_C", displayName: "Plutonium Fuel Rod", ingredients: [{ id: "Desc_PlutoniumCell_C", amount: 30 }, { id: "Desc_SteelPlate_C", amount: 18 }, { id: "Desc_ElectromagneticControlRod_C", amount: 6 }, { id: "Desc_AluminumPlateReinforced_C", amount: 10 }], products: [{ id: "Desc_PlutoniumFuelRod_C", amount: 1 }], manufacturingDuration: 240 }, { id: "Recipe_MotorTurbo_C", displayName: "Turbo Motor", ingredients: [{ id: "Desc_CoolingSystem_C", amount: 4 }, { id: "Desc_ModularFrameLightweight_C", amount: 2 }, { id: "Desc_Motor_C", amount: 4 }, { id: "Desc_Rubber_C", amount: 24 }], products: [{ id: "Desc_MotorLightweight_C", amount: 1 }], manufacturingDuration: 32 }, { id: "Recipe_SpaceElevatorPart_8_C", displayName: "Thermal Propulsion Rocket", ingredients: [{ id: "Desc_SpaceElevatorPart_4_C", amount: 5 }, { id: "Desc_MotorLightweight_C", amount: 2 }, { id: "Desc_CoolingSystem_C", amount: 6 }, { id: "Desc_ModularFrameFused_C", amount: 2 }], products: [{ id: "Desc_SpaceElevatorPart_8_C", amount: 2 }], manufacturingDuration: 120 }], alternateRecipes: [{ id: "Recipe_Alternate_UraniumCell_1_C", displayName: "Alternate: Infused Uranium Cell", ingredients: [{ id: "Desc_OreUranium_C", amount: 5 }, { id: "Desc_Silica_C", amount: 3 }, { id: "Desc_Sulfur_C", amount: 5 }, { id: "Desc_HighSpeedWire_C", amount: 15 }], products: [{ id: "Desc_UraniumCell_C", amount: 4 }], manufacturingDuration: 12 }, { id: "Recipe_Alternate_ClassicBattery_C", displayName: "Alternate: Classic Battery", ingredients: [{ id: "Desc_Sulfur_C", amount: 6 }, { id: "Desc_AluminumPlate_C", amount: 7 }, { id: "Desc_Plastic_C", amount: 8 }, { id: "Desc_Wire_C", amount: 12 }], products: [{ id: "Desc_Battery_C", amount: 4 }], manufacturingDuration: 8 }, { id: "Recipe_Alternate_PlasticSmartPlating_C", displayName: "Alternate: Plastic Smart Plating", ingredients: [{ id: "Desc_IronPlateReinforced_C", amount: 1 }, { id: "Desc_Rotor_C", amount: 1 }, { id: "Desc_Plastic_C", amount: 3 }], products: [{ id: "Desc_SpaceElevatorPart_1_C", amount: 2 }], manufacturingDuration: 24 }, { id: "Recipe_Alternate_FlexibleFramework_C", displayName: "Alternate: Flexible Framework", ingredients: [{ id: "Desc_ModularFrame_C", amount: 1 }, { id: "Desc_SteelPlate_C", amount: 6 }, { id: "Desc_Rubber_C", amount: 8 }], products: [{ id: "Desc_SpaceElevatorPart_2_C", amount: 2 }], manufacturingDuration: 16 }, { id: "Recipe_Alternate_AutomatedMiner_C", displayName: "Alternate: Automated Miner", ingredients: [{ id: "Desc_Motor_C", amount: 1 }, { id: "Desc_SteelPipe_C", amount: 4 }, { id: "Desc_IronRod_C", amount: 4 }, { id: "Desc_IronPlate_C", amount: 2 }], products: [{ id: "BP_ItemDescriptorPortableMiner_C", amount: 1 }], manufacturingDuration: 60 }, { id: "Recipe_Alternate_Motor_1_C", displayName: "Alternate: Rigour Motor", ingredients: [{ id: "Desc_Rotor_C", amount: 3 }, { id: "Desc_Stator_C", amount: 3 }, { id: "Desc_CrystalOscillator_C", amount: 1 }], products: [{ id: "Desc_Motor_C", amount: 6 }], manufacturingDuration: 48 }, { id: "Recipe_Alternate_CrystalOscillator_C", displayName: "Alternate: Insulated Crystal Oscillator", ingredients: [{ id: "Desc_QuartzCrystal_C", amount: 10 }, { id: "Desc_Rubber_C", amount: 7 }, { id: "Desc_CircuitBoardHighSpeed_C", amount: 1 }], products: [{ id: "Desc_CrystalOscillator_C", amount: 1 }], manufacturingDuration: 32 }, { id: "Recipe_Alternate_Beacon_1_C", displayName: "Alternate: Crystal Beacon", ingredients: [{ id: "Desc_SteelPlate_C", amount: 4 }, { id: "Desc_SteelPipe_C", amount: 16 }, { id: "Desc_CrystalOscillator_C", amount: 1 }], products: [{ id: "BP_EquipmentDescriptorBeacon_C", amount: 20 }], manufacturingDuration: 120 }, { id: "Recipe_Alternate_HighSpeedWiring_C", displayName: "Alternate: Automated Speed Wiring", ingredients: [{ id: "Desc_Stator_C", amount: 2 }, { id: "Desc_Wire_C", amount: 40 }, { id: "Desc_HighSpeedConnector_C", amount: 1 }], products: [{ id: "Desc_SpaceElevatorPart_3_C", amount: 4 }], manufacturingDuration: 32 }, { id: "Recipe_Alternate_HighSpeedConnector_C", displayName: "Alternate: Silicon High-Speed Connector", ingredients: [{ id: "Desc_HighSpeedWire_C", amount: 60 }, { id: "Desc_Silica_C", amount: 25 }, { id: "Desc_CircuitBoard_C", amount: 2 }], products: [{ id: "Desc_HighSpeedConnector_C", amount: 2 }], manufacturingDuration: 40 }, { id: "Recipe_Alternate_HeavyFlexibleFrame_C", displayName: "Alternate: Heavy Flexible Frame", ingredients: [{ id: "Desc_ModularFrame_C", amount: 5 }, { id: "Desc_SteelPlateReinforced_C", amount: 3 }, { id: "Desc_Rubber_C", amount: 20 }, { id: "Desc_IronScrew_C", amount: 104 }], products: [{ id: "Desc_ModularFrameHeavy_C", amount: 1 }], manufacturingDuration: 16 }, { id: "Recipe_Alternate_ModularFrameHeavy_C", displayName: "Alternate: Heavy Encased Frame", ingredients: [{ id: "Desc_ModularFrame_C", amount: 8 }, { id: "Desc_SteelPlateReinforced_C", amount: 10 }, { id: "Desc_SteelPipe_C", amount: 36 }, { id: "Desc_Cement_C", amount: 22 }], products: [{ id: "Desc_ModularFrameHeavy_C", amount: 3 }], manufacturingDuration: 64 }, { id: "Recipe_Alternate_Computer_1_C", displayName: "Alternate: Caterium Computer", ingredients: [{ id: "Desc_CircuitBoard_C", amount: 7 }, { id: "Desc_HighSpeedWire_C", amount: 28 }, { id: "Desc_Rubber_C", amount: 12 }], products: [{ id: "Desc_Computer_C", amount: 1 }], manufacturingDuration: 16 }, { id: "Recipe_Alternate_RadioControlSystem_C", displayName: "Alternate: Radio Control System", ingredients: [{ id: "Desc_CrystalOscillator_C", amount: 1 }, { id: "Desc_CircuitBoard_C", amount: 10 }, { id: "Desc_AluminumCasing_C", amount: 60 }, { id: "Desc_Rubber_C", amount: 30 }], products: [{ id: "Desc_ModularFrameLightweight_C", amount: 3 }], manufacturingDuration: 40 }, { id: "Recipe_Alternate_RadioControlUnit_1_C", displayName: "Alternate: Radio Connection Unit", ingredients: [{ id: "Desc_AluminumPlateReinforced_C", amount: 4 }, { id: "Desc_HighSpeedConnector_C", amount: 2 }, { id: "Desc_QuartzCrystal_C", amount: 12 }], products: [{ id: "Desc_ModularFrameLightweight_C", amount: 1 }], manufacturingDuration: 16 }, { id: "Recipe_Alternate_NuclearFuelRod_1_C", displayName: "Alternate: Uranium Fuel Unit", ingredients: [{ id: "Desc_UraniumCell_C", amount: 100 }, { id: "Desc_ElectromagneticControlRod_C", amount: 10 }, { id: "Desc_CrystalOscillator_C", amount: 3 }, { id: "BP_EquipmentDescriptorBeacon_C", amount: 6 }], products: [{ id: "Desc_NuclearFuelRod_C", amount: 3 }], manufacturingDuration: 300 }, { id: "Recipe_Alternate_SuperStateComputer_C", displayName: "Alternate: Super-State Computer", ingredients: [{ id: "Desc_Computer_C", amount: 3 }, { id: "Desc_ElectromagneticControlRod_C", amount: 2 }, { id: "Desc_Battery_C", amount: 20 }, { id: "Desc_Wire_C", amount: 45 }], products: [{ id: "Desc_ComputerSuper_C", amount: 2 }], manufacturingDuration: 50 }, { id: "Recipe_Alternate_TurboMotor_1_C", displayName: "Alternate: Turbo Electric Motor", ingredients: [{ id: "Desc_Motor_C", amount: 7 }, { id: "Desc_ModularFrameLightweight_C", amount: 9 }, { id: "Desc_ElectromagneticControlRod_C", amount: 5 }, { id: "Desc_Rotor_C", amount: 7 }], products: [{ id: "Desc_MotorLightweight_C", amount: 3 }], manufacturingDuration: 64 }, { id: "Recipe_Alternate_TurboPressureMotor_C", displayName: "Alternate: Turbo Pressure Motor", ingredients: [{ id: "Desc_Motor_C", amount: 4 }, { id: "Desc_PressureConversionCube_C", amount: 1 }, { id: "Desc_PackagedNitrogenGas_C", amount: 24 }, { id: "Desc_Stator_C", amount: 8 }], products: [{ id: "Desc_MotorLightweight_C", amount: 2 }], manufacturingDuration: 32 }] }, { id: "Build_Packager_C", displayName: "Packager", description: "Used for the packaging and unpacking of fluids.\nHead Lift: 10 meters.\n(Allows fluids to be transported 10 meters upwards.)\n\nContains both a Conveyor Belt and Pipe input and output, to allow for the automation of various recipes.", iconPath: "Buildable/Factory/Packager/Packager.png", powerConsumption: 10, powerConsumptionExponent: 1.321929, recipes: [{ id: "Recipe_PackagedWater_C", displayName: "Packaged Water", ingredients: [{ id: "Desc_Water_C", amount: 2 }, { id: "Desc_FluidCanister_C", amount: 2 }], products: [{ id: "Desc_PackagedWater_C", amount: 2 }], manufacturingDuration: 2 }, { id: "Recipe_UnpackageWater_C", displayName: "Unpackage Water", ingredients: [{ id: "Desc_PackagedWater_C", amount: 2 }], products: [{ id: "Desc_Water_C", amount: 2 }, { id: "Desc_FluidCanister_C", amount: 2 }], manufacturingDuration: 1 }, { id: "Recipe_PackagedSulfuricAcid_C", displayName: "Packaged Sulfuric Acid", ingredients: [{ id: "Desc_SulfuricAcid_C", amount: 2 }, { id: "Desc_FluidCanister_C", amount: 2 }], products: [{ id: "Desc_PackagedSulfuricAcid_C", amount: 2 }], manufacturingDuration: 3 }, { id: "Recipe_UnpackageSulfuricAcid_C", displayName: "Unpackage Sulfuric Acid", ingredients: [{ id: "Desc_PackagedSulfuricAcid_C", amount: 1 }], products: [{ id: "Desc_SulfuricAcid_C", amount: 1 }, { id: "Desc_FluidCanister_C", amount: 1 }], manufacturingDuration: 1 }, { id: "Recipe_PackagedAlumina_C", displayName: "Packaged Alumina Solution", ingredients: [{ id: "Desc_AluminaSolution_C", amount: 2 }, { id: "Desc_FluidCanister_C", amount: 2 }], products: [{ id: "Desc_PackagedAlumina_C", amount: 2 }], manufacturingDuration: 1 }, { id: "Recipe_UnpackageAlumina_C", displayName: "Unpackage Alumina Solution", ingredients: [{ id: "Desc_PackagedAlumina_C", amount: 2 }], products: [{ id: "Desc_AluminaSolution_C", amount: 2 }, { id: "Desc_FluidCanister_C", amount: 2 }], manufacturingDuration: 1 }, { id: "Recipe_PackagedCrudeOil_C", displayName: "Packaged Oil", ingredients: [{ id: "Desc_LiquidOil_C", amount: 2 }, { id: "Desc_FluidCanister_C", amount: 2 }], products: [{ id: "Desc_PackagedOil_C", amount: 2 }], manufacturingDuration: 4 }, { id: "Recipe_PackagedOilResidue_C", displayName: "Packaged Heavy Oil Residue", ingredients: [{ id: "Desc_HeavyOilResidue_C", amount: 2 }, { id: "Desc_FluidCanister_C", amount: 2 }], products: [{ id: "Desc_PackagedOilResidue_C", amount: 2 }], manufacturingDuration: 4 }, { id: "Recipe_UnpackageOil_C", displayName: "Unpackage Oil", ingredients: [{ id: "Desc_PackagedOil_C", amount: 2 }], products: [{ id: "Desc_LiquidOil_C", amount: 2 }, { id: "Desc_FluidCanister_C", amount: 2 }], manufacturingDuration: 2 }, { id: "Recipe_UnpackageOilResidue_C", displayName: "Unpackage Heavy Oil Residue", ingredients: [{ id: "Desc_PackagedOilResidue_C", amount: 2 }], products: [{ id: "Desc_HeavyOilResidue_C", amount: 2 }, { id: "Desc_FluidCanister_C", amount: 2 }], manufacturingDuration: 6 }, { id: "Recipe_Fuel_C", displayName: "Packaged Fuel", ingredients: [{ id: "Desc_LiquidFuel_C", amount: 2 }, { id: "Desc_FluidCanister_C", amount: 2 }], products: [{ id: "Desc_Fuel_C", amount: 2 }], manufacturingDuration: 3 }, { id: "Recipe_UnpackageFuel_C", displayName: "Unpackage Fuel", ingredients: [{ id: "Desc_Fuel_C", amount: 2 }], products: [{ id: "Desc_LiquidFuel_C", amount: 2 }, { id: "Desc_FluidCanister_C", amount: 2 }], manufacturingDuration: 2 }, { id: "Recipe_PackagedNitrogen_C", displayName: "Packaged Nitrogen Gas", ingredients: [{ id: "Desc_NitrogenGas_C", amount: 4 }, { id: "Desc_GasTank_C", amount: 1 }], products: [{ id: "Desc_PackagedNitrogenGas_C", amount: 1 }], manufacturingDuration: 1 }, { id: "Recipe_UnpackageNitrogen_C", displayName: "Unpackage Nitrogen Gas", ingredients: [{ id: "Desc_PackagedNitrogenGas_C", amount: 1 }], products: [{ id: "Desc_NitrogenGas_C", amount: 4 }, { id: "Desc_GasTank_C", amount: 1 }], manufacturingDuration: 1 }, { id: "Recipe_PackagedBiofuel_C", displayName: "Packaged Liquid Biofuel", ingredients: [{ id: "Desc_LiquidBiofuel_C", amount: 2 }, { id: "Desc_FluidCanister_C", amount: 2 }], products: [{ id: "Desc_PackagedBiofuel_C", amount: 2 }], manufacturingDuration: 3 }, { id: "Recipe_UnpackageBioFuel_C", displayName: "Unpackage Liquid Biofuel", ingredients: [{ id: "Desc_PackagedBiofuel_C", amount: 2 }], products: [{ id: "Desc_LiquidBiofuel_C", amount: 2 }, { id: "Desc_FluidCanister_C", amount: 2 }], manufacturingDuration: 2 }, { id: "Recipe_PackagedNitricAcid_C", displayName: "Packaged Nitric Acid", ingredients: [{ id: "Desc_NitricAcid_C", amount: 1 }, { id: "Desc_GasTank_C", amount: 1 }], products: [{ id: "Desc_PackagedNitricAcid_C", amount: 1 }], manufacturingDuration: 2 }, { id: "Recipe_UnpackageNitricAcid_C", displayName: "Unpackage Nitric Acid", ingredients: [{ id: "Desc_PackagedNitricAcid_C", amount: 1 }], products: [{ id: "Desc_NitricAcid_C", amount: 1 }, { id: "Desc_GasTank_C", amount: 1 }], manufacturingDuration: 3 }, { id: "Recipe_PackagedTurboFuel_C", displayName: "Packaged Turbofuel", ingredients: [{ id: "Desc_LiquidTurboFuel_C", amount: 2 }, { id: "Desc_FluidCanister_C", amount: 2 }], products: [{ id: "Desc_TurboFuel_C", amount: 2 }], manufacturingDuration: 6 }, { id: "Recipe_UnpackageTurboFuel_C", displayName: "Unpackage Turbofuel", ingredients: [{ id: "Desc_TurboFuel_C", amount: 2 }], products: [{ id: "Desc_LiquidTurboFuel_C", amount: 2 }, { id: "Desc_FluidCanister_C", amount: 2 }], manufacturingDuration: 6 }], alternateRecipes: [] }, { id: "Build_Blender_C", displayName: "Blender", description: "The Blender is capable of blending fluids and combining them with solid parts in various processes.\nHead Lift: 10 meters.\n(Allows fluids to be transported 10 meters upwards).\n\nContains both Conveyor Belt and Pipe inputs and outputs.", iconPath: "Buildable/Factory/Blender/Blender.png", powerConsumption: 75, powerConsumptionExponent: 1.321929, recipes: [{ id: "Recipe_NitricAcid_C", displayName: "Nitric Acid", ingredients: [{ id: "Desc_NitrogenGas_C", amount: 12 }, { id: "Desc_Water_C", amount: 3 }, { id: "Desc_IronPlate_C", amount: 1 }], products: [{ id: "Desc_NitricAcid_C", amount: 3 }], manufacturingDuration: 6 }, { id: "Recipe_NonFissileUranium_C", displayName: "Non-fissile Uranium", ingredients: [{ id: "Desc_NuclearWaste_C", amount: 15 }, { id: "Desc_Silica_C", amount: 10 }, { id: "Desc_NitricAcid_C", amount: 6 }, { id: "Desc_SulfuricAcid_C", amount: 6 }], products: [{ id: "Desc_NonFissibleUranium_C", amount: 20 }, { id: "Desc_Water_C", amount: 6 }], manufacturingDuration: 24 }, { id: "Recipe_UraniumCell_C", displayName: "Encased Uranium Cell", ingredients: [{ id: "Desc_OreUranium_C", amount: 10 }, { id: "Desc_Cement_C", amount: 3 }, { id: "Desc_SulfuricAcid_C", amount: 8 }], products: [{ id: "Desc_UraniumCell_C", amount: 5 }, { id: "Desc_SulfuricAcid_C", amount: 2 }], manufacturingDuration: 12 }, { id: "Recipe_CartridgeChaos_C", displayName: "Turbo Rifle Ammo", ingredients: [{ id: "Desc_CartridgeStandard_C", amount: 25 }, { id: "Desc_AluminumCasing_C", amount: 3 }, { id: "Desc_LiquidTurboFuel_C", amount: 3 }], products: [{ id: "Desc_CartridgeChaos_C", amount: 50 }], manufacturingDuration: 12 }, { id: "Recipe_Battery_C", displayName: "Battery", ingredients: [{ id: "Desc_SulfuricAcid_C", amount: 2.5 }, { id: "Desc_AluminaSolution_C", amount: 2 }, { id: "Desc_AluminumCasing_C", amount: 1 }], products: [{ id: "Desc_Battery_C", amount: 1 }, { id: "Desc_Water_C", amount: 1.5 }], manufacturingDuration: 3 }, { id: "Recipe_CoolingSystem_C", displayName: "Cooling System", ingredients: [{ id: "Desc_AluminumPlateReinforced_C", amount: 2 }, { id: "Desc_Rubber_C", amount: 2 }, { id: "Desc_Water_C", amount: 5 }, { id: "Desc_NitrogenGas_C", amount: 25 }], products: [{ id: "Desc_CoolingSystem_C", amount: 1 }], manufacturingDuration: 10 }, { id: "Recipe_FusedModularFrame_C", displayName: "Fused Modular Frame", ingredients: [{ id: "Desc_ModularFrameHeavy_C", amount: 1 }, { id: "Desc_AluminumCasing_C", amount: 50 }, { id: "Desc_NitrogenGas_C", amount: 25 }], products: [{ id: "Desc_ModularFrameFused_C", amount: 1 }], manufacturingDuration: 40 }], alternateRecipes: [{ id: "Recipe_Alternate_InstantScrap_C", displayName: "Alternate: Instant Scrap", ingredients: [{ id: "Desc_OreBauxite_C", amount: 15 }, { id: "Desc_Coal_C", amount: 10 }, { id: "Desc_SulfuricAcid_C", amount: 5 }, { id: "Desc_Water_C", amount: 6 }], products: [{ id: "Desc_AluminumScrap_C", amount: 30 }, { id: "Desc_Water_C", amount: 5 }], manufacturingDuration: 6 }, { id: "Recipe_Alternate_DilutedFuel_C", displayName: "Alternate: Diluted Fuel", ingredients: [{ id: "Desc_HeavyOilResidue_C", amount: 5 }, { id: "Desc_Water_C", amount: 10 }], products: [{ id: "Desc_LiquidFuel_C", amount: 10 }], manufacturingDuration: 6 }, { id: "Recipe_Alternate_FertileUranium_C", displayName: "Alternate: Fertile Uranium", ingredients: [{ id: "Desc_OreUranium_C", amount: 5 }, { id: "Desc_NuclearWaste_C", amount: 5 }, { id: "Desc_NitricAcid_C", amount: 3 }, { id: "Desc_SulfuricAcid_C", amount: 5 }], products: [{ id: "Desc_NonFissibleUranium_C", amount: 20 }, { id: "Desc_Water_C", amount: 8 }], manufacturingDuration: 12 }, { id: "Recipe_Alternate_TurboBlendFuel_C", displayName: "Alternate: Turbo Blend Fuel", ingredients: [{ id: "Desc_LiquidFuel_C", amount: 2 }, { id: "Desc_HeavyOilResidue_C", amount: 4 }, { id: "Desc_Sulfur_C", amount: 3 }, { id: "Desc_PetroleumCoke_C", amount: 3 }], products: [{ id: "Desc_LiquidTurboFuel_C", amount: 6 }], manufacturingDuration: 8 }, { id: "Recipe_Alternate_CoolingDevice_C", displayName: "Alternate: Cooling Device", ingredients: [{ id: "Desc_AluminumPlateReinforced_C", amount: 5 }, { id: "Desc_Motor_C", amount: 1 }, { id: "Desc_NitrogenGas_C", amount: 24 }], products: [{ id: "Desc_CoolingSystem_C", amount: 2 }], manufacturingDuration: 32 }, { id: "Recipe_Alternate_HeatFusedFrame_C", displayName: "Alternate: Heat-Fused Frame", ingredients: [{ id: "Desc_ModularFrameHeavy_C", amount: 1 }, { id: "Desc_AluminumIngot_C", amount: 50 }, { id: "Desc_NitricAcid_C", amount: 8 }, { id: "Desc_LiquidFuel_C", amount: 10 }], products: [{ id: "Desc_ModularFrameFused_C", amount: 1 }], manufacturingDuration: 20 }] }, { id: "Build_HadronCollider_C", displayName: "Particle Accelerator", description: "The FICSIT Particle Accelerator uses electromagnetic fields to propel particles to very high speeds and energies. The specific design allows for a variety of processes, such as matter generation and conversion.\n\nWarning: Power usage is extremely high, unstable, and varies per recipe.", iconPath: "Buildable/Factory/HadronCollider/HadronCollider.png", powerConsumption: 0.1, powerConsumptionExponent: 1.321929, recipes: [{ id: "Recipe_Plutonium_C", displayName: "Plutonium Pellet", ingredients: [{ id: "Desc_NonFissibleUranium_C", amount: 100 }, { id: "Desc_NuclearWaste_C", amount: 25 }], products: [{ id: "Desc_PlutoniumPellet_C", amount: 30 }], manufacturingDuration: 60 }, { id: "Recipe_SpaceElevatorPart_9_C", displayName: "Nuclear Pasta", ingredients: [{ id: "Desc_CopperDust_C", amount: 200 }, { id: "Desc_PressureConversionCube_C", amount: 1 }], products: [{ id: "Desc_SpaceElevatorPart_9_C", amount: 1 }], manufacturingDuration: 120 }], alternateRecipes: [{ id: "Recipe_Alternate_InstantPlutoniumCell_C", displayName: "Alternate: Instant Plutonium Cell", ingredients: [{ id: "Desc_NonFissibleUranium_C", amount: 150 }, { id: "Desc_AluminumCasing_C", amount: 20 }], products: [{ id: "Desc_PlutoniumCell_C", amount: 20 }], manufacturingDuration: 120 }] }], resources: [{ id: "Desc_NuclearWaste_C", displayName: "Uranium Waste", description: "The by-product of consuming Uranium Fuel Rods in the Nuclear Power Plant.\nNon-fissile Uranium can be extracted. Handle with caution.\n\nCaution: HIGHLY Radioactive.", iconPath: "Resource/Parts/NuclearWaste/NuclearWaste.png" }, { id: "Desc_Battery_C", displayName: "Battery", description: "Primarily used as fuel for Drones and Vehicles.", iconPath: "Resource/Parts/Battery/Battery.png" }, { id: "Desc_AluminumIngot_C", displayName: "Aluminum Ingot", description: "Aluminum Ingots are made from Aluminum Scrap, which is refined from Alumina Solution.\nUsed to produce specialized aluminum-based parts.", iconPath: "Resource/Parts/AluminumIngot/AluminiumIngot.png" }, { id: "Desc_ColorCartridge_C", displayName: "Color Cartridge", description: "Used for applying Patterns to structures with the Customizer.\n\n(Patterns can be purchased in the AWESOME Shop.)", iconPath: "Resource/Parts/ColorCartridge/ColorCartridge.png" }, { id: "Desc_Cable_C", displayName: "Cable", description: "Used for crafting.\nPrimarily used to build power lines.", iconPath: "Resource/Parts/Cable/Cables.png" }, { id: "Desc_Cement_C", displayName: "Concrete", description: "Used for building.\nGood for stable foundations.", iconPath: "Resource/Parts/Cement/Concrete.png" }, { id: "Desc_ModularFrame_C", displayName: "Modular Frame", description: "Used for crafting.\nMulti-purpose building block.", iconPath: "Resource/Parts/ModularFrame/ModularFrame.png" }, { id: "Desc_SteelPlate_C", displayName: "Steel Beam", description: "Steel Beams are used most often when constructing a little more advanced buildings.", iconPath: "Resource/Parts/SteelPlate/SteelBeam.png" }, { id: "Desc_NonFissibleUranium_C", displayName: "Non-fissile Uranium", description: "The isotope Uranium-238 is non-fissile, meaning it cannot be used for nuclear fission. It can, however, be converted into fissile Plutonium in the Particle Accelerator.\n\nCaution: Mildly Radioactive.", iconPath: "Resource/Parts/Non-FissibleUranium/NonFissileUranium.png" }, { id: "Desc_PlutoniumPellet_C", displayName: "Plutonium Pellet", description: "Produced in the Particle Accelerator through conversion of Non-fissile Uranium.\nUsed to produce Encased Plutonium Cells for Plutonium Fuel Rods.\n\nPower Usage: 250-750 MW (500 MW average).\nCaution: Moderately Radioactive.", iconPath: "Resource/Parts/PlutoniumPellet/PlutoniumPellet.png" }, { id: "Desc_PlutoniumCell_C", displayName: "Encased Plutonium Cell", description: "Plutonium Cells are concrete encased Plutonium Pellets.\nUsed to produce Plutonium Fuel Rods for Nuclear Power production.\n\nCaution: Moderately Radioactive.", iconPath: "Resource/Parts/PlutoniumCell/EncasedPlutoniumCell.png" }, { id: "Desc_Silica_C", displayName: "Silica", description: "Derived from Raw Quartz. Commonly used to create glass structures, advanced refinement processes, and alternative production of electronics.", iconPath: "Resource/Parts/Silica/Silica.png" }, { id: "Desc_IronPlate_C", displayName: "Iron Plate", description: "Used for crafting.\nOne of the most basic parts.", iconPath: "Resource/Parts/IronPlate/IronPlates.png" }, { id: "Desc_CrystalShard_C", displayName: "Power Shard", description: "Mucus from the power slugs compressed into a solid crystal-like shard. \nIt radiates a strange power.", iconPath: "Resource/Environment/Crystal/PowerShard.png" }, { id: "Desc_IronRod_C", displayName: "Iron Rod", description: "Used for crafting.\nOne of the most basic parts.", iconPath: "Resource/Parts/IronRod/IronRods.png" }, { id: "Desc_Wire_C", displayName: "Wire", description: "Used for crafting.\nOne of the most basic parts.", iconPath: "Resource/Parts/Wire/Wire.png" }, { id: "Desc_IronIngot_C", displayName: "Iron Ingot", description: "Used for crafting.\nCrafted into the most basic parts.", iconPath: "Resource/Parts/IronIngot/IronIngot.png" }, { id: "Desc_IronPlateReinforced_C", displayName: "Reinforced Iron Plate", description: "Used for crafting.\nA sturdier and more durable Iron Plate.", iconPath: "Resource/Parts/IronPlateReinforced/ReinforcedIronPlates.png" }, { id: "Desc_Rotor_C", displayName: "Rotor", description: "Used for crafting.\nThe moving parts of a motor.", iconPath: "Resource/Parts/Rotor/Rotor.png" }, { id: "Desc_CopperSheet_C", displayName: "Copper Sheet", description: "Used for crafting.\nPrimarily used for pipelines due to its high corrosion resistance.", iconPath: "Resource/Parts/CopperSheet/CopperSheet.png" }, { id: "Desc_IronScrew_C", displayName: "Screw", description: "Used for crafting.\nOne of the most basic parts.", iconPath: "Resource/Parts/IronScrew/IronScrews.png" }, { id: "Desc_CompactedCoal_C", displayName: "Compacted Coal", description: "A much more efficient alternative to Coal. Used as fuel for vehicles and coal generators.", iconPath: "Resource/Parts/CompactedCoal/CompactedCoal.png" }, { id: "Desc_HeavyOilResidue_C", displayName: "Heavy Oil Residue", description: "A by-product of Plastic and Rubber production. Can be further refined into Fuel and Petroleum Coke.", iconPath: "Resource/Parts/HeavyOilResidue/LiquidHeavyOilResidue_Pipe.png" }, { id: "Desc_LiquidTurboFuel_C", displayName: "Turbofuel", description: "A more efficient alternative to Fuel. Can be used to generate power or packaged to be used as fuel for Vehicles.", iconPath: "Resource/Parts/Turbofuel/LiquidTurboFuel_Pipe.png" }, { id: "Desc_FluidCanister_C", displayName: "Empty Canister", description: "Used to package fluids for transportation.", iconPath: "Resource/Parts/FluidCanister/EmptyCannister.png" }, { id: "Desc_TurboFuel_C", displayName: "Packaged Turbofuel", description: "Turbofuel, packaged for alternative transport. Can be used as fuel for Vehicles and the Jetpack.", iconPath: "Resource/Parts/Turbofuel/TurboFuel.png" }, { id: "Desc_CircuitBoard_C", displayName: "Circuit Board", description: "Circuit Boards are advanced electronics that are used in a plethora of different ways.", iconPath: "Resource/Parts/CircuitBoard/CircuitBoard.png" }, { id: "Desc_Plastic_C", displayName: "Plastic", description: "A versatile and easy to manufacture material that can be used for a lot of things.", iconPath: "Resource/Parts/Plastic/Plastic.png" }, { id: "Desc_Motor_C", displayName: "Motor", description: "The Motor creates a mechanical force that is used to move things from machines to vehicles.", iconPath: "Resource/Parts/Motor/Engine.png" }, { id: "Desc_SteelPlateReinforced_C", displayName: "Encased Industrial Beam", description: "Encased Industrial Beams utilizes the compressive strength of concrete and tensile strength of steel simultaneously.\nMostly used as a stable basis for constructing buildings.", iconPath: "Resource/Parts/SteelPlateReinforced/EncasedSteelBeam.png" }, { id: "Desc_SteelPipe_C", displayName: "Steel Pipe", description: "Steel Pipes are used most often when constructing a little more advanced buildings.", iconPath: "Resource/Parts/SteelPipe/SteelPipe.png" }, { id: "Desc_Rubber_C", displayName: "Rubber", description: "Rubber is a material that is very flexible and has a lot of friction.", iconPath: "Resource/Parts/Rubber/Rubber.png" }, { id: "Desc_LiquidFuel_C", displayName: "Fuel", description: "Fuel can be used to generate power or packaged to be used as fuel for Vehicles or the Jetpack.", iconPath: "Resource/Parts/Fuel/LiquidFuel_Pipe.png" }, { id: "Desc_PolymerResin_C", displayName: "Polymer Resin", description: "Used for crafting.\nA by-product of oil refinement into fuel. Commonly used to manufacture plastics.", iconPath: "Resource/Parts/PolymerResin/PolymerResin.png" }, { id: "Desc_PetroleumCoke_C", displayName: "Petroleum Coke", description: "Used for crafting.\nA carbon-rich material distilled from Heavy Oil Residue. \nUsed as a less efficient coal replacement.", iconPath: "Resource/Parts/PetroleumCoke/PetroleumCoke.png" }, { id: "Desc_SteelIngot_C", displayName: "Steel Ingot", description: "Steel Ingots are made from Iron Ore that's been smelted with Coal. They are made into several parts used in building construction.", iconPath: "Resource/Parts/SteelIngot/SteelIngot.png" }, { id: "Desc_SpaceElevatorPart_2_C", displayName: "Versatile Framework", description: "Project Part #2. Ship with the Space Elevator to complete phases of Project Assembly.", iconPath: "Resource/Parts/Skeletalframework/SpelevatorPart_2.png" }, { id: "Desc_ModularFrameHeavy_C", displayName: "Heavy Modular Frame", description: "A more robust multi-purpose frame.", iconPath: "Resource/Parts/ModularFrameHeavy/ModularFrameHeavy.png" }, { id: "Desc_Fuel_C", displayName: "Packaged Fuel", description: "Fuel, packaged for alternative transport. Can be used as fuel for Vehicles and the Jetpack.", iconPath: "Resource/Parts/Fuel/Fuel.png" }, { id: "Desc_PackagedOil_C", displayName: "Packaged Oil", description: "Crude Oil, packaged for alternative transport. Can be used as fuel for Vehicles.", iconPath: "Resource/RawResources/CrudeOil/Oil.png" }, { id: "Desc_PackagedOilResidue_C", displayName: "Packaged Heavy Oil Residue", description: "Heavy Oil Residue, packaged for alternative transport. Can be used as fuel for Vehicles.", iconPath: "Resource/RawResources/CrudeOil/OilResidue.png" }, { id: "Desc_PackagedWater_C", displayName: "Packaged Water", description: "Water, packaged for alternative transport.", iconPath: "Resource/Parts/PackagedWater/PackagedWater.png" }, { id: "Desc_CopperIngot_C", displayName: "Copper Ingot", description: "Used for crafting.\nCrafted into the most basic parts.", iconPath: "Resource/Parts/CopperIngot/CopperIngot.png" }, { id: "Desc_QuartzCrystal_C", displayName: "Quartz Crystal", description: "Derived from Raw Quartz. Used in the production of advanced radar technology and high-quality display screens.", iconPath: "Resource/Parts/QuartzCrystal/QuartzResource.png" }, { id: "Desc_GoldIngot_C", displayName: "Caterium Ingot", description: "Caterium Ingots are smelted from Caterium Ore. Caterium Ingots are mostly used for advanced electronics.", iconPath: "Resource/Parts/GoldIngot/CateriumIngot.png" }, { id: "Desc_AluminumScrap_C", displayName: "Aluminum Scrap", description: "Aluminum Scrap is pure aluminum refined from Alumina. Can be smelted down to Aluminum Ingots for industrial usage.", iconPath: "Resource/Parts/AluminumScrap/AluminiumScrap.png" }, { id: "Desc_SulfuricAcid_C", displayName: "Sulfuric Acid", description: "A mineral acid produced by combining Sulfur and Water in a complex reaction. Primarily used in refinement processes and Battery production.", iconPath: "Resource/Parts/SulfuricAcid/LiquidSulfuricAcid_Pipe.png" }, { id: "Desc_UraniumCell_C", displayName: "Encased Uranium Cell", description: "Uranium Cells are produced from Uranium Ore. \nUsed to produce Uranium Fuel Rods for Nuclear Power production.\n\nCaution: Mildly Radioactive.", iconPath: "Resource/Parts/UraniumCell/NuclearCell.png" }, { id: "Desc_AluminumPlateReinforced_C", displayName: "Heat Sink", description: "Used to dissipate heat faster.", iconPath: "Resource/Parts/HeatSink/Heatsink.png" }, { id: "Desc_CoolingSystem_C", displayName: "Cooling System", description: "Used to keep temperatures of advanced parts and buildings from exceeding to inefficient levels.", iconPath: "Resource/Parts/CoolingSystem/CoolingSystem.png" }, { id: "Desc_NitricAcid_C", displayName: "Nitric Acid", description: "Produced by reaction of Nitrogen Gas with Water. Its high corrosiveness and oxidizing properties make it an excellent choice for refinement and fuel production processes.", iconPath: "Resource/Parts/NitricAcid/NitricAcid.png" }, { id: "Desc_AluminumCasing_C", displayName: "Aluminum Casing", description: "A versatile container cast from Aluminum Ingots.", iconPath: "Resource/Parts/AluminumCasing/AluminiumCasing.png" }, { id: "Desc_ModularFrameLightweight_C", displayName: "Radio Control Unit", description: "Enhances and directs radio signals.", iconPath: "Resource/Parts/RadioControlUnit/RadioControlUnit.png" }, { id: "Desc_AluminumPlate_C", displayName: "Alclad Aluminum Sheet", description: "Thin, lightweight, and highly durable sheets mainly used for products that require high heat conduction or a high specific strength.", iconPath: "Resource/Parts/AluminumPlate/AluminiumSheet.png" }, { id: "Desc_Computer_C", displayName: "Computer", description: "A Computer is a complex logic machine that is used to control advanced behavior in machines.", iconPath: "Resource/Parts/Computer/Computer.png" }, { id: "Desc_CrystalOscillator_C", displayName: "Crystal Oscillator", description: "A crystal oscillator is an electronic oscillator circuit that uses the mechanical resonance of a vibrating crystal to create an electrical signal with a precise frequency.", iconPath: "Resource/Parts/CrystalOscillator/CrystalOscillator.png" }, { id: "Desc_AluminaSolution_C", displayName: "Alumina Solution", description: "Dissolved Alumina, extracted from Bauxite. Can be further refined into Aluminum Scrap for Aluminum Ingot production.", iconPath: "Resource/Parts/Alumina/LiquidAlumina_Pipe.png" }, { id: "Desc_SpaceElevatorPart_1_C", displayName: "Smart Plating", description: "Project Part #1. Ship with the Space Elevator to complete phases of Project Assembly.", iconPath: "Resource/Parts/SmartPlate/SpelevatorPart_1.png" }, { id: "Desc_HighSpeedConnector_C", displayName: "High-Speed Connector", description: "The high-speed connector connects several cables and wires in a very efficient way. Uses a standard pattern so its applications are many and varied.", iconPath: "Resource/Parts/HighSpeedConnector/HighSpeedConnector.png" }, { id: "Desc_SpaceElevatorPart_3_C", displayName: "Automated Wiring", description: "Project Part #3. Ship with the Space Elevator to complete phases of Project Assembly.", iconPath: "Resource/Parts/AutomatedWiring/SpelevatorPart_3.png" }, { id: "Desc_Stator_C", displayName: "Stator", description: "Used for crafting.\nThe static parts of a motor.", iconPath: "Resource/Parts/Stator/Stator.png" }, { id: "Desc_CircuitBoardHighSpeed_C", displayName: "AI Limiter", description: "AI Limiters are super advanced electronics that are used to control AIs and keep them from evolving in malicious ways.", iconPath: "Resource/Parts/AIlimiter/AILimiter.png" }, { id: "Desc_HighSpeedWire_C", displayName: "Quickwire", description: "Caterium's high conductivity and resistance to corrosion makes it ideal for small, advanced electronics.", iconPath: "Resource/Parts/HighSpeedWire/Quickwire.png" }, { id: "Desc_SpaceElevatorPart_4_C", displayName: "Modular Engine", description: "Project Part #4. Ship with the Space Elevator to complete phases of Project Assembly.", iconPath: "Resource/Parts/ModularEngine/SpelevatorPart_4.png" }, { id: "Desc_SpaceElevatorPart_5_C", displayName: "Adaptive Control Unit", description: "Project Part #5. Ship with the Space Elevator to complete phases of Project Assembly.", iconPath: "Resource/Parts/ControlSystem/SpelevatorPart_5.png" }, { id: "Desc_MotorLightweight_C", displayName: "Turbo Motor", description: "The Turbo Motor is a more complex and more powerful version of the regular Motor.", iconPath: "Resource/Parts/TurboMotor/TurboMotor.png" }, { id: "Desc_PressureConversionCube_C", displayName: "Pressure Conversion Cube", description: "Converts outgoing force into internal pressure. Required to contain unstable, high-energy matter.", iconPath: "Resource/Parts/PressureConversionCube/ConversionCube.png" }, { id: "Desc_ModularFrameFused_C", displayName: "Fused Modular Frame", description: "A corrosion resistant, nitride hardened, highly robust, yet lightweight modular frame.", iconPath: "Resource/Parts/ModularFrameFused/FusedModularFrame.png" }, { id: "Desc_ComputerSuper_C", displayName: "Supercomputer", description: "The supercomputer is the next-gen version of the computer.", iconPath: "Resource/Parts/ComputerSuper/SuperComputer.png" }, { id: "Desc_ElectromagneticControlRod_C", displayName: "Electromagnetic Control Rod", description: "Control Rods regulate power output via electromagnetism.", iconPath: "Resource/Parts/ElectromagneticControlRod/ElectromagneticControlRod.png" }, { id: "Desc_CopperDust_C", displayName: "Copper Powder", description: "Ground down Copper Ingots.\nThe high natural density of Copper, combined with the granularity of the powder, makes this part fit for producing Nuclear Pasta in the Particle Accelerator.", iconPath: "Resource/Parts/CopperDust/CopperDust.png" }, { id: "Desc_GasTank_C", displayName: "Empty Fluid Tank", description: "Used to package gases and volatile liquids for transportation.", iconPath: "Resource/Parts/GasTank/PressureTank.png" }, { id: "Desc_SpaceElevatorPart_9_C", displayName: "Nuclear Pasta", description: "Project Part #9. Ship with the Space Elevator to complete phases of Project Assembly.\nPower Usage: 500-1500 MW (1000 MW average).\n\nNuclear Pasta is extremely dense degenerate matter, formed when extreme pressure forces protons and electrons together into neutrons. It is theorized to exist naturally within the crust of neutron stars.", iconPath: "Resource/Parts/NuclearPasta/NuclearPasta.png" }, { id: "Desc_SpaceElevatorPart_7_C", displayName: "Assembly Director System", description: "Project Part #6. Ship with the Space Elevator to complete phases of Project Assembly.\n\nThis extremely fast and precise computing system is specifically designed to direct the Project Assembly: Assembly Phase.", iconPath: "Resource/Parts/AssemblyControlUnit/AssemblyDirectorSystem.png" }, { id: "Desc_SpaceElevatorPart_6_C", displayName: "Magnetic Field Generator", description: "Project Part #7. Ship with the Space Elevator to complete phases of Project Assembly.\n\nThese modular generators use superconducting magnets and vast amounts of electricity to produce an easily expandable and powerful magnetic field.", iconPath: "Resource/Parts/MagneticFieldGenerator/MagneticFieldGenerator.png" }, { id: "Desc_SpaceElevatorPart_8_C", displayName: "Thermal Propulsion Rocket", description: "Project Part #8. Ship with the Space Elevator to complete phases of Project Assembly.\n\nUses extreme heat to produce the high-pressure plasma required to get Project Assembly into motion.", iconPath: "Resource/Parts/ThermalAntimatterPropulsionRocket/ThermalPropulsionRocket.png" }, { id: "Desc_Gunpowder_C", displayName: "Black Powder", description: "An explosive powder that is commonly used to produce simple explosives.", iconPath: "Resource/Parts/GunPowder/Gunpowder.png" }, { id: "Desc_Filter_C", displayName: "Gas Filter", description: "Used in the Gas Mask to filter out toxins and pollutants from the air.", iconPath: "Resource/Parts/Filter/GasMaskFilter.png" }, { id: "Desc_HazmatFilter_C", displayName: "Iodine Infused Filter", description: "Used in the Hazmat Suit to absorb radioactive particles.", iconPath: "Resource/Parts/IodineInfusedFilter/HazmatFilter.png" }, { id: "Desc_AlienProtein_C", displayName: "Alien Protein", description: "Ground down Alien Remains in a neat little package.\nUsed for medical purposes and to research alien organisms.", iconPath: "Resource/Parts/AlienProtein/AlienProtein.png" }, { id: "Desc_AlienDNACapsule_C", displayName: "Alien DNA Capsule", description: "This data capsule translates organic chemicals into readable alien genetics information.\nUsed for researching alien organisms.\n\nGo the extra kilometer! Knowledge is power, and power is just efficiency with fewer steps. Depositing Alien DNA Capsules in the AWESOME Sink provides FICSIT with knowledge, and Pioneers with Coupons.", iconPath: "Resource/Parts/AlienDNACapsule/AlienDNA.png" }, { id: "Desc_Crystal_mk3_C", displayName: "Purple Power Slug", description: "A strange slug radiating a powerful strange power.", iconPath: "Resource/Environment/Crystal/PowerSlugPurple.png" }, { id: "Desc_Crystal_mk2_C", displayName: "Yellow Power Slug", description: "A strange slug radiating a strange power.", iconPath: "Resource/Environment/Crystal/PowerSlugYellow.png" }, { id: "Desc_Crystal_C", displayName: "Blue Power Slug", description: "A strange slug radiating a weak strange power.", iconPath: "Resource/Environment/Crystal/PowerSlugGreen.png" }, { id: "Desc_GunpowderMK2_C", displayName: "Smokeless Powder", description: "An explosive powder that is commonly used to produce modern firearms.", iconPath: "Resource/Parts/GunPowder/GunpowderMk2.png" }, { id: "Desc_XmasStar_C", displayName: "FICSMAS Wonder Star", description: "This special FICSMAS Star signifies the productivity of FICSIT all across the universe. It also signifies the fact that you have nearly completed the Holiday Event, so it's time to get back to work.", iconPath: "Events/Christmas/Parts/Star.png" }, { id: "Desc_XmasBallCluster_C", displayName: "FICSMAS Ornament Bundle", description: "All the FICSMAS Ornaments smashed together to make even more FICSMAS Decorations!", iconPath: "Events/Christmas/Parts/Balls.png" }, { id: "Desc_XmasWreath_C", displayName: "FICSMAS Decoration", description: "A decoration used to make decorations. Its use cases are questionable.", iconPath: "Events/Christmas/Parts/Wreath.png" }, { id: "Desc_CandyCane_C", displayName: "Candy Cane", description: "A delicious Candy Cane to be enjoyed during the FICSMAS Holidays. \n*Disclaimer: Can't be consumed...", iconPath: "Events/Christmas/Parts/CanePart.png" }, { id: "Desc_Snow_C", displayName: "Actual Snow", description: "It's snow. Not the nice, thick, crunchy kind though... more the disgustingly wet, slushy kind... Guess we can make stuff from it.", iconPath: "Events/Christmas/Parts/Snow.png" }, { id: "Desc_XmasBow_C", displayName: "FICSMAS Bow", description: "A fancy Bow, maybe someone can wear this? You certainly can't! Probably, some parts and decorations can be made from this.", iconPath: "Events/Christmas/Parts/Bow.png" }, { id: "Desc_XmasBall3_C", displayName: "Copper FICSMAS Ornament", description: "Still used for making FICSMAS Decorations.", iconPath: "Events/Christmas/Parts/XmasBall_Yellow.png" }, { id: "Desc_XmasBall4_C", displayName: "Iron FICSMAS Ornament", description: "This super special... nope... still just used for making FICSMAS Decorations.", iconPath: "Events/Christmas/Parts/XmasBall_Silver.png" }, { id: "Desc_XmasBranch_C", displayName: "FICSMAS Tree Branch", description: "A special Tree Branch used to produce parts and buildings during the FICSMAS Event.", iconPath: "Events/Christmas/Parts/Branch.png" }, { id: "Desc_XmasBall1_C", displayName: "Red FICSMAS Ornament", description: "Used for making FICSMAS Decorations.", iconPath: "Events/Christmas/Parts/XmasBall_Red.png" }, { id: "Desc_XmasBall2_C", displayName: "Blue FICSMAS Ornament", description: "Again, used for making FICSMAS Decorations.", iconPath: "Events/Christmas/Parts/XmasBall_Blue.png" }, { id: "Desc_Gift_C", displayName: "FICSMAS Gift", description: "Special FICSMAS buildings and parts can be obtained and produced from this FICSIT Holiday present.\n\n*Watch the sky for deliveries from orbit!", iconPath: "Events/Christmas/Parts/Gift.png" }, { id: "Desc_Water_C", displayName: "Water", description: "It's water.", iconPath: "Resource/RawResources/Water/LiquidWater_Pipe.png" }, { id: "Desc_OreIron_C", displayName: "Iron Ore", description: "Used for crafting.\nThe most essential basic resource.", iconPath: "Resource/RawResources/Nodes/iron_new.png" }, { id: "Desc_Stone_C", displayName: "Limestone", description: "Used for crafting.\nBasic resource mainly used for stable foundations.", iconPath: "Resource/RawResources/Stone/Stone.png" }, { id: "Desc_Coal_C", displayName: "Coal", description: "Mainly used as fuel for vehicles & coal generators and for steel production.", iconPath: "Resource/RawResources/Coal/CoalOre.png" }, { id: "Desc_Sulfur_C", displayName: "Sulfur", description: "Sulfur is primarily used for Black Powder.", iconPath: "Resource/RawResources/Sulfur/Sulfur.png" }, { id: "Desc_LiquidOil_C", displayName: "Crude Oil", description: "Crude Oil is refined into all kinds of Oil-based resources, like Fuel and Plastic.", iconPath: "Resource/RawResources/CrudeOil/LiquidOil_Pipe.png" }, { id: "Desc_RawQuartz_C", displayName: "Raw Quartz", description: "Raw Quartz can be processed into Quartz Crystals and Silica, which both offer a variety of applications.", iconPath: "Resource/Parts/QuartzCrystal/QuartzCrystal.png" }, { id: "Desc_OreCopper_C", displayName: "Copper Ore", description: "Used for crafting.\nBasic resource mainly used for electricity.", iconPath: "Resource/RawResources/Nodes/copper_new.png" }, { id: "Desc_OreGold_C", displayName: "Caterium Ore", description: "Caterium Ore is smelted into Caterium Ingots. Caterium Ingots are mostly used for advanced electronics.", iconPath: "Resource/RawResources/Nodes/CateriumOre.png" }, { id: "Desc_OreUranium_C", displayName: "Uranium", description: "Uranium is a radioactive element. \nUsed to produce Encased Uranium Cells for Uranium Fuel Rods.\n\nCaution: Moderately Radioactive.", iconPath: "Resource/RawResources/OreUranium/UraniumOre.png" }, { id: "Desc_NitrogenGas_C", displayName: "Nitrogen Gas", description: "Nitrogen can be used in a variety of ways, such as metallurgy, cooling, and Nitric Acid production. On Massage-2(AB)b, it can be extracted from underground gas wells.", iconPath: "Resource/Parts/Alumina/LiquidAlumina_Pipe.png" }, { id: "Desc_OreBauxite_C", displayName: "Bauxite", description: "Bauxite is used to produce Alumina, which can be further refined into the Aluminum Scrap required to produce Aluminum Ingots.", iconPath: "Resource/RawResources/Nodes/Bauxite.png" }, { id: "BP_ItemDescriptorPortableMiner_C", displayName: "Portable Miner", description: "Can be set up on a resource node to automatically extract the resource. Note that it has limited storage space.", iconPath: "Equipment/PortableMiner/PortableMiner.png" }, { id: "Desc_FlowerPetals_C", displayName: "Flower Petals", description: "Used for crafting.\nColorful native flower petals.", iconPath: "Resource/Parts/GenericBiomass/FlowerPetals_Final.png" }, { id: "Desc_Wood_C", displayName: "Wood", description: "Primarily used as fuel.\nBiomass Burners and vehicles can use it for power.", iconPath: "Resource/Parts/GenericBiomass/Wood.png" }, { id: "Desc_GenericBiomass_C", displayName: "Biomass", description: "Primarily used as fuel.\nBiomass burners and vehicles can use it for power.\nBiomass is much more energy-efficient than raw biological matter.", iconPath: "Resource/Parts/GenericBiomass/Biomass_Final.png" }, { id: "Desc_Biofuel_C", displayName: "Solid Biofuel", description: "The most energy-efficient form of solid biomass. Can be used as fuel for the Chainsaw.", iconPath: "Resource/Parts/SolidBiofuel/SolidBiofuel.png" }, { id: "Desc_LiquidBiofuel_C", displayName: "Liquid Biofuel", description: "Liquid Biofuel can be used to generate power or packaged to be used as fuel for Vehicles.", iconPath: "Resource/Parts/BioFuel/LiquidBiofuel_Pipe.png" }, { id: "Desc_PackagedBiofuel_C", displayName: "Packaged Liquid Biofuel", description: "Liquid Biofuel, packaged for alternative transport. Can be used as fuel for Vehicles and the Jetpack.", iconPath: "Resource/Parts/Turbofuel/LiquidBiofuel.png" }, { id: "Desc_PackagedAlumina_C", displayName: "Packaged Alumina Solution", description: "Alumina Solution, packaged for alternative transport.", iconPath: "Resource/Parts/Alumina/PackagedAluminaSolution.png" }, { id: "Desc_PackagedNitrogenGas_C", displayName: "Packaged Nitrogen Gas", description: "Nitrogen Gas, packaged for alternative transport.", iconPath: "Resource/Parts/PackagedNitrogen/PackagedNitrogen.png" }, { id: "Desc_PackagedNitricAcid_C", displayName: "Packaged Nitric Acid", description: "Nitric Acid, packaged for alternative transport.", iconPath: "Resource/Parts/NitricAcid/PackagedNitricAcid.png" }, { id: "Desc_PackagedSulfuricAcid_C", displayName: "Packaged Sulfuric Acid", description: "Sulfuric Acid, packaged for alternative transport.", iconPath: "Resource/Parts/SulfuricAcid/PckagedSulphuricAcid.png" }, { id: "Desc_Fabric_C", displayName: "Fabric", description: "Used for equipment crafting.\nFlexible but durable fabric.", iconPath: "Resource/Parts/GenericBiomass/Fabric.png" }, { id: "Desc_StingerParts_C", displayName: "Stinger Remains", description: "The remains of whatever that creepy thing was.\nUsed for MAM research.", iconPath: "Resource/Environment/AnimalParts/StingerPart.png" }, { id: "Desc_SpitterParts_C", displayName: "Plasma Spitter Remains", description: "The remains of a plasma spitting alien creature.\nUsed for MAM research.", iconPath: "Resource/Parts/AnimalParts/SpitterPart.png" }, { id: "Desc_HogParts_C", displayName: "Hog Remains", description: "The carapace of the alien Hog creature.\nUsed for MAM research.", iconPath: "Resource/Parts/AnimalParts/HogPart.png" }, { id: "Desc_HatcherParts_C", displayName: "Hatcher Remains", description: "The shell-like remains of an alien... thing.\nUsed for MAM research.", iconPath: "Resource/Environment/AnimalParts/HatcherPart.png" }, { id: "Desc_Mycelia_C", displayName: "Mycelia", description: "Used for crafting.\nBiomass Burners and vehicles can use it for power.", iconPath: "Resource/Parts/GenericBiomass/Mycelia.png" }, { id: "Desc_Leaves_C", displayName: "Leaves", description: "Primarily used as fuel.\nBiomass Burners and vehicles can use it for power.", iconPath: "Resource/Parts/GenericBiomass/Leaves.png" }, { id: "Desc_NuclearFuelRod_C", displayName: "Uranium Fuel Rod", description: "Used as fuel for the Nuclear Power Plant.\n\nCaution: Produces radioactive Uranium Waste when consumed.\nCaution: Moderately Radioactive.", iconPath: "Resource/Parts/NuclearFuelRod/NuclearFuelRod.png" }, { id: "Desc_PlutoniumFuelRod_C", displayName: "Plutonium Fuel Rod", description: "Used as fuel for the Nuclear Power Plant.\n\nCaution: Produces radioactive Plutonium Waste when consumed.\nCaution: HIGHLY Radioactive.", iconPath: "Resource/Parts/PlutoniumFuelRods/PlutoniumFuelRod.png" }, { id: "BP_EquipmentDescriptorBeacon_C", displayName: "Beacon", description: "PENDING REMOVAL\nThis item will (likely) be removed in a future update.\n\nCurrently only used as an ingredient in an alternative recipe.", iconPath: "Resource/Equipment/Beacon/Beacon.png" }, { id: "Desc_Rebar_Explosive_C", displayName: "Explosive Rebar", description: "Explodes on impact, dealing heavy damage.", iconPath: "Equipment/RebarGun/ExpRebar.png" }, { id: "Desc_Rebar_Stunshot_C", displayName: "Stun Rebar", description: "Electrocutes the target on impact, stunning it for a short time.\n\nStun duration: 5 seconds", iconPath: "Equipment/RebarGun/StunRebar.png" }, { id: "Desc_SpikedRebar_C", displayName: "Iron Rebar", description: "A simple iron rebar that can be shot using the Rebar Gun, for self-defense purposes.", iconPath: "Equipment/RebarGun/Rebar.png" }, { id: "Desc_CartridgeSmartProjectile_C", displayName: "Homing Rifle Ammo", description: "The bullet guidance system built into this ammunition allows it to accurately hit any target within the reticle area.\nEspecially useful when dealing with agile threats, or for Pioneers who can't be bothered to aim properly.", iconPath: "Equipment/Rifle/HomingRifle.png" }, { id: "Desc_NobeliskExplosive_C", displayName: "Nobelisk", description: "A simple explosive, useful for clearing boulders, vegetation, and other obstacles.", iconPath: "Resource/Parts/NobeliskExplosive/Explosive.png" }, { id: "Desc_NobeliskCluster_C", displayName: "Cluster Nobelisk", description: "A Nobelisk that detonates into multiple smaller explosions. Practical when clearing out large areas of vegetation and other inconveniences.", iconPath: "Resource/Parts/NobeliskExplosive/Cluster.png" }, { id: "Desc_NobeliskGas_C", displayName: "Gas Nobelisk", description: "Instead of a regular explosion, this Nobelisk creates a deadly gas cloud.", iconPath: "Resource/Parts/NobeliskExplosive/Gas.png" }, { id: "Desc_NobeliskNuke_C", displayName: "Nuke Nobelisk", description: "This Nobelisk uses a nuclear fission reaction to generate a massive explosion.\n\nWARNING: Ensure all FICSIT property is clear of the blast zone before detonation.\n", iconPath: "Resource/Parts/NobeliskExplosive/Nuke.png" }, { id: "Desc_NobeliskShockwave_C", displayName: "Pulse Nobelisk", description: "Instead of a regular explosion, this Nobelisk generates a powerful shockwave.", iconPath: "Resource/Parts/NobeliskExplosive/Shock.png" }, { id: "Desc_Fireworks_Projectile_01_C", displayName: "Sweet Fireworks", description: "Merry FICSMAS and a Happy New Year!", iconPath: "Events/Christmas/Fireworks/Rocket01.png" }, { id: "Desc_Fireworks_Projectile_02_C", displayName: "Fancy Fireworks", description: "Fireworks are produced from random ingredients. Primarily used for having a good time.", iconPath: "Events/Christmas/Fireworks/Rocket02.png" }, { id: "Desc_Fireworks_Projectile_03_C", displayName: "Sparkly Fireworks", description: "Goes Pfffeeeeew... BOOM! *Sparkle*", iconPath: "Events/Christmas/Fireworks/Rocket03.png" }, { id: "Desc_SnowballProjectile_C", displayName: "Snowball", description: "Compressed dihydrogen monoxide crystals.", iconPath: "Events/Christmas/Parts/SnowballProjectile.png" }, { id: "Desc_Rebar_Spreadshot_C", displayName: "Shatter Rebar", description: "This rebar fractures when shot, launching deadly debris in a wide spread but with limited range.", iconPath: "Equipment/RebarGun/ScatterRebar.png" }, { id: "Desc_CartridgeChaos_C", displayName: "Turbo Rifle Ammo", description: "Lightweight, compact, and volatile. These rounds provide extreme capacity and fire rates, at the cost of accuracy.", iconPath: "Equipment/Rifle/TurboRifle.png" }, { id: "Desc_CartridgeStandard_C", displayName: "Rifle Ammo", description: "Standard issue Rifle ammunition, useful for establishing dominance.", iconPath: "Equipment/Rifle/Rifle.png" }] };

  // src/SVG/SvgFactory.ts
  var SvgFactory = class {
    static createSvgGroup(position, ...classes) {
      let result = this.createSvgElement("g", ...classes);
      result.setAttribute("transform", `translate(${position.x}, ${position.y})`);
      return result;
    }
    static createSvgRect(dimensions, ...classes) {
      let result = this.createSvgElement("rect", ...classes);
      result.setAttribute("width", `${dimensions.width}`);
      result.setAttribute("height", `${dimensions.height}`);
      result.setAttribute("x", `${dimensions.x}`);
      result.setAttribute("y", `${dimensions.y}`);
      return result;
    }
    static createSvgLine(startPos, endPos, ...classes) {
      let result = this.createSvgElement("line", ...classes);
      result.setAttribute("x1", `${startPos.x}`);
      result.setAttribute("y1", `${startPos.y}`);
      result.setAttribute("x2", `${endPos.x}`);
      result.setAttribute("y2", `${endPos.y}`);
      return result;
    }
    static createSvgPath(...classes) {
      let result = this.createSvgElement("path", ...classes);
      result.setAttribute("g", "");
      return result;
    }
    static createSvgForeignObject(...classes) {
      let result = this.createSvgElement("foreignObject", ...classes);
      return result;
    }
    static createSvgElement(tag, ...classes) {
      let result = document.createElementNS("http://www.w3.org/2000/svg", tag);
      result.classList.add(...classes);
      return result;
    }
  };

  // src/Sankey/Slots/SankeySlot.ts
  var SankeySlot = class _SankeySlot extends EventTarget {
    static slotWidth = 10;
    static boundsChangedEvent = "bounds-changed";
    static deletionEvent = "deleted";
    static resourcesAmountChangedEvent = "resources-amount-changed";
    constructor(slotsGroup, slotsGroupSvg, resource, ...classes) {
      super();
      this._resource = { ...resource };
      this._parentGroup = slotsGroup;
      let dimensions = {
        width: _SankeySlot.slotWidth,
        height: 0,
        x: 0,
        y: 0
      };
      this._slotSvgRect = SvgFactory.createSvgRect(dimensions, ...classes);
      slotsGroupSvg.appendChild(this.slotSvgRect);
      this.updateHeight();
    }
    setYPosition(yPosition) {
      this.slotSvgRect.setAttribute("y", `${yPosition}`);
      this.dispatchEvent(new Event(_SankeySlot.boundsChangedEvent));
    }
    delete() {
      this.dispatchEvent(new Event(_SankeySlot.deletionEvent));
      this.slotSvgRect.remove();
    }
    get resourcesAmount() {
      return this._resource.amount;
    }
    set resourcesAmount(resourcesAmount) {
      if (this._resource.amount != resourcesAmount) {
        this._resource.amount = resourcesAmount;
        this.updateHeight();
        this.dispatchEvent(new Event(_SankeySlot.resourcesAmountChangedEvent));
      }
    }
    get resourceId() {
      return this._resource.id;
    }
    get slotSvgRect() {
      return this._slotSvgRect;
    }
    updateHeight() {
      let resourcesQuotient = this.resourcesAmount / this._parentGroup.resourcesAmount;
      this.slotSvgRect.setAttribute(
        "height",
        `${this._parentGroup.height * resourcesQuotient}`
      );
      this.dispatchEvent(new Event(_SankeySlot.boundsChangedEvent));
    }
    get parentGroup() {
      return this._parentGroup;
    }
    _resource;
    _slotSvgRect;
    _parentGroup;
  };

  // src/Geometry/Point.ts
  var Point = class {
    constructor(x, y) {
      this.x = x;
      this.y = y;
    }
  };

  // src/Sankey/Slots/OutputSankeySlot.ts
  var OutputSankeySlot = class extends SankeySlot {
    constructor(slotsGroup, slotsGroupSvg, resource, ...classes) {
      super(slotsGroup, slotsGroupSvg, resource, "output-slot", ...classes);
    }
  };

  // src/Geometry/Curve.ts
  var Curve = class {
    startPoint = { x: 0, y: 0 };
    startDeviationPoint = { x: 0, y: 0 };
    endDeviationPoint = { x: 0, y: 0 };
    endPoint = { x: 0, y: 0 };
    static fromTwoPoints(startPoint, endPoint) {
      return {
        startPoint,
        endPoint,
        startDeviationPoint: {
          x: (startPoint.x + endPoint.x) / 2,
          y: startPoint.y
        },
        endDeviationPoint: {
          x: (startPoint.x + endPoint.x) / 2,
          y: endPoint.y
        }
      };
    }
  };

  // src/Geometry/Rectangle.ts
  var Rectangle = class _Rectangle {
    constructor(x, y, width, height) {
      this.x = x;
      this.y = y;
      this.width = width;
      this.height = height;
    }
    static fromSvgRect(element) {
      return new _Rectangle(
        +element.getAttribute("x"),
        +element.getAttribute("y"),
        +element.getAttribute("width"),
        +element.getAttribute("height")
      );
    }
    static fromSvgBounds(element, panContext) {
      let zoomScale = panContext.getTransform().scale;
      let bounds = element.getBoundingClientRect();
      bounds = {
        x: (bounds.x - panContext.getTransform().x) / zoomScale,
        y: (bounds.y - panContext.getTransform().y) / zoomScale,
        width: bounds.width / zoomScale,
        height: bounds.height / zoomScale
      };
      return bounds;
    }
  };

  // src/SVG/SvgPathBuilder.ts
  var SvgPathBuilder = class {
    path = "";
    startAt(point) {
      return this.pointAt(point);
    }
    pointAt(point) {
      this.path += `M ${point.x} ${point.y} `;
      return this;
    }
    /**
     * Start point will be ignored because that's how SVG works.
     */
    curve(curve) {
      this.path += `C ${curve.startDeviationPoint.x} ${curve.startDeviationPoint.y} ${curve.endDeviationPoint.x} ${curve.endDeviationPoint.y} ${curve.endPoint.x} ${curve.endPoint.y} `;
      return this;
    }
    verticalLineTo(y) {
      this.path += `V ${y} `;
      return this;
    }
    build() {
      return this.path;
    }
  };

  // src/GameData/GameData.ts
  function satisfactoryIconPath(path) {
    return `GameData/SatisfactoryIcons/${path}`;
  }
  function toItemsInMinute(amount, consumingTime) {
    return 60 / consumingTime * amount;
  }
  function overclockPower(power, overclockRatio, powerExponent) {
    return power * Math.pow(overclockRatio, powerExponent);
  }

  // src/ContextMenu/CustomContextMenu.ts
  var CustomContextMenu = class _CustomContextMenu extends EventTarget {
    static menuOpenedEvent = "menu-opened";
    static menuClosedEvent = "menu-closed";
    /** 
     * @param name is used to deduce html element id: `${name}-context-menu-container`
     */
    constructor(ownerNode, name) {
      super();
      this._menuContainer = document.querySelector(`#${name}-context-menu-container`);
      this._menuContainer.addEventListener("mousedown", () => {
        this.closeMenu();
      });
      this.addMenuTo(ownerNode);
    }
    openMenu() {
      this._isMenuOpened = true;
      this._menuContainer.classList.remove("hidden");
      this.dispatchEvent(new Event(_CustomContextMenu.menuOpenedEvent));
    }
    closeMenu() {
      this._isMenuOpened = false;
      this._menuContainer.classList.add("hidden");
      this.dispatchEvent(new Event(_CustomContextMenu.menuClosedEvent));
    }
    addMenuTo(element) {
      let contextMenu = document.querySelector(`#${this.containerId}>.context-menu`);
      element.addEventListener("contextmenu", (event) => {
        let mouseEvent = event;
        event.preventDefault();
        this._openingPosition = { x: mouseEvent.clientX, y: mouseEvent.clientY };
        contextMenu.style.top = `${mouseEvent.pageY + 5}px`;
        contextMenu.style.left = `${mouseEvent.pageX + 5}px`;
        this.openMenu();
        event.stopPropagation();
      });
      this.addEventListener(_CustomContextMenu.menuOpenedEvent, function() {
        element.classList.add("selected");
      });
      this.addEventListener(_CustomContextMenu.menuClosedEvent, function() {
        element.classList.remove("selected");
      });
    }
    get isMenuOpened() {
      return this._isMenuOpened;
    }
    get openingPosition() {
      return this._openingPosition;
    }
    get containerId() {
      return this._menuContainer.id;
    }
    setupMenuOption(optionNode, eventName) {
      optionNode.addEventListener("mousedown", (event) => {
        event.stopPropagation();
      });
      optionNode.addEventListener("click", () => {
        if (this._isMenuOpened) {
          this.dispatchEvent(new Event(eventName));
          this.closeMenu();
        }
      });
    }
    static setSwitchState(switchNode, enabled) {
      if (enabled) {
        switchNode.classList.add("enabled");
      } else {
        switchNode.classList.remove("enabled");
      }
    }
    _menuContainer;
    _isMenuOpened = false;
    _openingPosition;
  };

  // src/ContextMenu/LinkContextMenu.ts
  var LinkContextMenu = class _LinkContextMenu extends CustomContextMenu {
    static deleteLinkOptionClickedEvent = "delete-node-option-clicked";
    constructor(ownerNode) {
      super(ownerNode, "link");
      this._deleteLinkOption = document.querySelector(`#${this.containerId} #delete-link-option`);
      this.setupMenuOption(this._deleteLinkOption, _LinkContextMenu.deleteLinkOptionClickedEvent);
    }
    _deleteLinkOption;
  };

  // src/Sankey/SankeyLink.ts
  var SankeyLink = class _SankeyLink {
    static connect(firstSlot, secondSlot, panContext) {
      let link = new _SankeyLink(firstSlot, secondSlot, panContext);
      let linksGroup = document.querySelector("#viewport>g.links");
      linksGroup.appendChild(link._svgPath);
      linksGroup.appendChild(link._resourceDisplay);
    }
    constructor(firstSlot, secondSlot, panContext) {
      this._firstSlot = firstSlot;
      this._secondSlot = secondSlot;
      this._panContext = panContext;
      let pushResourcesAmount = (from, to) => {
        if (to.resourcesAmount >= from.resourcesAmount) {
          to.resourcesAmount = from.resourcesAmount;
          this._resourceAmountDisplay.innerText = `${+to.resourcesAmount.toFixed(4)}/min`;
        } else {
          throw Error("Increasing link's resources amount not yet implemented.");
        }
      };
      firstSlot.addEventListener(SankeySlot.boundsChangedEvent, this.recalculate.bind(this));
      secondSlot.addEventListener(SankeySlot.boundsChangedEvent, this.recalculate.bind(this));
      firstSlot.addEventListener(SankeySlot.deletionEvent, this.delete.bind(this, secondSlot));
      secondSlot.addEventListener(SankeySlot.deletionEvent, this.delete.bind(this, firstSlot));
      firstSlot.addEventListener(SankeySlot.resourcesAmountChangedEvent, () => pushResourcesAmount(firstSlot, secondSlot));
      secondSlot.addEventListener(SankeySlot.resourcesAmountChangedEvent, () => pushResourcesAmount(secondSlot, firstSlot));
      this._svgPath = SvgFactory.createSvgPath("link", "animate-appearance");
      this._resourceDisplay = this.createResourceDisplay({
        id: firstSlot.resourceId,
        amount: firstSlot.resourcesAmount
      });
      this.recalculate();
      let contextMenu = new LinkContextMenu(this._svgPath);
      contextMenu.addMenuTo(firstSlot.slotSvgRect);
      contextMenu.addMenuTo(secondSlot.slotSvgRect);
      contextMenu.addEventListener(LinkContextMenu.deleteLinkOptionClickedEvent, () => {
        firstSlot.delete();
      });
      let setSelection = (select) => {
        if (!contextMenu.isMenuOpened) {
          if (select) {
            this._svgPath.classList.add("selected");
            firstSlot.slotSvgRect.classList.add("selected");
            secondSlot.slotSvgRect.classList.add("selected");
          } else {
            this._svgPath.classList.remove("selected");
            firstSlot.slotSvgRect.classList.remove("selected");
            secondSlot.slotSvgRect.classList.remove("selected");
          }
        }
      };
      firstSlot.slotSvgRect.addEventListener("mouseenter", () => setSelection(true));
      secondSlot.slotSvgRect.addEventListener("mouseenter", () => setSelection(true));
      this._svgPath.addEventListener("mouseenter", () => setSelection(true));
      firstSlot.slotSvgRect.addEventListener("mouseleave", () => setSelection(false));
      secondSlot.slotSvgRect.addEventListener("mouseleave", () => setSelection(false));
      this._svgPath.addEventListener("mouseleave", () => setSelection(false));
    }
    recalculate() {
      let first = Rectangle.fromSvgBounds(this._firstSlot.slotSvgRect, this._panContext);
      let second = Rectangle.fromSvgBounds(this._secondSlot.slotSvgRect, this._panContext);
      let curve1 = Curve.fromTwoPoints(
        { x: first.x + first.width, y: first.y },
        { x: second.x, y: second.y }
      );
      let curve2 = Curve.fromTwoPoints(
        { x: second.x, y: second.y + second.height },
        { x: first.x + first.width, y: first.y + first.height }
      );
      let svgPath = new SvgPathBuilder().startAt(curve1.startPoint).curve(curve1).verticalLineTo(curve1.endPoint.y + second.height).curve(curve2).verticalLineTo(curve1.startPoint.y).build();
      this._svgPath.setAttribute("d", svgPath);
      this._svgPath.style.clipPath = `view-box path("${svgPath}")`;
      let avgHeight = first.height / 2 + second.height / 2;
      let linkBoundsWidth = Math.abs(curve1.startPoint.x - curve1.endPoint.x);
      let minSize = 50;
      let maxSize = 90;
      let resourceDisplaySize = Math.max(
        minSize,
        Math.min(
          maxSize,
          Math.min(avgHeight, linkBoundsWidth) - 16
        )
      );
      let middlePoint = {
        x: curve1.startDeviationPoint.x,
        y: (curve1.startPoint.y + curve1.endPoint.y) / 2 + avgHeight / 2
      };
      this._resourceDisplay.setAttribute("x", `${middlePoint.x - resourceDisplaySize / 2}`);
      this._resourceDisplay.setAttribute("y", `${middlePoint.y - resourceDisplaySize / 2}`);
      this._resourceDisplay.setAttribute("width", `${resourceDisplaySize}`);
      this._resourceDisplay.setAttribute("height", `${resourceDisplaySize}`);
      let amountText = this._resourceDisplay.querySelector("div.resource-amount");
      amountText.style.fontSize = `${resourceDisplaySize / maxSize * 18}px`;
    }
    createResourceDisplay(resource) {
      let foreignObject = SvgFactory.createSvgForeignObject("resource-display");
      let container = document.createElement("div");
      container.classList.add("container");
      let icon = document.createElement("img");
      icon.classList.add("icon");
      let resourceDesc = Satisfactory_default.resources.find(
        (resourceDesc2) => {
          return resourceDesc2.id == resource.id;
        }
      );
      if (resourceDesc != void 0) {
        icon.src = satisfactoryIconPath(resourceDesc.iconPath);
        icon.alt = resourceDesc.displayName;
      }
      this._resourceAmountDisplay = document.createElement("div");
      this._resourceAmountDisplay.classList.add("resource-amount");
      this._resourceAmountDisplay.innerText = `${resource.amount}/min`;
      container.appendChild(icon);
      container.appendChild(this._resourceAmountDisplay);
      foreignObject.appendChild(container);
      return foreignObject;
    }
    delete(slotToDelete) {
      if (!this._isDeleted) {
        this._isDeleted = true;
        slotToDelete.delete();
        this._svgPath.remove();
        this._resourceDisplay.remove();
      }
    }
    _firstSlot;
    _secondSlot;
    _panContext;
    _svgPath;
    _resourceDisplay;
    _resourceAmountDisplay;
    _isDeleted = false;
  };

  // src/PanZoomConfiguration.ts
  var import_panzoom = __toESM(require_panzoom());
  var PanZoomConfiguration = class {
    static configurePanContext(viewport, canvas) {
      this._panContext = (0, import_panzoom.default)(viewport, {
        zoomDoubleClickSpeed: 1,
        // disables double click zoom
        beforeMouseDown: () => {
          let shouldIgnore = !this._isPanning;
          return shouldIgnore;
        },
        beforeWheel: (event) => {
          event.preventDefault();
          let shouldIgnore = !this._isZooming && !event.ctrlKey;
          return shouldIgnore;
        }
      });
      canvas.addEventListener("wheel", (event) => {
        let scrollDelta = { x: event.deltaX, y: event.deltaY };
        if (scrollDelta.x === 0 && event.shiftKey) {
          scrollDelta.x = scrollDelta.y;
          scrollDelta.y = 0;
        }
        if (!this._isZooming && !event.ctrlKey) {
          this.context.moveTo(
            this.context.getTransform().x - scrollDelta.x,
            this.context.getTransform().y - scrollDelta.y
          );
        }
      }, { passive: true });
      window.addEventListener("focusout", () => {
        this.stopPanning();
        this.stopZooming();
      });
    }
    static setPanningButtons(requiredCodes, requiredKeys) {
      window.addEventListener("keydown", (event) => {
        if (event.repeat) {
          return;
        }
        let anyCodeDown = requiredCodes.includes(event.code);
        let anyKeyDown = requiredKeys.includes(event.key);
        if (anyCodeDown || anyKeyDown) {
          event.preventDefault();
          this.startPanning();
        }
      });
      window.addEventListener("keyup", (event) => {
        if (event.repeat) {
          return;
        }
        let anyCodeUp = requiredCodes.includes(event.code);
        let anyKeyUp = requiredKeys.includes(event.key);
        if (anyCodeUp || anyKeyUp) {
          event.preventDefault();
          this.stopPanning();
        }
      });
    }
    static setZoomingButtons(requiredCodes, requiredKeys) {
      window.addEventListener("keydown", (event) => {
        if (event.repeat) {
          return;
        }
        let anyCodeDown = requiredCodes.includes(event.code);
        let anyKeyDown = requiredKeys.includes(event.key);
        if (anyCodeDown || anyKeyDown) {
          event.preventDefault();
          this.startZooming();
        }
      });
      window.addEventListener("keyup", (event) => {
        if (event.repeat) {
          return;
        }
        let anyCodeUp = requiredCodes.includes(event.code);
        let anyKeyUp = requiredKeys.includes(event.key);
        if (anyCodeUp || anyKeyUp) {
          event.preventDefault();
          this.stopZooming();
        }
      });
    }
    static get context() {
      if (this._panContext == void 0) {
        throw Error("Pan context is not defined");
      }
      return this._panContext;
    }
    static get isPanning() {
      return this._isPanning;
    }
    static get isZooming() {
      return this._isZooming;
    }
    static startPanning() {
      this._isPanning = true;
      this._container.classList.add("move");
    }
    static stopPanning() {
      this._isPanning = false;
      this._container.classList.remove("move");
    }
    static startZooming() {
      this._isZooming = true;
    }
    static stopZooming() {
      this._isZooming = false;
    }
    constructor() {
    }
    static _panContext;
    static _isPanning = false;
    static _isZooming = false;
    static _container = document.querySelector("#container");
  };

  // src/MouseHandler.ts
  var MouseHandler = class _MouseHandler {
    static getInstance() {
      if (this.instance != void 0) {
        return this.instance;
      } else {
        this.instance = new this();
        return this.instance;
      }
    }
    handleMouseMove(event) {
      if (this.mouseStatus === _MouseHandler.MouseStatus.DraggingNode) {
        if (this.draggedNode == void 0) {
          throw Error("Dragged node wasn't saved.");
        }
        let previousPos = this.draggedNode.position;
        let zoomScale = PanZoomConfiguration.context.getTransform().scale;
        let mousePosDelta = {
          x: event.clientX - this.lastMousePos.x,
          y: event.clientY - this.lastMousePos.y
        };
        this.draggedNode.position = {
          x: previousPos.x + mousePosDelta.x / zoomScale,
          y: previousPos.y + mousePosDelta.y / zoomScale
        };
        this.lastMousePos.x = event.clientX;
        this.lastMousePos.y = event.clientY;
      } else if (this.mouseStatus === _MouseHandler.MouseStatus.ConnectingInputSlot || this.mouseStatus === _MouseHandler.MouseStatus.ConnectingOutputSlot) {
        if (this.firstConnectingSlot == void 0) {
          throw Error("First connecting slot wasn't saved.");
        }
        if (this.slotConnectingLine == void 0 || this.slotConnectingCurve == void 0) {
          throw Error("Slot connecting line wasn't created.");
        }
        const svgMousePos = _MouseHandler.clientToCanvasPosition({ x: event.clientX, y: event.clientY });
        this.slotConnectingCurve = Curve.fromTwoPoints(
          this.slotConnectingCurve.startPoint,
          svgMousePos
        );
        let path = new SvgPathBuilder().startAt(this.slotConnectingCurve.startPoint).curve(this.slotConnectingCurve).build();
        this.slotConnectingLine.setAttribute("d", path);
      }
    }
    handleMouseUp() {
      if (this.mouseStatus === _MouseHandler.MouseStatus.DraggingNode) {
        this.mouseStatus = _MouseHandler.MouseStatus.Free;
        this.draggedNode = void 0;
        this.lastMousePos.x = 0;
        this.lastMousePos.y = 0;
      }
    }
    cancelConnectingSlots() {
      if (this.mouseStatus == _MouseHandler.MouseStatus.ConnectingInputSlot || this.mouseStatus == _MouseHandler.MouseStatus.ConnectingOutputSlot) {
        this.firstConnectingSlot = void 0;
        this.slotConnectingLine?.remove();
        this.slotConnectingLine = void 0;
        this.slotConnectingCurve = void 0;
        this.mouseStatus = _MouseHandler.MouseStatus.Free;
      }
    }
    inputSlotClicked(event, targetSlot) {
      if (this.mouseStatus === _MouseHandler.MouseStatus.Free) {
        this.mouseStatus = _MouseHandler.MouseStatus.ConnectingInputSlot;
        this.startConnectingSlot(event, targetSlot, true);
      } else if (this.mouseStatus === _MouseHandler.MouseStatus.ConnectingOutputSlot) {
        if (this.firstConnectingSlot == void 0) {
          throw Error("First connecting slot wasn't saved.");
        }
        if (this.firstConnectingSlot.resourceId != targetSlot.resourceId) {
          return;
        }
        let resourcesAmount = Math.min(targetSlot.resourcesAmount, this.firstConnectingSlot.resourcesAmount);
        let newSlot1 = this.firstConnectingSlot.splitOffSlot(resourcesAmount);
        let newSlot2 = targetSlot.splitOffSlot(resourcesAmount);
        SankeyLink.connect(newSlot1, newSlot2, PanZoomConfiguration.context);
        this.cancelConnectingSlots();
      }
    }
    outputSlotClicked(event, targetSlot) {
      if (this.mouseStatus === _MouseHandler.MouseStatus.Free) {
        this.mouseStatus = _MouseHandler.MouseStatus.ConnectingOutputSlot;
        this.startConnectingSlot(event, targetSlot, false);
      } else if (this.mouseStatus === _MouseHandler.MouseStatus.ConnectingInputSlot) {
        if (this.firstConnectingSlot == void 0) {
          throw Error("First connecting slot wasn't saved.");
        }
        if (this.firstConnectingSlot.resourceId != targetSlot.resourceId) {
          return;
        }
        let resourcesAmount = Math.min(targetSlot.resourcesAmount, this.firstConnectingSlot.resourcesAmount);
        let newSlot1 = this.firstConnectingSlot.splitOffSlot(resourcesAmount);
        let newSlot2 = targetSlot.splitOffSlot(resourcesAmount);
        SankeyLink.connect(newSlot1, newSlot2, PanZoomConfiguration.context);
        this.cancelConnectingSlots();
      }
    }
    startConnectingSlot(event, firstSlot, isInput) {
      this.firstConnectingSlot = firstSlot;
      let zoomScale = PanZoomConfiguration.context.getTransform().scale;
      let slotBounds = firstSlot.slotSvgRect.getBoundingClientRect();
      slotBounds = {
        x: (slotBounds.x - PanZoomConfiguration.context.getTransform().x) / zoomScale,
        y: (slotBounds.y - PanZoomConfiguration.context.getTransform().y) / zoomScale,
        width: slotBounds.width / zoomScale,
        height: slotBounds.height / zoomScale
      };
      let startPos = {
        x: slotBounds.x + (isInput ? 0 : slotBounds.width),
        y: slotBounds.y + slotBounds.height / 2
      };
      const svgMousePos = _MouseHandler.clientToCanvasPosition({ x: event.clientX, y: event.clientY });
      this.slotConnectingCurve = Curve.fromTwoPoints(
        startPos,
        svgMousePos
      );
      let path = new SvgPathBuilder().startAt(this.slotConnectingCurve.startPoint).curve(this.slotConnectingCurve).build();
      this.slotConnectingLine = SvgFactory.createSvgPath("link-hint");
      this.slotConnectingLine.classList.add(isInput ? "from-input" : "from-output");
      this.slotConnectingLine.setAttribute("d", path);
      this.viewport.appendChild(this.slotConnectingLine);
    }
    startDraggingNode(event, node) {
      if (this.mouseStatus === _MouseHandler.MouseStatus.Free) {
        this.mouseStatus = _MouseHandler.MouseStatus.DraggingNode;
        this.draggedNode = node;
        this.lastMousePos.x = event.clientX;
        this.lastMousePos.y = event.clientY;
      }
    }
    static clientToCanvasPosition(clientPosition) {
      let viewport = document.querySelector("#viewport");
      const domPoint = new DOMPointReadOnly(clientPosition.x, clientPosition.y);
      return domPoint.matrixTransform(viewport.getScreenCTM().inverse());
    }
    constructor() {
    }
    static instance;
    firstConnectingSlot;
    draggedNode;
    slotConnectingLine;
    slotConnectingCurve;
    mouseStatus = _MouseHandler.MouseStatus.Free;
    lastMousePos = new Point(0, 0);
    viewport = document.querySelector("#viewport");
  };
  ((MouseHandler2) => {
    let MouseStatus;
    ((MouseStatus2) => {
      MouseStatus2[MouseStatus2["Free"] = 0] = "Free";
      MouseStatus2[MouseStatus2["DraggingNode"] = 1] = "DraggingNode";
      MouseStatus2[MouseStatus2["ConnectingInputSlot"] = 2] = "ConnectingInputSlot";
      MouseStatus2[MouseStatus2["ConnectingOutputSlot"] = 3] = "ConnectingOutputSlot";
    })(MouseStatus = MouseHandler2.MouseStatus || (MouseHandler2.MouseStatus = {}));
  })(MouseHandler || (MouseHandler = {}));

  // src/Sankey/Slots/SankeySlotExceeding.ts
  var SankeySlotExceeding = class extends OutputSankeySlot {
    constructor(slotsGroup, slotsGroupSvg, resource) {
      super(slotsGroup, slotsGroupSvg, resource, "exceeding");
      this.slotSvgRect.addEventListener("click", (event) => {
        if (!PanZoomConfiguration.isPanning && !PanZoomConfiguration.isZooming) {
          MouseHandler.getInstance().outputSlotClicked(event, this);
        }
      });
      this.slotSvgRect.addEventListener("dblclick", (event) => {
        event.stopPropagation();
      });
    }
    splitOffSlot(resourcesAmount) {
      return this.parentGroup.addSlot(resourcesAmount);
    }
  };

  // src/Sankey/Slots/InputSankeySlot.ts
  var InputSankeySlot = class extends SankeySlot {
    constructor(slotsGroup, slotsGroupSvg, resource, ...classes) {
      super(slotsGroup, slotsGroupSvg, resource, "input-slot", ...classes);
    }
  };

  // src/Sankey/Slots/SankeySlotMissing.ts
  var SankeySlotMissing = class extends InputSankeySlot {
    constructor(slotsGroup, slotsGroupSvg, resource) {
      super(slotsGroup, slotsGroupSvg, resource, "missing");
      this.slotSvgRect.addEventListener("click", (event) => {
        if (!PanZoomConfiguration.isPanning && !PanZoomConfiguration.isZooming) {
          MouseHandler.getInstance().inputSlotClicked(event, this);
        }
      });
      this.slotSvgRect.addEventListener("dblclick", (event) => {
        event.stopPropagation();
      });
    }
    splitOffSlot(resourcesAmount) {
      return this.parentGroup.addSlot(resourcesAmount);
    }
  };

  // src/Sankey/SlotsGroup.ts
  var SlotsGroup = class _SlotsGroup extends EventTarget {
    static boundsChangedEvent = "bounds-changed";
    static changedVacantResourcesAmountEvent = "changed-vacant-resources-amount";
    constructor(node, type, resource, startY) {
      super();
      this._type = type;
      this._resource = { ...resource };
      this._parentNode = node;
      let position = type === "input" ? new Point(0, startY) : new Point(SankeyNode.nodeWidth + SankeySlot.slotWidth, startY);
      this._groupSvg = SvgFactory.createSvgGroup(position, `${type}-slots`);
      this._lastSlot = this.initializeLastSlot(resource);
      node.nodeSvgGroup.appendChild(this._groupSvg);
      this.addEventListener(_SlotsGroup.boundsChangedEvent, () => {
        for (const slot of this._slots) {
          slot.dispatchEvent(new Event(SankeySlot.boundsChangedEvent));
        }
      });
    }
    addSlot(resourcesAmount) {
      resourcesAmount = Math.min(resourcesAmount, this._lastSlot.resourcesAmount);
      this._lastSlot.resourcesAmount -= resourcesAmount;
      let newSlot;
      if (this._type === "input") {
        newSlot = new InputSankeySlot(this, this._groupSvg, {
          id: this.resourceId,
          amount: resourcesAmount
        });
      } else if (this._type === "output") {
        newSlot = new OutputSankeySlot(this, this._groupSvg, {
          id: this.resourceId,
          amount: resourcesAmount
        });
      } else {
        throw Error("Unexpected slots group type");
      }
      this._slots.push(newSlot);
      newSlot.addEventListener(SankeySlot.deletionEvent, () => {
        let index = this._slots.findIndex((slot) => Object.is(slot, newSlot));
        this._slots.splice(index, 1);
        this.updateSlotPositions();
      });
      newSlot.addEventListener(SankeySlot.resourcesAmountChangedEvent, () => {
        this.updateSlotPositions();
      });
      this.updateSlotPositions();
      return newSlot;
    }
    delete() {
      while (this._slots.length !== 0) {
        this._slots[0].delete();
      }
      this._groupSvg.remove();
    }
    get height() {
      let parentResourcesAmount;
      if (this._type == "input") {
        parentResourcesAmount = this._parentNode.inputResourcesAmount;
      } else {
        parentResourcesAmount = this._parentNode.outputResourcesAmount;
      }
      return this._parentNode.height * (this.resourcesAmount / parentResourcesAmount);
    }
    get resourcesAmount() {
      return this._resource.amount;
    }
    get vacantResourcesAmount() {
      return this._lastSlot.resourcesAmount;
    }
    set resourcesAmount(value) {
      let subtractedResources = this._resource.amount - value;
      if (subtractedResources > 0) {
        {
          let smallerValue = Math.min(subtractedResources, this._lastSlot.resourcesAmount);
          subtractedResources -= smallerValue;
          this._lastSlot.resourcesAmount -= smallerValue;
        }
        for (let i = this._slots.length - 1; i >= 0 && subtractedResources > 0; --i) {
          let slot = this._slots[i];
          let smallerValue = Math.min(subtractedResources, slot.resourcesAmount);
          subtractedResources -= smallerValue;
          slot.resourcesAmount -= smallerValue;
          if (slot.resourcesAmount === 0) {
            slot.delete();
          }
        }
      }
      this._resource.amount = value;
      this.updateSlotPositions();
      this.dispatchEvent(new Event(_SlotsGroup.changedVacantResourcesAmountEvent));
    }
    get resourceId() {
      return this._resource.id;
    }
    updateSlotPositions() {
      let freeResourcesAmount = this.resourcesAmount;
      let nextYPosition = 0;
      for (const slot of this._slots) {
        slot.setYPosition(nextYPosition);
        slot.updateHeight();
        freeResourcesAmount -= slot.resourcesAmount;
        nextYPosition += +(slot.slotSvgRect.getAttribute("height") ?? 0);
      }
      this._lastSlot.setYPosition(nextYPosition);
      this._lastSlot.resourcesAmount = freeResourcesAmount;
      this.dispatchEvent(new Event(_SlotsGroup.changedVacantResourcesAmountEvent));
    }
    /** Should be called only once. */
    initializeLastSlot(resource) {
      if (this._type === "input") {
        return new SankeySlotMissing(this, this._groupSvg, { ...resource });
      } else if (this._type === "output") {
        return new SankeySlotExceeding(this, this._groupSvg, { ...resource });
      } else {
        throw Error("Unexpected slots group type");
      }
    }
    _type;
    _resource;
    _slots = [];
    _lastSlot;
    _groupSvg;
    _parentNode;
  };

  // src/ContextMenu/NodeContextMenu.ts
  var NodeContextMenu = class _NodeContextMenu extends CustomContextMenu {
    static deleteNodeOptionClickedEvent = "delete-node-option-clicked";
    static configureNodeOptionClickedEvent = "configure-node-option-clicked";
    constructor(ownerNode) {
      super(ownerNode, "node");
      this._deleteNodeOption = document.querySelector(`#${this.containerId} #delete-node-option`);
      this.setupMenuOption(this._deleteNodeOption, _NodeContextMenu.deleteNodeOptionClickedEvent);
      this._configureNodeOption = document.querySelector(`#${this.containerId} #configure-node-option`);
      this.setupMenuOption(this._configureNodeOption, _NodeContextMenu.configureNodeOptionClickedEvent);
    }
    _deleteNodeOption;
    _configureNodeOption;
  };

  // src/Sankey/NodeConfiguration/Configurator.ts
  var Configurators = class {
    inputsConfigurators = new Array();
    outputsConfigurators = new Array();
    powerConfigurator;
    removeFromDom() {
      for (const configurator of this.inputsConfigurators) {
        configurator.remove();
      }
      for (const configurator of this.outputsConfigurators) {
        configurator.remove();
      }
      if (this.powerConfigurator != void 0) {
        this.powerConfigurator.remove();
      }
    }
  };

  // src/SVG/SvgIcons.ts
  var SvgIcons = class {
    static replaceAllPlaceholders() {
      for (const iconName in this._icons) {
        let className = `svg.${iconName}_icon-placeholder`;
        document.querySelectorAll(className).forEach((element) => {
          this.placeIcon(element, this._icons[iconName]);
          element.classList.remove(className);
        });
      }
    }
    static createIcon(name) {
      let svgElement = SvgFactory.createSvgElement("svg");
      this.placeIcon(svgElement, this._icons[name]);
      return svgElement;
    }
    static placeIcon(svgElement, iconPath) {
      svgElement.setAttribute("xmlns", "http://www.w3.org/2000/svg");
      svgElement.setAttribute("viewBox", "0 -960 960 960");
      let path = SvgFactory.createSvgPath();
      path.setAttribute("d", iconPath);
      svgElement.appendChild(path);
    }
    static _icons = {
      "plus": "M440-440H240q-17 0-28.5-11.5T200-480q0-17 11.5-28.5T240-520h200v-200q0-17 11.5-28.5T480-760q17 0 28.5 11.5T520-720v200h200q17 0 28.5 11.5T760-480q0 17-11.5 28.5T720-440H520v200q0 17-11.5 28.5T480-200q-17 0-28.5-11.5T440-240v-200Z",
      "locked-lock": "M240-80q-33 0-56.5-23.5T160-160v-400q0-33 23.5-56.5T240-640h40v-80q0-83 58.5-141.5T480-920q83 0 141.5 58.5T680-720v80h40q33 0 56.5 23.5T800-560v400q0 33-23.5 56.5T720-80H240Zm240-200q33 0 56.5-23.5T560-360q0-33-23.5-56.5T480-440q-33 0-56.5 23.5T400-360q0 33 23.5 56.5T480-280ZM360-640h240v-80q0-50-35-85t-85-35q-50 0-85 35t-35 85v80Z",
      "unlocked-lock": "M240-80q-33 0-56.5-23.5T160-160v-400q0-33 23.5-56.5T240-640h360v-80q0-50-35-85t-85-35q-42 0-73.5 25.5T364-751q-4 14-16.5 22.5T320-720q-17 0-28.5-11t-8.5-26q14-69 69-116t128-47q83 0 141.5 58.5T680-720v80h40q33 0 56.5 23.5T800-560v400q0 33-23.5 56.5T720-80H240Zm0-80h480v-400H240v400Zm240-120q33 0 56.5-23.5T560-360q0-33-23.5-56.5T480-440q-33 0-56.5 23.5T400-360q0 33 23.5 56.5T480-280ZM240-160v-400 400Z",
      "unlink": "m625-449-71-71h46q17 0 28.5 11.5T640-480q0 10-4 18t-11 13ZM820-84q-11 11-28 11t-28-11L84-764q-11-11-11-28t11-28q11-11 28-11t28 11l680 680q11 11 11 28t-11 28ZM280-280q-83 0-141.5-58.5T80-480q0-69 42-123t108-71l74 74h-24q-50 0-85 35t-35 85q0 50 35 85t85 35h120q17 0 28.5 11.5T440-320q0 17-11.5 28.5T400-280H280Zm80-160q-17 0-28.5-11.5T320-480q0-17 11.5-28.5T360-520h25l79 80H360Zm380 112q-9-14-6.5-30t16.5-25q23-17 36.5-42t13.5-55q0-50-35-85t-85-35H560q-17 0-28.5-11.5T520-640q0-17 11.5-28.5T560-680h120q83 0 141.5 58.5T880-480q0 49-22.5 91.5T795-318q-14 9-30 6.5T740-328Z",
      "chevron-up": "M480-555.69 310.15-385.85q-5.61 5.62-13.77 6-8.15.39-14.53-6-6.39-6.38-6.39-14.15 0-7.77 6.39-14.15l175.53-175.54q9.7-9.69 22.62-9.69 12.92 0 22.62 9.69l175.53 175.54q5.62 5.61 6 13.77.39 8.15-6 14.53-6.38 6.39-14.15 6.39-7.77 0-14.15-6.39L480-555.69Z",
      "cross": "M480-424 284-228q-11 11-28 11t-28-11q-11-11-11-28t11-28l196-196-196-196q-11-11-11-28t11-28q11-11 28-11t28 11l196 196 196-196q11-11 28-11t28 11q11 11 11 28t-11 28L536-480l196 196q11 11 11 28t-11 28q-11 11-28 11t-28-11L480-424Z",
      "trash": "M280-120q-33 0-56.5-23.5T200-200v-520q-17 0-28.5-11.5T160-760q0-17 11.5-28.5T200-800h160q0-17 11.5-28.5T400-840h160q17 0 28.5 11.5T600-800h160q17 0 28.5 11.5T800-760q0 17-11.5 28.5T760-720v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM400-280q17 0 28.5-11.5T440-320v-280q0-17-11.5-28.5T400-640q-17 0-28.5 11.5T360-600v280q0 17 11.5 28.5T400-280Zm160 0q17 0 28.5-11.5T600-320v-280q0-17-11.5-28.5T560-640q-17 0-28.5 11.5T520-600v280q0 17 11.5 28.5T560-280ZM280-720v520-520Z",
      "configuration": "M480-120q-17 0-28.5-11.5T440-160v-160q0-17 11.5-28.5T480-360q17 0 28.5 11.5T520-320v40h280q17 0 28.5 11.5T840-240q0 17-11.5 28.5T800-200H520v40q0 17-11.5 28.5T480-120Zm-320-80q-17 0-28.5-11.5T120-240q0-17 11.5-28.5T160-280h160q17 0 28.5 11.5T360-240q0 17-11.5 28.5T320-200H160Zm160-160q-17 0-28.5-11.5T280-400v-40H160q-17 0-28.5-11.5T120-480q0-17 11.5-28.5T160-520h120v-40q0-17 11.5-28.5T320-600q17 0 28.5 11.5T360-560v160q0 17-11.5 28.5T320-360Zm160-80q-17 0-28.5-11.5T440-480q0-17 11.5-28.5T480-520h320q17 0 28.5 11.5T840-480q0 17-11.5 28.5T800-440H480Zm160-160q-17 0-28.5-11.5T600-640v-160q0-17 11.5-28.5T640-840q17 0 28.5 11.5T680-800v40h120q17 0 28.5 11.5T840-720q0 17-11.5 28.5T800-680H680v40q0 17-11.5 28.5T640-600Zm-480-80q-17 0-28.5-11.5T120-720q0-17 11.5-28.5T160-760h320q17 0 28.5 11.5T520-720q0 17-11.5 28.5T480-680H160Z",
      "power": "M420-412H302q-14 0-20-12t2-23l203-295q5-7 12-9t15 1q8 3 11.5 9.5T528-726l-27 218h140q14 0 20 13t-3 24L431-199q-5 6-12 7.5t-14-1.5q-7-3-10.5-9t-2.5-14l28-196Z",
      "mouse": "M480-80q-116 0-198-82t-82-198v-240q0-116 82-198t198-82q116 0 198 82t82 198v240q0 116-82 198T480-80Zm40-520h160q0-72-45.5-127T520-796v196Zm-240 0h160v-196q-69 14-114.5 69T280-600Zm200 440q83 0 141.5-58.5T680-360v-160H280v160q0 83 58.5 141.5T480-160Zm0-360Zm40-80Zm-80 0Zm40 80Z",
      "mouse-left": "M 480 -80 a 269.6 269.6 90 0 1 -198 -82 A 269.6 269.6 90 0 1 200 -360 V -600 c 0 -77.2 27.2 -143.2 82 -198 A 269.6 269.6 90 0 1 480 -880 c 77.2 0 143.2 27.2 198 82 A 269.6 269.6 90 0 1 760 -600 v 240 c 0 77.2 -27.2 143.2 -82 198 A 269.6 269.6 90 0 1 480 -80 Z m 40 -520 h 160 c 0 -48 -15.2 -90.4 -45.6 -126.8 A 195.2 195.2 90 0 0 520 -796 V -600 Z m -40 440 c 55.2 0 102.4 -19.6 141.6 -58.4 A 192.8 192.8 90 0 0 680 -360 v -160 H 280 v 160 c 0 55.2 19.6 102.4 58.4 141.6 A 192.8 192.8 90 0 0 480 -160 Z",
      "mouse-right": "M 480 -80 a 269.6 269.6 90 0 1 -198 -82 A 269.6 269.6 90 0 1 200 -360 V -600 c 0 -77.2 27.2 -143.2 82 -198 A 269.6 269.6 90 0 1 480 -880 c 77.2 0 143.2 27.2 198 82 A 269.6 269.6 90 0 1 760 -600 v 240 c 0 77.2 -27.2 143.2 -82 198 A 269.6 269.6 90 0 1 480 -80 Z M 280 -600 h 160 V -796 c -46 9.2 -84 32 -114.4 69.2 A 193.6 193.6 90 0 0 280 -600 Z m 200 440 c 55.2 0 102.4 -19.6 141.6 -58.4 A 192.8 192.8 90 0 0 680 -360 v -160 H 280 v 160 c 0 55.2 19.6 102.4 58.4 141.6 A 192.8 192.8 90 0 0 480 -160 Z",
      "mouse-drag": "M 699.11 -179.11 H 592.06 l 22.98 22.45 a 20.63 20.63 0 0 1 6.26 15.15 c 0 5.91 -2.08 10.96 -6.26 15.14 a 20.63 20.63 0 0 1 -15.14 6.27 a 20.63 20.63 0 0 1 -15.15 -6.27 l -59 -59 a 18.32 18.32 0 0 1 -4.45 -6.8 A 23.13 23.13 0 0 1 520 -200 c 0 -2.78 0.43 -5.4 1.3 -7.83 c 0.88 -2.44 2.36 -4.7 4.44 -6.8 l 59.01 -59 a 20.33 20.33 0 0 1 14.88 -6.27 c 5.75 0 10.7 2.1 14.89 6.27 a 20.33 20.33 0 0 1 6.26 14.88 c 0 5.75 -2.09 10.7 -6.26 14.89 l -22.98 22.97 h 107.57 V -328.46 l -23.5 23.5 c -4.17 4.18 -9.05 6.18 -14.62 6 c -5.57 -0.17 -10.44 -2.34 -14.62 -6.52 a 20.33 20.33 0 0 1 -6.27 -14.89 c 0 -5.74 2.1 -10.7 6.27 -14.88 l 59 -59 a 18.32 18.32 0 0 1 6.8 -4.45 c 2.43 -0.87 5.05 -1.3 7.83 -1.3 c 2.78 0 5.4 0.43 7.83 1.3 c 2.44 0.88 4.7 2.36 6.8 4.44 l 59.52 59.53 c 4.18 4.18 6.27 9.06 6.27 14.63 s -2.1 10.44 -6.27 14.62 a 20.33 20.33 0 0 1 -14.88 6.26 c -5.75 0 -10.7 -2.08 -14.88 -6.26 l -23.5 -22.98 v 107.57 h 107.05 l -22.98 -22.45 a 20.63 20.63 0 0 1 -6.27 -15.15 c 0 -5.91 2.1 -10.96 6.27 -15.14 a 20.63 20.63 0 0 1 15.14 -6.27 c 5.92 0 10.97 2.1 15.15 6.27 l 59 59 a 18.3 18.3 0 0 1 4.44 6.8 A 23.1 23.1 0 0 1 920 -200 c 0 2.78 -0.43 5.4 -1.3 7.83 a 18.3 18.3 0 0 1 -4.44 6.8 l -59.53 59.52 c -4.18 4.18 -9.06 6.18 -14.63 6 c -5.57 -0.17 -10.44 -2.34 -14.62 -6.52 a 20.33 20.33 0 0 1 -6.26 -14.88 c 0 -5.75 2.08 -10.7 6.26 -14.89 l 22.98 -22.97 H 740.89 v 107.05 l 22.45 -22.98 a 20.63 20.63 0 0 1 15.15 -6.26 c 5.91 0 10.96 2.08 15.14 6.26 a 20.63 20.63 0 0 1 6.26 15.14 c 0 5.92 -2.08 10.97 -6.26 15.15 l -59 59 a 18.3 18.3 0 0 1 -6.8 4.44 A 23.1 23.1 0 0 1 720 0 c -2.78 0 -5.4 -0.43 -7.83 -1.3 a 18.3 18.3 0 0 1 -6.8 -4.44 l -59.52 -59.53 a 19.44 19.44 0 0 1 -6 -14.89 a 21.3 21.3 0 0 1 6.52 -14.88 a 20.33 20.33 0 0 1 14.88 -6.26 c 5.75 0 10.7 2.08 14.89 6.26 l 22.97 23.5 V -179.11 Z M 320 -160 c -77.33 0 -143.33 -27.33 -198 -82 c -54.67 -54.67 -82 -120.67 -82 -198 V -680 c 0 -77.33 27.33 -143.33 82 -198 C 176.67 -932.67 242.67 -960 320 -960 s 143.33 27.33 198 82 c 54.67 54.67 82 120.67 82 198 v 240 c 0 77.33 -27.33 143.33 -82 198 c -54.67 54.67 -120.67 82 -198 82 Z m 40 -520 h 160 c 0 -48 -15.17 -90.33 -45.5 -127 S 406 -866.67 360 -876 v 196 Z m -39 440 c 55.33 0 102.5 -19.5 141.5 -58.5 S 520.67 -384.67 520 -440 V -600 H 120 v 160 c 0 55.33 19.5 102.5 58.5 141.5 S 264.67 -240 320 -240 h 1 Z",
      "mac-command": "M260-120q-58 0-99-41t-41-99q0-58 41-99t99-41h60v-160h-60q-58 0-99-41t-41-99q0-58 41-99t99-41q58 0 99 41t41 99v60h160v-60q0-58 41-99t99-41q58 0 99 41t41 99q0 58-41 99t-99 41h-60v160h60q58 0 99 41t41 99q0 58-41 99t-99 41q-58 0-99-41t-41-99v-60H400v60q0 58-41 99t-99 41Zm0-80q25 0 42.5-17.5T320-260v-60h-60q-25 0-42.5 17.5T200-260q0 25 17.5 42.5T260-200Zm440 0q25 0 42.5-17.5T760-260q0-25-17.5-42.5T700-320h-60v60q0 25 17.5 42.5T700-200ZM400-400h160v-160H400v160ZM260-640h60v-60q0-25-17.5-42.5T260-760q-25 0-42.5 17.5T200-700q0 25 17.5 42.5T260-640Zm380 0h60q25 0 42.5-17.5T760-700q0-25-17.5-42.5T700-760q-25 0-42.5 17.5T640-700v60Z",
      "question-mark": "M584-637q0-43-28.5-69T480-732q-29 0-52.5 12.5T387-683q-16 23-43.5 26.5T296-671q-14-13-15.5-32t9.5-36q32-48 81.5-74.5T480-840q97 0 157.5 55T698-641q0 45-19 81t-70 85q-37 35-50 54.5T542-376q-4 24-20.5 40T482-320q-23 0-39.5-15.5T426-374q0-39 17-71.5t57-68.5q51-45 67.5-69.5T584-637ZM480-80q-33 0-56.5-23.5T400-160q0-33 23.5-56.5T480-240q33 0 56.5 23.5T560-160q0 33-23.5 56.5T480-80Z",
      "touchpad": "M593-80q-24 0-46-9t-39-26L332-292q-11-11-11.5-27.5T331-348l6-6q14-14 34-19t40 0l69 20v-287q0-17 11.5-28.5T520-680q17 0 28.5 11.5T560-640v340q0 20-15.5 31.5T509-262l-47-13 103 103q6 6 13 9t15 3h167q33 0 56.5-23.5T840-240v-160q0-17 11.5-28.5T880-440q17 0 28.5 11.5T920-400v160q0 66-47 113T760-80H593Zm47-280q-17 0-28.5-11.5T600-400v-120q0-17 11.5-28.5T640-560q17 0 28.5 11.5T680-520v120q0 17-11.5 28.5T640-360Zm120 0q-17 0-28.5-11.5T720-400v-80q0-17 11.5-28.5T760-520q17 0 28.5 11.5T800-480v80q0 17-11.5 28.5T760-360Zm0 200H565h195Zm-600-40q-33 0-56.5-23.5T80-280v-480q0-33 23.5-56.5T160-840h600q33 0 56.5 23.5T840-760v120q0 17-11.5 28.5T800-600q-17 0-28.5-11.5T760-640v-120H160v480h72q17 0 28.5 11.5T272-240q0 17-11.5 28.5T232-200h-72Z",
      "touchpad-two": "M160-200q-33 0-56.5-23.5T80-280v-480q0-33 23.5-56.5T160-840h600q33 0 56.5 23.5T840-760v120q0 17-11.5 28.5T800-600q-17 0-28.5-11.5T760-640v-120H160v480h72q17 0 28.5 11.5T272-240q0 17-11.5 28.5T232-200h-72Zm560-200v-80q0-17 11.5-28.5T760-520q17 0 28.5 11.5T800-480v80q0 17-11.5 28.5T760-360q-17 0-28.5-11.5T720-400Zm40 240H565h195ZM593-80q-24 0-46-9t-39-26L332-292q-11-11-11.5-27.5T331-348l6-6q14-14 34-19t40 0l69 20v-287q0-17 11.5-28.5T520-680q17 0 28.5 11.5T560-640v340q0 20-15.5 31.5T509-262l-47-13 103 103q6 6 13 9t15 3h167q33 0 56.5-23.5T840-240v-160q0-17 11.5-28.5T880-440q17 0 28.5 11.5T920-400v160q0 66-47 113T760-80H593Zm7-320v-280q0-17 11.5-28.5T640-720q17 0 28.5 11.5T680-680v280q0 17-11.5 28.5T640-360q-17 0-28.5-11.5T600-400Z",
      "touch-move": "M 592.8 -40 a 120 120 90 0 1 -84.8 -35.2 L 332 -252 a 36.8 36.8 90 0 1 -11.2 -29.6 c 0.8 -11.6 5.2 -21.6 13.2 -29.2 a 80 80 90 0 1 80 -21.2 l 66 19.2 V -640 c 0 -11.2 4 -20.8 11.6 -28.4 c 7.6 -8 17.2 -11.6 28.4 -11.6 c 11.2 0 20.8 4 28.4 11.6 c 8 7.6 11.6 17.2 11.6 28.4 v 380 c 0 13.2 -5.2 24 -16 32 a 39.2 39.2 90 0 1 -35.2 7.2 l -46 -13.2 l 102 102 c 3.6 3.2 8 6 12.8 8.4 a 36 36 90 0 0 15.2 3.6 H 760 c 22 0 40.8 -8 56.4 -23.6 c 16 -15.6 23.6 -34.4 23.6 -56.4 v -160 c 0 -11.2 4 -20.8 11.6 -28.4 c 7.6 -8 17.2 -11.6 28.4 -11.6 c 11.2 0 20.8 4 28.4 11.6 c 8 7.6 11.6 17.2 11.6 28.4 v 160 c 0 44 -16 81.6 -47.2 112.8 A 154 154 90 0 1 760 -40 h -167.2 Z M 640 -520 c 11.2 0 20.8 4 28.4 11.6 c 8 7.6 11.6 17.2 11.6 28.4 v 120 c 0 11.2 -4 20.8 -11.6 28.4 c -7.6 8 -17.2 11.6 -28.4 11.6 a 38.8 38.8 90 0 1 -28.4 -11.6 A 38.8 38.8 90 0 1 600 -360 v -120 c 0 -11.2 4 -20.8 11.6 -28.4 c 7.6 -8 17.2 -11.6 28.4 -11.6 Z m 120 40 c 11.2 0 20.8 4 28.4 11.6 c 8 7.6 11.6 17.2 11.6 28.4 v 80 c 0 11.2 -4 20.8 -11.6 28.4 c -7.6 8 -17.2 11.6 -28.4 11.6 a 38.8 38.8 90 0 1 -28.4 -11.6 A 38.8 38.8 90 0 1 720 -360 v -80 c 0 -11.2 4 -20.8 11.6 -28.4 c 7.6 -8 17.2 -11.6 28.4 -11.6 Z M 225.6 -579.2 v -68 c 0 -6.4 2.4 -12 6.4 -16 c 4 -4 9.2 -6 15.6 -6 c 6 0 11.2 2 15.2 6.4 c 4 4 6.4 9.2 6.4 15.2 v 68 l 23.2 -24 c 4 -4.4 9.6 -6.4 16 -6.4 c 6 0 11.2 2 15.6 6.4 c 4 4 6.4 9.6 6.4 16 c 0 5.6 -2.4 11.2 -6.4 15.2 l -61.2 61.2 a 19.2 19.2 90 0 1 -7.2 4.8 a 24 24 90 0 1 -16 0 a 19.2 19.2 90 0 1 -7.2 -4.8 L 170.4 -572.8 a 20 20 90 0 1 -6 -15.6 c 0 -5.6 2.4 -10.8 6.8 -15.2 c 4 -4.4 9.2 -6.4 15.2 -6.4 s 11.2 2 15.6 6.4 l 24 24 Z m -110.8 -112 l 24 23.6 c 4 4 6.4 9.6 6.4 16 c 0 6 -2.4 11.2 -6.8 15.6 c -4 4 -9.2 6.4 -15.6 6.4 a 21.2 21.2 90 0 1 -16 -6.4 L 46.4 -697.2 a 19.2 19.2 90 0 1 -4.8 -7.2 a 24 24 90 0 1 -1.2 -8 a 24 24 90 0 1 1.2 -8 a 19.2 19.2 90 0 1 4.8 -7.2 l 61.2 -61.2 c 4 -4.4 9.6 -6.8 15.6 -6.8 c 5.6 0 10.8 2.4 15.2 6.8 c 4 4 6.4 9.2 6.4 15.2 s -2 11.2 -6.4 15.6 l -24 24 h 68.4 c 6 0 11.2 2 15.6 6 c 4 4 6 9.2 6 15.6 a 20.8 20.8 90 0 1 -21.6 21.6 h -68 Z m 266 0 h -68 a 20.8 20.8 90 0 1 -16 -6 a 20.8 20.8 90 0 1 -6 -15.2 c 0 -6.4 2 -11.6 6.4 -15.6 c 4 -4 9.2 -6.4 15.2 -6.4 h 68 l -24 -23.2 a 21.6 21.6 90 0 1 -6.4 -15.6 c 0 -6 2 -11.2 6.4 -16 c 4 -4 9.6 -6.4 16 -6.4 c 5.6 0 11.2 2.4 15.2 6.8 l 61.2 61.2 c 2.4 2 4 4.4 4.8 6.8 a 24 24 90 0 1 0 16.4 a 19.2 19.2 90 0 1 -4.8 7.2 L 387.2 -636 a 20 20 90 0 1 -15.2 6.4 a 22 22 90 0 1 -15.2 -6.8 a 21.2 21.2 90 0 1 -6.4 -15.6 c 0 -6 2 -11.2 6.4 -15.6 l 24 -24 Z M 225.6 -845.2 l -24 24 a 20.8 20.8 90 0 1 -30.4 0 a 21.2 21.2 90 0 1 -6.8 -15.2 c 0 -6 2.4 -11.2 6.8 -15.6 L 232 -914 c 2 -2.4 4.4 -4 6.8 -4.8 a 24 24 90 0 1 8 -1.2 a 24 24 90 0 1 8.4 1.2 c 2.4 1.2 4.8 2.4 7.2 4.8 L 324 -852.4 a 20.8 20.8 90 0 1 0 30.4 c -4 4 -9.6 6.4 -15.6 6.4 a 21.2 21.2 90 0 1 -15.2 -6.4 l -24.4 -24 v 68.4 c 0 6 -2 11.2 -6.4 15.6 c -4 4 -9.2 6 -15.2 6 a 20.8 20.8 90 0 1 -15.6 -6 a 20.8 20.8 90 0 1 -6.4 -15.6 v -68 Z",
      "touch": "M419-80q-28 0-52.5-12T325-126L124-381q-8-9-7-21.5t9-20.5q20-21 48-25t52 11l74 45v-328q0-17 11.5-28.5T340-760q17 0 29 11.5t12 28.5v400q0 23-20.5 34.5T320-286l-36-22 104 133q6 7 14 11t17 4h221q33 0 56.5-23.5T720-240v-160q0-17-11.5-28.5T680-440H501q-17 0-28.5-11.5T461-480q0-17 11.5-28.5T501-520h179q50 0 85 35t35 85v160q0 66-47 113T640-80H419Zm83-260Zm-23-260q-17 0-28.5-11.5T439-640q0-2 5-20 8-14 12-28.5t4-31.5q0-50-35-85t-85-35q-50 0-85 35t-35 85q0 17 4 31.5t12 28.5q3 5 4 10t1 10q0 17-11 28.5T202-600q-11 0-20.5-6T167-621q-13-22-20-47t-7-52q0-83 58.5-141.5T340-920q83 0 141.5 58.5T540-720q0 27-7 52t-20 47q-5 9-14 15t-20 6Z",
      "pinch": "M593-40q-24 0-46-9t-39-26L332-252q-12-12-11-29.5t13-29.5q16-16 37.5-21.5t42.5.5l66 19v-327q0-17 11.5-28.5T520-680q17 0 28.5 11.5T560-640v380q0 20-16 32t-35 7l-46-13 102 102q5 5 12.5 8.5T593-120h167q33 0 56.5-23.5T840-200v-160q0-17 11.5-28.5T880-400q17 0 28.5 11.5T920-360v160q0 66-47 113T760-40H593Zm109-200ZM380-818 142-580h68q13 0 21.5 8.5T240-550q0 13-8.5 21.5T210-520H80q-17 0-28.5-11.5T40-560v-130q0-13 8.5-21.5T70-720q13 0 21.5 8.5T100-690v68l238-238h-68q-13 0-21.5-8.5T240-890q0-13 8.5-21.5T270-920h130q17 0 28.5 11.5T440-880v130q0 13-8.5 21.5T410-720q-13 0-21.5-8.5T380-750v-68Zm260 298q17 0 28.5 11.5T680-480v120q0 17-11.5 28.5T640-320q-17 0-28.5-11.5T600-360v-120q0-17 11.5-28.5T640-520Zm120 40q17 0 28.5 11.5T800-440v80q0 17-11.5 28.5T760-320q-17 0-28.5-11.5T720-360v-80q0-17 11.5-28.5T760-480Z"
    };
  };

  // src/Sankey/NodeConfiguration/ConfiguratorBuilder.ts
  var ConfiguratorBuilder = class _ConfiguratorBuilder {
    constructor(nodeConfig) {
      this._nodeConfig = nodeConfig;
      this._editElement = document.createElement("div");
      this._editElement.classList.add("edit");
      this._iconContainer = document.createElement("div");
      this._iconContainer.classList.add("icon-container");
      this._inputElement = document.createElement("input");
      this._unitsElement = document.createElement("div");
      this._unitsElement.classList.add("units");
      this._editElement.appendChild(this._iconContainer);
      this._editElement.appendChild(this._inputElement);
      this._editElement.appendChild(this._unitsElement);
    }
    build() {
      if (this._minimumGetter == void 0 || this._maximumGetter == void 0 || this._relatedPropertyGetter == void 0 || this._relatedPropertySetter == void 0) {
        throw Error("Configurator builder can't build without required fields");
      }
      let meetsTheMinimum = (value) => {
        let minimum = this._minimumGetter();
        return minimum == void 0 || value >= minimum;
      };
      let meetsTheMaximum = (value) => {
        let maximum = this._maximumGetter();
        return maximum == void 0 || value <= maximum;
      };
      let toFixed = _ConfiguratorBuilder.configuratorToFixed;
      this._inputElement.addEventListener("input", () => {
        let value = _ConfiguratorBuilder.numberParser(this._inputElement.value);
        if (value != void 0 && meetsTheMinimum(value) && meetsTheMaximum(value)) {
          this._inputElement.classList.remove("error");
          this._relatedPropertySetter(toFixed(value));
        } else {
          this._inputElement.classList.add("error");
        }
      });
      this._inputElement.addEventListener("blur", () => {
        this._inputElement.classList.remove("error");
        let value = _ConfiguratorBuilder.numberParser(this._inputElement.value);
        if (value != void 0) {
          if (!meetsTheMinimum(value)) {
            this._relatedPropertySetter(this._minimumGetter());
          } else if (!meetsTheMaximum(value)) {
            this._relatedPropertySetter(this._maximumGetter());
          }
        }
        this._inputElement.value = `${toFixed(this._relatedPropertyGetter())}`;
      });
      this._inputElement.addEventListener("keydown", (event) => {
        if (event.repeat) {
          return;
        }
        if (event.key === "Enter") {
          this._inputElement.blur();
        }
        event.stopPropagation();
      });
      return this._editElement;
    }
    subscribeToMachinesAmount() {
      this._nodeConfig.addEventListener(
        NodeConfiguration.machinesAmountChangedEvent,
        this.updateInputValue.bind(this)
      );
      return this;
    }
    subscribeToOverclock() {
      this._nodeConfig.addEventListener(
        NodeConfiguration.overclockChangedEvent,
        this.updateInputValue.bind(this)
      );
      return this;
    }
    setMinimum(minimumGetter) {
      this._minimumGetter = minimumGetter;
      return this;
    }
    setMaximum(maximumGetter) {
      this._maximumGetter = maximumGetter;
      return this;
    }
    setRelatedProperty(getter, setter) {
      this._relatedPropertyGetter = getter;
      this._relatedPropertySetter = setter;
      return this;
    }
    setInitialValue(initialValue) {
      this._inputElement.value = `${initialValue}`;
      return this;
    }
    setUnits(units) {
      this._unitsElement.innerText = units;
      return this;
    }
    setIconImage(name, iconPath) {
      let icon = document.createElement("img");
      icon.src = satisfactoryIconPath(iconPath);
      icon.alt = name;
      this._iconContainer.title = name;
      this._iconContainer.appendChild(icon);
      return this;
    }
    setPowerSvgIcon() {
      let icon = SvgIcons.createIcon("power");
      this._iconContainer.title = "Power consumption";
      this._iconContainer.appendChild(icon);
      return this;
    }
    updateInputValue() {
      if (this._relatedPropertyGetter == void 0) {
        throw Error("Configurator builder can't build without required fields");
      }
      if (!Object.is(document.activeElement, this._inputElement)) {
        let toFixed = _ConfiguratorBuilder.configuratorToFixed;
        this._inputElement.value = `${toFixed(this._relatedPropertyGetter())}`;
      }
    }
    static configuratorToFixed(value) {
      return +value.toFixed(4);
    }
    static numberParser(str) {
      let value1 = +str;
      let value2 = Number.parseFloat(str);
      if (Number.isNaN(value1) || Number.isNaN(value2)) {
        return void 0;
      }
      return value1;
    }
    _nodeConfig;
    _editElement;
    _iconContainer;
    _inputElement;
    _unitsElement;
    _minimumGetter;
    _maximumGetter;
    _relatedPropertyGetter;
    _relatedPropertySetter;
  };

  // src/Sankey/NodeConfiguration/NodeConfiguration.ts
  var NodeConfiguration = class _NodeConfiguration extends EventTarget {
    static machinesAmountChangedEvent = "machines-amount-changed";
    static overclockChangedEvent = "overclock-changed";
    static configurationUpdatedEvent = "configuration-updated";
    constructor(recipe, machine) {
      super();
      let closeSelector = `#${_NodeConfiguration._modalContainer.id} .title-row .close`;
      let closeButton = document.querySelector(closeSelector);
      closeButton.addEventListener("click", () => {
        if (this._isOpened) {
          this.closeConfigurationWindow();
        }
      });
      window.addEventListener("keydown", (event) => {
        if (this._isOpened && event.code === "Escape") {
          event.preventDefault();
          this.closeConfigurationWindow();
        }
        if (event.key === "Enter") {
          this.confirmConfiguration();
        }
        event.stopPropagation();
      });
      this.setupTableElements(recipe, machine);
      let updateResetButton = () => {
        if (this._isOpened) {
          if (this.machinesAmount !== this._openingMachinesAmount || this.overclockRatio !== this._openingOverclockRatio) {
            _NodeConfiguration._restoreButton.classList.remove("disabled");
          } else {
            _NodeConfiguration._restoreButton.classList.add("disabled");
          }
        }
      };
      this.addEventListener(_NodeConfiguration.machinesAmountChangedEvent, updateResetButton);
      this.addEventListener(_NodeConfiguration.overclockChangedEvent, updateResetButton);
      _NodeConfiguration._restoreButton.addEventListener("click", () => {
        if (this._isOpened) {
          this.machinesAmount = this._openingMachinesAmount;
          this.overclockRatio = this._openingOverclockRatio;
        }
      });
      _NodeConfiguration._applyButton.addEventListener("click", () => {
        if (this._isOpened) {
          this.confirmConfiguration();
        }
      });
    }
    openConfigurationWindow(openingMachinesAmount, openingOverclockRatio) {
      this._openingMachinesAmount = openingMachinesAmount;
      this._openingOverclockRatio = openingOverclockRatio;
      this.machinesAmount = this._openingMachinesAmount;
      this.overclockRatio = this._openingOverclockRatio;
      _NodeConfiguration._machinesColumn.appendChild(this._machineConfigurator);
      for (const configurator of this._amountConfigurators.inputsConfigurators) {
        _NodeConfiguration._amountInputsColumn.appendChild(configurator);
      }
      for (const configurator of this._amountConfigurators.outputsConfigurators) {
        _NodeConfiguration._amountOutputsColumn.appendChild(configurator);
      }
      _NodeConfiguration._amountPowerColumn.appendChild(
        this._amountConfigurators.powerConfigurator
      );
      _NodeConfiguration._multipliersColumn.appendChild(this._overclockConfigurator);
      for (const configurator of this._overclockConfigurators.inputsConfigurators) {
        _NodeConfiguration._overclockInputsColumn.appendChild(configurator);
      }
      for (const configurator of this._overclockConfigurators.outputsConfigurators) {
        _NodeConfiguration._overclockOutputsColumn.appendChild(configurator);
      }
      _NodeConfiguration._overclockPowerColumn.appendChild(
        this._overclockConfigurators.powerConfigurator
      );
      _NodeConfiguration._restoreButton.classList.add("disabled");
      _NodeConfiguration._modalContainer.classList.remove("hidden");
      this._isOpened = true;
    }
    closeConfigurationWindow() {
      this._machineConfigurator.remove();
      this._overclockConfigurator.remove();
      this._amountConfigurators.removeFromDom();
      this._overclockConfigurators.removeFromDom();
      _NodeConfiguration._modalContainer.classList.add("hidden");
      this._isOpened = false;
    }
    confirmConfiguration() {
      this.dispatchEvent(new Event(_NodeConfiguration.configurationUpdatedEvent));
      this.closeConfigurationWindow();
    }
    setupTableElements(recipe, machine) {
      let minOverclockRatio = _NodeConfiguration._minOverclockRatio;
      let maxOverclockRatio = _NodeConfiguration._maxOverclockRatio;
      this._machineConfigurator = new ConfiguratorBuilder(this).setIconImage(machine.displayName, machine.iconPath).setInitialValue(1).setUnits("").setMinimum(() => 1e-4).setMaximum(() => void 0).setRelatedProperty(
        () => this.machinesAmount,
        (value) => this.machinesAmount = value
      ).subscribeToMachinesAmount().build();
      this._overclockConfigurator = new ConfiguratorBuilder(this).setIconImage("Overclock", "Resource/Environment/Crystal/PowerShard.png").setInitialValue(100).setUnits("%").setMinimum(() => minOverclockRatio * 100).setMaximum(() => maxOverclockRatio * 100).setRelatedProperty(
        () => this.overclockRatio * 100,
        (value) => this.overclockRatio = value / 100
      ).subscribeToOverclock().build();
      let createResourceConfigurators = (resource, amountConfigurators, overclockConfigurators) => {
        let resourceDesc = Satisfactory_default.resources.find(
          // I specify type because deploy fails otherwise for some reason.
          (resourceData) => {
            return resourceData.id == resource.id;
          }
        );
        if (resourceDesc == void 0) {
          throw Error(`Couldn't find resource descriptor for "${resource.id}"`);
        }
        let itemsInMinute = toItemsInMinute(resource.amount, recipe.manufacturingDuration);
        let amountConfigurator = new ConfiguratorBuilder(this).setIconImage(resourceDesc.displayName, resourceDesc.iconPath).setInitialValue(itemsInMinute).setUnits("/min").setMinimum(() => 1e-4).setMaximum(() => void 0).setRelatedProperty(
          () => itemsInMinute * this.overclockRatio * this.machinesAmount,
          (value) => this.machinesAmount = value / itemsInMinute / this.overclockRatio
        ).subscribeToMachinesAmount().subscribeToOverclock().build();
        let overclockConfigurator = new ConfiguratorBuilder(this).setIconImage(resourceDesc.displayName, resourceDesc.iconPath).setInitialValue(itemsInMinute).setUnits("/min").setMinimum(() => itemsInMinute * minOverclockRatio).setMaximum(() => itemsInMinute * maxOverclockRatio).setRelatedProperty(
          () => itemsInMinute * this.overclockRatio,
          (value) => this.overclockRatio = value / itemsInMinute
        ).subscribeToOverclock().build();
        amountConfigurators.push(amountConfigurator);
        overclockConfigurators.push(overclockConfigurator);
      };
      recipe.ingredients.forEach((resource) => createResourceConfigurators(
        resource,
        this._amountConfigurators.inputsConfigurators,
        this._overclockConfigurators.inputsConfigurators
      ));
      recipe.products.forEach((resource) => createResourceConfigurators(
        resource,
        this._amountConfigurators.outputsConfigurators,
        this._overclockConfigurators.outputsConfigurators
      ));
      let overclockedPower = (power, overclockRatio) => {
        return overclockPower(power, overclockRatio, machine.powerConsumptionExponent);
      };
      let overclockFromPower = (power) => {
        return Math.pow(power / machine.powerConsumption, 1 / machine.powerConsumptionExponent);
      };
      let getInitialOverclockedPower = () => {
        return overclockedPower(machine.powerConsumption, this.overclockRatio);
      };
      this._amountConfigurators.powerConfigurator = new ConfiguratorBuilder(this).setPowerSvgIcon().setInitialValue(machine.powerConsumption).setUnits("MW").setMinimum(() => 1e-4).setMaximum(() => void 0).setRelatedProperty(
        () => getInitialOverclockedPower() * this.machinesAmount,
        (value) => this.machinesAmount = value / getInitialOverclockedPower()
      ).subscribeToMachinesAmount().subscribeToOverclock().build();
      this._overclockConfigurators.powerConfigurator = new ConfiguratorBuilder(this).setPowerSvgIcon().setInitialValue(machine.powerConsumption).setUnits("MW").setMinimum(() => overclockedPower(machine.powerConsumption, minOverclockRatio)).setMaximum(() => overclockedPower(machine.powerConsumption, maxOverclockRatio)).setRelatedProperty(
        () => overclockedPower(machine.powerConsumption, this.overclockRatio),
        (value) => this.overclockRatio = overclockFromPower(value)
      ).subscribeToOverclock().build();
    }
    get machinesAmount() {
      return this._machinesAmount;
    }
    set machinesAmount(value) {
      if (value !== this._machinesAmount) {
        this._machinesAmount = value;
        this.dispatchEvent(new Event(_NodeConfiguration.machinesAmountChangedEvent));
      }
    }
    get overclockRatio() {
      return this._overclockRatio;
    }
    set overclockRatio(value) {
      if (value !== this._overclockRatio) {
        let min = _NodeConfiguration._minOverclockRatio;
        let max = _NodeConfiguration._maxOverclockRatio;
        value = Math.min(max, Math.max(min, value));
        this._overclockRatio = value;
        this.dispatchEvent(new Event(_NodeConfiguration.overclockChangedEvent));
      }
    }
    static queryModalSuccessor(query) {
      let fullQuery = `#${_NodeConfiguration._modalContainer.id} ${query}`;
      let element = document.querySelector(fullQuery);
      if (element == null) {
        throw Error(`Couldn't find required element: ${fullQuery}`);
      }
      return element;
    }
    static getColumn(group, column) {
      let query = `.table.${group}>.column.${column}`;
      return _NodeConfiguration.queryModalSuccessor(query);
    }
    _isOpened = false;
    _machinesAmount = 1;
    _overclockRatio = 1;
    _openingMachinesAmount = this._machinesAmount;
    _openingOverclockRatio = this._overclockRatio;
    _machineConfigurator;
    _overclockConfigurator;
    _amountConfigurators = new Configurators();
    _overclockConfigurators = new Configurators();
    static _minOverclockRatio = 0.01;
    static _maxOverclockRatio = 2.5;
    static _modalContainer = document.querySelector("#machine-configuration-container");
    static _machinesColumn = _NodeConfiguration.getColumn("amount", "machines");
    static _amountInputsColumn = _NodeConfiguration.getColumn("amount", "inputs");
    static _amountOutputsColumn = _NodeConfiguration.getColumn("amount", "outputs");
    static _amountPowerColumn = _NodeConfiguration.getColumn("amount", "power");
    static _multipliersColumn = _NodeConfiguration.getColumn("overclock", "multipliers");
    static _overclockInputsColumn = _NodeConfiguration.getColumn("overclock", "inputs");
    static _overclockOutputsColumn = _NodeConfiguration.getColumn("overclock", "outputs");
    static _overclockPowerColumn = _NodeConfiguration.getColumn("overclock", "power");
    static _restoreButton = _NodeConfiguration.queryModalSuccessor(".restore-button");
    static _applyButton = _NodeConfiguration.queryModalSuccessor(".apply-button");
  };

  // src/Sankey/NodeResourceDisplay.ts
  var NodeResourceDisplay = class {
    constructor(associatedNode, recipe, machine) {
      this._recipe = recipe;
      this._machine = machine;
      this._displayContainer = SvgFactory.createSvgForeignObject();
      let recipeContainer = this.createHtmlElement("div", "recipe-container");
      this.createMachineDisplay(recipeContainer, machine);
      this.createOverclockDisplay(recipeContainer);
      this.createInputsDisplay(recipeContainer, recipe);
      this.createOutputsDisplay(recipeContainer, recipe);
      this.createPowerDisplay(recipeContainer, machine.powerConsumption);
      this._displayContainer.appendChild(recipeContainer);
      associatedNode.addEventListener(SankeyNode.resourcesAmountChangedEvent, () => {
        this.updateDisplays(associatedNode);
      });
    }
    setBounds(bounds) {
      this._displayContainer.setAttribute("x", `${bounds.x}`);
      this._displayContainer.setAttribute("y", `${bounds.y}`);
      this._displayContainer.setAttribute("width", `${bounds.width}`);
      this._displayContainer.setAttribute("height", `${bounds.height}`);
    }
    appendTo(element) {
      element.appendChild(this._displayContainer);
    }
    createMachineDisplay(parent, machine) {
      let machineDisplay = this.createHtmlElement("div", "property");
      let title = this.createHtmlElement("div", "title");
      title.innerText = "Machines";
      machineDisplay.appendChild(title);
      this._machinesAmountDisplay = this.createAmountDisplay(
        machineDisplay,
        machine.displayName,
        1,
        machine.iconPath
      );
      parent.appendChild(machineDisplay);
    }
    createInputsDisplay(parent, recipe) {
      let inputsDisplay = this.createHtmlElement("div", "property");
      let title = this.createHtmlElement("div", "title");
      title.innerText = "Input/min";
      inputsDisplay.appendChild(title);
      recipe.ingredients.forEach((resource) => {
        this._inputDisplays.push({
          htmlElement: this.createResourceDisplay(inputsDisplay, resource),
          initialAmount: resource.amount
        });
      });
      parent.appendChild(inputsDisplay);
    }
    createOutputsDisplay(parent, recipe) {
      let outputsDisplay = this.createHtmlElement("div", "property");
      let title = this.createHtmlElement("div", "title");
      title.innerText = "Output/min";
      outputsDisplay.appendChild(title);
      recipe.products.forEach((resource) => {
        this._outputDisplays.push({
          htmlElement: this.createResourceDisplay(outputsDisplay, resource),
          initialAmount: resource.amount
        });
      });
      parent.appendChild(outputsDisplay);
    }
    createPowerDisplay(parent, powerConsumption) {
      let powerDisplay = this.createHtmlElement("div", "property");
      let title = this.createHtmlElement("div", "title");
      title.innerText = "Power";
      this._powerDisplay = this.createHtmlElement("div", "text");
      this._powerDisplay.innerText = `${powerConsumption} MW`;
      powerDisplay.appendChild(title);
      powerDisplay.appendChild(this._powerDisplay);
      parent.appendChild(powerDisplay);
    }
    createOverclockDisplay(parent) {
      let overclockDisplay = this.createHtmlElement("div", "property");
      let title = this.createHtmlElement("div", "title");
      title.innerText = "Overclock";
      this._overclockDisplay = this.createHtmlElement("div", "text");
      this._overclockDisplay.innerText = `100%`;
      overclockDisplay.appendChild(title);
      overclockDisplay.appendChild(this._overclockDisplay);
      parent.appendChild(overclockDisplay);
    }
    createResourceDisplay(parentDiv, recipeResource) {
      let resource = Satisfactory_default.resources.find(
        (el) => {
          return el.id === recipeResource.id;
        }
      );
      if (resource == void 0) {
        throw Error(`Couldn't find resource ${recipeResource.id}`);
      }
      let amountInMinute = +this.toItemsInMinute(recipeResource.amount).toFixed(4);
      return this.createAmountDisplay(parentDiv, resource.displayName, amountInMinute, resource.iconPath);
    }
    createAmountDisplay(parentDiv, name, amount, iconPath) {
      let resourceDiv = document.createElement("div");
      resourceDiv.classList.add("resource");
      let icon = this.createHtmlElement("img", "icon");
      icon.loading = "lazy";
      icon.src = satisfactoryIconPath(iconPath);
      icon.title = name;
      icon.alt = name;
      let amountText = this.createHtmlElement("p", "amount");
      amountText.classList.add("amount");
      amountText.innerText = `${amount}`;
      resourceDiv.appendChild(icon);
      resourceDiv.appendChild(amountText);
      parentDiv.appendChild(resourceDiv);
      return amountText;
    }
    toItemsInMinute(amount) {
      return toItemsInMinute(amount, this._recipe.manufacturingDuration);
    }
    createHtmlElement(tag, ...classes) {
      let element = document.createElement(tag);
      element.classList.add(...classes);
      return element;
    }
    updateDisplays(associatedNode) {
      let toFixed = (value) => +value.toFixed(2);
      this._machinesAmountDisplay.innerText = `${toFixed(associatedNode.machinesAmount)}`;
      this._overclockDisplay.innerText = `${toFixed(associatedNode.overclockRatio * 100)}%`;
      for (const inputDisplay of this._inputDisplays) {
        let amount = inputDisplay.initialAmount * associatedNode.overclockRatio * associatedNode.machinesAmount;
        inputDisplay.htmlElement.innerText = `${toFixed(this.toItemsInMinute(amount))}`;
      }
      for (const outputDisplay of this._outputDisplays) {
        let amount = outputDisplay.initialAmount * associatedNode.overclockRatio * associatedNode.machinesAmount;
        outputDisplay.htmlElement.innerText = `${toFixed(this.toItemsInMinute(amount))}`;
      }
      let overclockedPower = overclockPower(
        this._machine.powerConsumption,
        associatedNode.overclockRatio,
        this._machine.powerConsumptionExponent
      );
      this._powerDisplay.innerText = `${toFixed(overclockedPower * associatedNode.machinesAmount)} MW`;
    }
    _recipe;
    _machine;
    _displayContainer;
    _machinesAmountDisplay;
    _overclockDisplay;
    _inputDisplays = [];
    _outputDisplays = [];
    _powerDisplay;
  };

  // src/Sankey/SankeyNode.ts
  var SankeyNode = class _SankeyNode extends EventTarget {
    static resourcesAmountChangedEvent = "resources-amount-changed";
    static changedVacantResourcesAmountEvent = "changed-vacant-resources-amount";
    static deletionEvent = "deleted";
    nodeSvg;
    nodeSvgGroup;
    static nodeWidth = 70;
    constructor(parentGroup, position, recipe, machine) {
      super();
      this._recipe = { ...recipe };
      this._height = _SankeyNode._nodeHeight;
      let sumResources = (sum, product) => sum + this.toItemsInMinute(product.amount);
      this._inputResourcesAmount = this._recipe.ingredients.reduce(sumResources, 0);
      this._outputResourcesAmount = this._recipe.products.reduce(sumResources, 0);
      this.nodeSvgGroup = SvgFactory.createSvgGroup({
        x: position.x - _SankeyNode.nodeWidth / 2 - SankeySlot.slotWidth,
        y: position.y - this.height / 2
      }, "node", "animate-appearance");
      this.nodeSvg = SvgFactory.createSvgRect({
        width: _SankeyNode.nodeWidth,
        height: this.height,
        x: SankeySlot.slotWidth,
        y: 0
      }, "machine");
      this._inputSlotGroups = this.createGroups("input", recipe.ingredients);
      this._outputSlotGroups = this.createGroups("output", recipe.products);
      this.configureContextMenu(recipe, machine);
      this._resourceDisplay = new NodeResourceDisplay(this, recipe, machine);
      this._resourceDisplay.setBounds({
        x: 10,
        y: 0,
        width: _SankeyNode.nodeWidth,
        height: this.height
      });
      this.nodeSvgGroup.appendChild(this.nodeSvg);
      this._resourceDisplay.appendTo(this.nodeSvgGroup);
      parentGroup.appendChild(this.nodeSvgGroup);
    }
    delete() {
      for (const slotsGroup of this._inputSlotGroups) {
        slotsGroup.delete();
      }
      for (const slotsGroup of this._outputSlotGroups) {
        slotsGroup.delete();
      }
      this.nodeSvgGroup.remove();
      this.dispatchEvent(new Event(_SankeyNode.deletionEvent));
    }
    get position() {
      let transform = this.nodeSvgGroup.getAttribute("transform") ?? "translate(0, 0)";
      let transformRegex = /translate\((?<x>-?\d+(?:\.\d+)?), ?(?<y>-?\d+(?:\.\d+)?)\)/;
      let match = transformRegex.exec(transform);
      let { x, y } = match.groups;
      return { x: +x, y: +y };
    }
    set position(position) {
      this.nodeSvgGroup.setAttribute("transform", `translate(${position.x}, ${position.y})`);
      for (const group of this._inputSlotGroups) {
        group.dispatchEvent(new Event(SlotsGroup.boundsChangedEvent));
      }
      for (const group of this._outputSlotGroups) {
        group.dispatchEvent(new Event(SlotsGroup.boundsChangedEvent));
      }
    }
    get height() {
      return this._height;
    }
    get missingResources() {
      let result = [];
      for (const slotsGroup of this._inputSlotGroups) {
        let amount = slotsGroup.vacantResourcesAmount;
        if (amount > 0) {
          result.push({ amount, id: slotsGroup.resourceId });
        }
      }
      return result;
    }
    get exceedingResources() {
      let result = [];
      for (const slotsGroup of this._outputSlotGroups) {
        let amount = slotsGroup.vacantResourcesAmount;
        if (amount > 0) {
          result.push({ amount, id: slotsGroup.resourceId });
        }
      }
      return result;
    }
    get inputResourcesAmount() {
      return this._inputResourcesAmount;
    }
    set inputResourcesAmount(inputResourcesAmount) {
      this._inputResourcesAmount = inputResourcesAmount;
      this.dispatchEvent(new Event(_SankeyNode.resourcesAmountChangedEvent));
    }
    get outputResourcesAmount() {
      return this._outputResourcesAmount;
    }
    set outputResourcesAmount(outputResourcesAmount) {
      this._outputResourcesAmount = outputResourcesAmount;
      this.dispatchEvent(new Event(_SankeyNode.resourcesAmountChangedEvent));
    }
    configureContextMenu(recipe, machine) {
      let nodeContextMenu = new NodeContextMenu(this.nodeSvg);
      nodeContextMenu.addEventListener(NodeContextMenu.deleteNodeOptionClickedEvent, () => {
        this.delete();
      });
      let configurator = new NodeConfiguration(recipe, machine);
      let openConfigurator = (event) => {
        configurator.openConfigurationWindow(this.machinesAmount, this.overclockRatio);
        event.stopPropagation();
      };
      nodeContextMenu.addEventListener(NodeContextMenu.configureNodeOptionClickedEvent, openConfigurator);
      this.nodeSvg.addEventListener("dblclick", openConfigurator);
      configurator.addEventListener(NodeConfiguration.configurationUpdatedEvent, () => {
        this.machinesAmount = configurator.machinesAmount;
        this.overclockRatio = configurator.overclockRatio;
      });
    }
    createGroups(type, resources) {
      let result = [];
      let nextGroupY = 0;
      for (const resource of resources) {
        let newGroup = new SlotsGroup(
          this,
          type,
          { id: resource.id, amount: this.toItemsInMinute(resource.amount) },
          nextGroupY
        );
        result.push(newGroup);
        nextGroupY += newGroup.height;
        newGroup.addEventListener(
          SlotsGroup.changedVacantResourcesAmountEvent,
          () => this.dispatchEvent(new Event(_SankeyNode.changedVacantResourcesAmountEvent))
        );
      }
      return result;
    }
    toItemsInMinute(amount) {
      return toItemsInMinute(amount, this._recipe.manufacturingDuration);
    }
    multiplyResourcesAmount(multiplier) {
      this.inputResourcesAmount *= multiplier;
      this.outputResourcesAmount *= multiplier;
      for (const slotsGroup of this._inputSlotGroups) {
        slotsGroup.resourcesAmount *= multiplier;
      }
      for (const slotsGroup of this._outputSlotGroups) {
        slotsGroup.resourcesAmount *= multiplier;
      }
    }
    get machinesAmount() {
      return this._machinesAmount;
    }
    set machinesAmount(value) {
      let difference = value / this._machinesAmount;
      this._machinesAmount = value;
      this.multiplyResourcesAmount(difference);
    }
    get overclockRatio() {
      return this._overclockRatio;
    }
    set overclockRatio(value) {
      let difference = value / this._overclockRatio;
      this._overclockRatio = value;
      this.multiplyResourcesAmount(difference);
    }
    _recipe;
    _inputResourcesAmount;
    _outputResourcesAmount;
    _machinesAmount = 1;
    _overclockRatio = 1;
    _height;
    _inputSlotGroups = [];
    _outputSlotGroups = [];
    _resourceDisplay;
    static _nodeHeight = 280;
  };

  // src/GameData/GameRecipe.ts
  var GameRecipeEvent = class extends Event {
    recipe;
    machine;
    constructor(recipe, machine, type, eventInitDict) {
      super(type, eventInitDict);
      this.recipe = recipe;
      this.machine = machine;
    }
  };

  // src/Settings.ts
  var Settings = class _Settings extends EventTarget {
    static isCanvasLockedChangedEvent = "canvas-locked-changed";
    static get instance() {
      return this._instance;
    }
    get isCanvasLocked() {
      return this._isCanvasLocked;
    }
    set isCanvasLocked(canvasLocked) {
      if (canvasLocked) {
        PanZoomConfiguration.context.pause();
      } else {
        PanZoomConfiguration.context.resume();
      }
      this._isCanvasLocked = canvasLocked;
      this.dispatchEvent(new Event(_Settings.isCanvasLockedChangedEvent));
    }
    constructor() {
      super();
    }
    static _instance = new _Settings();
    _isCanvasLocked = false;
  };

  // src/ContextMenu/CanvasContextMenu.ts
  var CanvasContextMenu = class _CanvasContextMenu extends CustomContextMenu {
    static createNodeOptionClickedEvent = "create-node-option-clicked";
    static lockCanvasSwitchClickedEvent = "lock-canvas-switch-clicked";
    constructor(ownerNode) {
      super(ownerNode, "canvas");
      this._lockCanvasSwitch = document.querySelector(`#${this.containerId} #lock-canvas-switch`);
      this._createNodeOption = document.querySelector(`#${this.containerId} #create-node-option`);
      this.setupMenuOption(this._createNodeOption, _CanvasContextMenu.createNodeOptionClickedEvent);
      this.setupMenuOption(this._lockCanvasSwitch, _CanvasContextMenu.lockCanvasSwitchClickedEvent);
    }
    setCanvasLockedSwitchState(enabled) {
      CustomContextMenu.setSwitchState(this._lockCanvasSwitch, enabled);
    }
    _lockCanvasSwitch;
    _createNodeOption;
  };

  // src/ResourcesSummary.ts
  var ResourcesSummary = class _ResourcesSummary {
    constructor() {
      _ResourcesSummary._collapseButton.addEventListener("click", () => {
        if (this._isCollapsed) {
          this.open();
        } else {
          this.close();
        }
      });
      this.recalculateInputs();
      this.recalculateOutputs();
    }
    registerNode(node) {
      this._nodes.push(node);
      this.recalculateInputs();
      this.recalculateOutputs();
      node.addEventListener(SankeyNode.changedVacantResourcesAmountEvent, () => {
        this.recalculateInputs();
        this.recalculateOutputs();
      });
      node.addEventListener(SankeyNode.deletionEvent, () => {
        let index = this._nodes.findIndex((registeredNode) => Object.is(node, registeredNode));
        this._nodes.splice(index, 1);
        this.recalculateInputs();
        this.recalculateOutputs();
      });
    }
    recalculateInputs() {
      let resources = /* @__PURE__ */ new Map();
      for (const node of this._nodes) {
        for (const resource of node.missingResources) {
          resources.set(resource.id, (resources.get(resource.id) ?? 0) + resource.amount);
        }
      }
      this.recalculate(_ResourcesSummary._inputsColumn, resources);
    }
    recalculateOutputs() {
      let resources = /* @__PURE__ */ new Map();
      for (const node of this._nodes) {
        for (const resource of node.exceedingResources) {
          resources.set(resource.id, (resources.get(resource.id) ?? 0) + resource.amount);
        }
      }
      this.recalculate(_ResourcesSummary._outputsColumn, resources);
    }
    recalculate(column, resources) {
      column.querySelectorAll(".resource").forEach((resource) => {
        resource.remove();
      });
      let isAnyAdded = false;
      for (const [id, amount] of resources) {
        column.appendChild(this.createResourceDisplay(id, amount));
        isAnyAdded = true;
      }
      if (!isAnyAdded) {
        let noneText = document.createElement("div");
        noneText.classList.add("resource", "none");
        noneText.innerText = "None";
        column.appendChild(noneText);
      }
      if (this._isCollapsed) {
        _ResourcesSummary.setCollapsingAnimationEnabled(false);
        this.hideContent();
        _ResourcesSummary.setCollapsingAnimationEnabled(true);
      }
    }
    open() {
      _ResourcesSummary._summaryContainer.classList.remove("collapsed");
      _ResourcesSummary._summaryContainer.style.top = "0";
      this._isCollapsed = false;
    }
    close() {
      _ResourcesSummary._summaryContainer.classList.add("collapsed");
      this.hideContent();
      this._isCollapsed = true;
    }
    hideContent() {
      let contentHeight = _ResourcesSummary.querySuccessor(".content").clientHeight;
      _ResourcesSummary._summaryContainer.style.top = `${-contentHeight}px`;
    }
    createResourceDisplay(id, amount) {
      let resource = Satisfactory_default.resources.find(
        // I specify type because deploy fails otherwise for some reason.
        (resource2) => {
          return resource2.id == id;
        }
      );
      if (resource == void 0) {
        throw Error(`Couldn't find resource ${id}`);
      }
      let resourceDisplay = document.createElement("div");
      resourceDisplay.classList.add("resource");
      let icon = document.createElement("img");
      icon.classList.add("icon");
      icon.src = satisfactoryIconPath(resource.iconPath);
      icon.title = resource.displayName;
      icon.alt = resource.displayName;
      let amountDisplay = document.createElement("div");
      amountDisplay.classList.add("amount");
      amountDisplay.innerText = `${amount}`;
      resourceDisplay.appendChild(icon);
      resourceDisplay.appendChild(amountDisplay);
      return resourceDisplay;
    }
    static querySuccessor(query) {
      let element = _ResourcesSummary._summaryContainer.querySelector(`${query}`);
      if (element == null) {
        throw Error(`Couldn't find required element: ${query} of summary container`);
      }
      return element;
    }
    static setCollapsingAnimationEnabled(enabled) {
      if (enabled) {
        this._summaryContainer.classList.add("animate-collapsing");
      } else {
        this._summaryContainer.classList.remove("animate-collapsing");
      }
    }
    _isCollapsed = false;
    _nodes = [];
    static _summaryContainer = document.querySelector("#resources-summary");
    static _inputsColumn = _ResourcesSummary.querySuccessor(".column.inputs");
    static _outputsColumn = _ResourcesSummary.querySuccessor(".column.outputs");
    static _collapseButton = _ResourcesSummary.querySuccessor(".collapse-button");
  };

  // src/HelpWindow/HelpPlaceholders.ts
  var HelpPlaceholders = class {
    static parsePlaceholder(text) {
      let nodes = [];
      let parsingTag;
      let parsingStartIndex = 0;
      let pushText = (text2) => {
        if (text2 != "") {
          nodes.push(document.createTextNode(text2));
        }
      };
      for (let i = 0; i < text.length; ++i) {
        let currentSymbol = text[i];
        if (this._tagsMap.has(currentSymbol)) {
          if (parsingTag == void 0) {
            pushText(text.slice(parsingStartIndex, i));
            parsingTag = currentSymbol;
            parsingStartIndex = i + 1;
          } else if (parsingTag === currentSymbol) {
            let innerContent = text.slice(parsingStartIndex, i);
            let action = this._tagsMap.get(currentSymbol);
            nodes.push(action(innerContent));
            parsingTag = void 0;
            parsingStartIndex = i + 1;
          }
        }
      }
      pushText(text.slice(parsingStartIndex));
      return nodes;
    }
    static createControls(content) {
      let cell = document.createElement("td");
      let controls = document.createElement("div");
      controls.classList.add("controls");
      controls.append(...this.parsePlaceholder(content));
      cell.appendChild(controls);
      return cell;
    }
    static createButton(content) {
      let buttonTip = document.createElement("div");
      buttonTip.classList.add("button-tip");
      buttonTip.append(...this.parsePlaceholder(content));
      return buttonTip;
    }
    static createIcon(content) {
      return SvgIcons.createIcon(content);
    }
    static createDescription(content) {
      let cell = document.createElement("td");
      cell.innerText = content;
      return cell;
    }
    static _tagsMap = /* @__PURE__ */ new Map([
      ["$", this.createControls.bind(this)],
      ["|", this.createButton.bind(this)],
      ["%", this.createIcon.bind(this)],
      ["=", this.createDescription.bind(this)]
    ]);
  };

  // src/HelpWindow/HelpModal.ts
  var HelpModal = class _HelpModal {
    constructor() {
      this.replaceHelpPlaceholders();
      _HelpModal._openModalButton.addEventListener("click", (event) => {
        if (!this._isOpened) {
          event.stopPropagation();
          this.openModal();
        }
      });
      _HelpModal._closeButton.addEventListener("click", (event) => {
        if (this._isOpened) {
          event.stopPropagation();
          this.closeModal();
        }
      });
      window.addEventListener("keydown", (event) => {
        if (event.code === "Escape" && this._isOpened) {
          event.stopPropagation();
          event.preventDefault();
          this.closeModal();
        }
      });
    }
    openModal() {
      _HelpModal._modalContainer.classList.remove("hidden");
      this._isOpened = true;
    }
    closeModal() {
      _HelpModal._modalContainer.classList.add("hidden");
      this._isOpened = false;
    }
    replaceHelpPlaceholders() {
      let placeholders = document.querySelectorAll("tr.help-placeholder");
      for (const placeholder of placeholders) {
        this.replacePlaceholder(placeholder);
      }
    }
    replacePlaceholder(placeholderRow) {
      let td = placeholderRow.querySelector("td");
      td.remove();
      console.log(td.innerText);
      placeholderRow.append(...HelpPlaceholders.parsePlaceholder(td.innerText));
      placeholderRow.classList.remove("help-placeholder");
    }
    _isOpened = false;
    static _modalContainer = document.querySelector("#help-modal-container");
    static _closeButton = this._modalContainer.querySelector(".title-row .close");
    static _openModalButton = document.querySelector("#open-help");
  };

  // src/main.ts
  async function main() {
    SvgIcons.replaceAllPlaceholders();
    let viewport = document.querySelector("#viewport");
    let nodesGroup = document.querySelector("g.nodes");
    let linksGroup = document.querySelector("g.links");
    let zoomRatioDisplay = document.querySelector("p#ratio-display");
    let canvas = document.querySelector("#canvas");
    if (viewport == null || nodesGroup == null || linksGroup == null) {
      throw new Error("Svg container is broken");
    }
    let _helpModal = new HelpModal();
    PanZoomConfiguration.setPanningButtons(["Space"], ["Meta"]);
    PanZoomConfiguration.setZoomingButtons([], ["Control"]);
    PanZoomConfiguration.configurePanContext(viewport, canvas);
    PanZoomConfiguration.context.on("zoom", () => {
      let zoomScale = PanZoomConfiguration.context.getTransform()?.scale ?? 1;
      zoomRatioDisplay.textContent = `Zoom: ${zoomScale.toFixed(2)}x`;
    });
    let resourcesSummary = new ResourcesSummary();
    let nodeCreationPosition;
    function createNode(recipe, machine) {
      const node = new SankeyNode(nodesGroup, nodeCreationPosition, recipe, machine);
      node.nodeSvg.onmousedown = (event) => {
        if (event.buttons === 1 && !PanZoomConfiguration.isPanning && !PanZoomConfiguration.isZooming) {
          MouseHandler.getInstance().startDraggingNode(event, node);
        }
      };
      resourcesSummary.registerNode(node);
    }
    ;
    function openNodeCreation(nodePosition) {
      let pageCenter = {
        x: document.documentElement.clientWidth / 2,
        y: document.documentElement.clientHeight / 2
      };
      nodeCreationPosition = nodePosition ?? MouseHandler.clientToCanvasPosition(pageCenter);
      nodeCreationContainer?.classList.remove("hidden");
    }
    document.querySelector("div.button#create-node").onclick = () => {
      openNodeCreation();
    };
    document.querySelector("div.button#cancel-linking").onclick = () => {
      MouseHandler.getInstance().cancelConnectingSlots();
    };
    let lockButton = document.querySelector("div.button#lock-viewport");
    let unlockedIcon = document.querySelector("div.button#lock-viewport>svg.unlocked");
    let lockedIcon = document.querySelector("div.button#lock-viewport>svg.locked");
    lockButton.onclick = () => {
      Settings.instance.isCanvasLocked = !Settings.instance.isCanvasLocked;
    };
    Settings.instance.addEventListener(Settings.isCanvasLockedChangedEvent, () => {
      if (Settings.instance.isCanvasLocked) {
        unlockedIcon.classList.add("hidden");
        lockedIcon.classList.remove("hidden");
      } else {
        unlockedIcon.classList.remove("hidden");
        lockedIcon.classList.add("hidden");
      }
    });
    window.addEventListener("keydown", (event) => {
      if (event.repeat) {
        return;
      }
      if (event.key === "Escape") {
        event.preventDefault();
        MouseHandler.getInstance().cancelConnectingSlots();
      }
    });
    let nodeCreationContainer = document.querySelector("div#node-creation-container");
    let canvasContextMenu = new CanvasContextMenu(canvas);
    canvasContextMenu.addEventListener(CanvasContextMenu.createNodeOptionClickedEvent, () => {
      let contextMenuPos = canvasContextMenu.openingPosition;
      if (contextMenuPos != void 0) {
        contextMenuPos = MouseHandler.clientToCanvasPosition(contextMenuPos);
      }
      openNodeCreation(contextMenuPos);
    });
    canvas.addEventListener("dblclick", (event) => {
      let nodePosition = { x: event.clientX, y: event.clientY };
      openNodeCreation(MouseHandler.clientToCanvasPosition(nodePosition));
    });
    canvasContextMenu.addEventListener(CanvasContextMenu.lockCanvasSwitchClickedEvent, () => {
      Settings.instance.isCanvasLocked = !Settings.instance.isCanvasLocked;
    });
    Settings.instance.addEventListener(Settings.isCanvasLockedChangedEvent, () => {
      canvasContextMenu.setCanvasLockedSwitchState(Settings.instance.isCanvasLocked);
    });
    window.addEventListener("keydown", (event) => {
      if (event.code === "Escape") {
        event.preventDefault();
        canvasContextMenu.closeMenu();
      }
    });
    window.addEventListener("keypress", (event) => {
      let anyModalOpened = false;
      document.querySelectorAll(".modal-window-container").forEach((modal) => {
        anyModalOpened ||= !modal.classList.contains("hidden");
      });
      if (event.code === "KeyN" && !canvasContextMenu.isMenuOpened && !anyModalOpened) {
        openNodeCreation();
      }
      if (event.code === "KeyL") {
        Settings.instance.isCanvasLocked = !Settings.instance.isCanvasLocked;
      }
    });
    window.addEventListener("keydown", (event) => {
      if (event.code === "Escape" && !nodeCreationContainer?.classList.contains("hidden")) {
        event.preventDefault();
        nodeCreationContainer?.classList.add("hidden");
      }
    });
    window.onmouseup = () => {
      MouseHandler.getInstance().handleMouseUp();
    };
    window.onmousemove = (event) => {
      MouseHandler.getInstance().handleMouseMove(event);
    };
    let nodeCreationClose = document.querySelector("div#node-creation-close");
    nodeCreationClose?.addEventListener("click", () => {
      nodeCreationContainer?.classList.add("hidden");
    });
    let tabSelectors = document.querySelector("div#tab-selectors");
    let recipeTabs = document.querySelector("div#recipe-tabs");
    let confirmRecipeButton = document.querySelector("div#confirm-recipe");
    let discardRecipeButton = document.querySelector("div#discard-recipe");
    let gameVersionText = nodeCreationContainer.querySelector("h2.title span.game-version");
    gameVersionText.innerText = `game version: ${Satisfactory_default.gameVersion}`;
    recipeTabs.addEventListener("click", () => {
      document.dispatchEvent(new GameRecipeEvent(void 0, void 0, "recipe-selected"));
    });
    discardRecipeButton.addEventListener("click", () => {
      document.dispatchEvent(new GameRecipeEvent(void 0, void 0, "recipe-selected"));
    });
    for (const machine of Satisfactory_default.machines) {
      let tabSelector = document.createElement("div");
      tabSelector.classList.add("tab-selector");
      tabSelector.title = machine.displayName;
      let machineIcon = document.createElement("img");
      machineIcon.classList.add("machine-icon");
      machineIcon.src = satisfactoryIconPath(machine.iconPath);
      machineIcon.alt = machine.displayName;
      machineIcon.loading = "lazy";
      let recipesTab = document.createElement("div");
      recipesTab.classList.add("recipes-tab");
      let createRecipesGroup = (name) => {
        let groupTitle = document.createElement("h3");
        groupTitle.classList.add("group-title");
        groupTitle.innerText = name;
        let groupDiv = document.createElement("div");
        groupDiv.classList.add("group");
        return { div: groupDiv, title: groupTitle };
      };
      let basicRecipesGroup = createRecipesGroup("Basic recipes");
      let alternateRecipesGroup = createRecipesGroup("Alternate recipes");
      let eventsRecipesGroup = createRecipesGroup("Events recipes");
      let createRecipeParser = (simpleRecipesGroup) => {
        return (recipe) => {
          let recipeNode = document.createElement("div");
          recipeNode.classList.add("recipe");
          recipeNode.title = recipe.displayName;
          let isEventRecipe = false;
          for (const product of recipe.products) {
            let itemIcon = document.createElement("img");
            itemIcon.classList.add("item-icon");
            let resource = Satisfactory_default.resources.find(
              // I specify type because deploy fails otherwise for some reason.
              (resource2) => {
                return resource2.id == product.id;
              }
            );
            if (resource != void 0) {
              itemIcon.src = satisfactoryIconPath(resource.iconPath);
              if (!isEventRecipe) {
                isEventRecipe = resource.iconPath.startsWith("Events");
              }
            }
            itemIcon.alt = recipe.displayName;
            itemIcon.loading = "lazy";
            recipeNode.appendChild(itemIcon);
          }
          recipeNode.addEventListener("click", (event) => {
            if (selectedRecipe !== recipe) {
              document.dispatchEvent(new GameRecipeEvent(recipe, machine, "recipe-selected"));
              recipeNode.classList.add("selected");
              event.stopPropagation();
            }
          });
          recipeNode.addEventListener("dblclick", (event) => {
            document.dispatchEvent(new GameRecipeEvent(recipe, machine, "recipe-selected"));
            recipeNode.classList.add("selected");
            confirmRecipeButton.dispatchEvent(new MouseEvent("click"));
            event.stopPropagation();
          });
          document.addEventListener("recipe-selected", () => {
            recipeNode.classList.remove("selected");
          });
          if (isEventRecipe) {
            eventsRecipesGroup.div.appendChild(recipeNode);
          } else {
            simpleRecipesGroup.appendChild(recipeNode);
          }
        };
      };
      machine.recipes.forEach(createRecipeParser(basicRecipesGroup.div));
      machine.alternateRecipes.forEach(createRecipeParser(alternateRecipesGroup.div));
      if (basicRecipesGroup.div.childElementCount !== 0) {
        recipesTab.appendChild(basicRecipesGroup.title);
        recipesTab.appendChild(basicRecipesGroup.div);
      }
      if (alternateRecipesGroup.div.childElementCount !== 0) {
        recipesTab.appendChild(alternateRecipesGroup.title);
        recipesTab.appendChild(alternateRecipesGroup.div);
      }
      if (eventsRecipesGroup.div.childElementCount !== 0) {
        recipesTab.appendChild(eventsRecipesGroup.title);
        recipesTab.appendChild(eventsRecipesGroup.div);
      }
      tabSelector.addEventListener("click", () => {
        document.dispatchEvent(new Event("recipes-tab-switched"));
        recipesTab.classList.add("active");
        tabSelector.classList.add("active");
      });
      document.addEventListener("recipes-tab-switched", () => {
        recipesTab.classList.remove("active");
        tabSelector.classList.remove("active");
        document.dispatchEvent(new GameRecipeEvent(void 0, void 0, "recipe-selected"));
      });
      tabSelector.appendChild(machineIcon);
      tabSelectors?.appendChild(tabSelector);
      recipeTabs.appendChild(recipesTab);
    }
    let selectedRecipeDisplay = document.querySelector("div#selected-recipe");
    selectedRecipeDisplay.scrollTop = selectedRecipeDisplay.scrollHeight;
    let createResourceDisplay = (parentDiv, craftingTime) => {
      return (recipeResource) => {
        let resource = Satisfactory_default.resources.find(
          (el) => {
            return el.id === recipeResource.id;
          }
        );
        let resourceDiv = document.createElement("div");
        resourceDiv.classList.add("resource");
        let icon = document.createElement("img");
        icon.classList.add("icon");
        icon.loading = "lazy";
        icon.alt = resource.displayName;
        icon.src = satisfactoryIconPath(resource.iconPath);
        icon.title = resource.displayName;
        let amount = document.createElement("p");
        amount.classList.add("amount");
        amount.innerText = `${+(60 / craftingTime * recipeResource.amount).toFixed(3)}`;
        resourceDiv.appendChild(icon);
        resourceDiv.appendChild(amount);
        parentDiv.appendChild(resourceDiv);
      };
    };
    let selectedRecipe;
    let selectedRecipeMachine;
    document.addEventListener("recipe-selected", (event) => {
      let recipe = event.recipe;
      let machine = event.machine;
      selectedRecipe = recipe;
      selectedRecipeMachine = machine;
      if (recipe == void 0 || machine == void 0) {
        selectedRecipeDisplay.classList.add("hidden");
      } else {
        let selectedRecipeName = document.querySelector("#selected-recipe-name>div.text");
        selectedRecipeName.innerText = recipe.displayName;
        let selectedRecipeMachine2 = document.querySelector("#selected-recipe-machine>div.machine>img.icon");
        selectedRecipeMachine2.src = satisfactoryIconPath(machine.iconPath);
        selectedRecipeMachine2.title = machine.displayName;
        document.querySelectorAll("#selected-recipe-input>div.resource").forEach((div) => div.remove());
        let selectedRecipeInput = document.querySelector("#selected-recipe-input");
        recipe.ingredients.forEach(createResourceDisplay(selectedRecipeInput, recipe.manufacturingDuration));
        document.querySelectorAll("#selected-recipe-output>div.resource").forEach((div) => div.remove());
        let selectedRecipeOutput = document.querySelector("#selected-recipe-output");
        recipe.products.forEach(createResourceDisplay(selectedRecipeOutput, recipe.manufacturingDuration));
        let selectedRecipePower = document.querySelector("#selected-recipe-power>div.text");
        selectedRecipePower.innerText = `${machine.powerConsumption} MW`;
        selectedRecipeDisplay.classList.remove("hidden");
        selectedRecipeDisplay.scrollTop = selectedRecipeDisplay.scrollHeight;
      }
    });
    confirmRecipeButton.addEventListener("click", () => {
      nodeCreationContainer?.classList.add("hidden");
      if (selectedRecipe != void 0 && selectedRecipeMachine != void 0) {
        createNode(selectedRecipe, selectedRecipeMachine);
      }
    });
    tabSelectors.children[0].classList.add("active");
    recipeTabs.children[0].classList.add("active");
  }
  main().catch((reason) => {
    console.error(reason);
  });
})();
