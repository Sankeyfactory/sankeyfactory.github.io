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

  // src/main.ts
  var import_panzoom = __toESM(require_panzoom());

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
    constructor(slotsGroup, slotsGroupSvg, resource, ...classes) {
      super();
      this._resource = resource;
      this._parentGroup = slotsGroup;
      let dimensions = {
        width: _SankeySlot.slotWidth,
        height: slotsGroup.maxHeight * (this._resource.amount / slotsGroup.resource.amount),
        x: 0,
        y: 0
      };
      this._slotSvgRect = SvgFactory.createSvgRect(dimensions, ...classes);
      slotsGroupSvg.appendChild(this.slotSvgRect);
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
      this._resource.amount = resourcesAmount;
      this.slotSvgRect.setAttribute(
        "height",
        `${this._parentGroup.maxHeight * (resourcesAmount / this._parentGroup.resource.amount)}`
      );
      this.dispatchEvent(new Event(_SankeySlot.boundsChangedEvent));
    }
    get resourceId() {
      return this._resource.id;
    }
    get slotSvgRect() {
      return this._slotSvgRect;
    }
    get parentGroup() {
      return this._parentGroup;
    }
    _resource;
    _slotSvgRect;
    _parentGroup;
  };

  // src/Point.ts
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

  // src/Curve.ts
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

  // src/Rectangle.ts
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
      firstSlot.addEventListener(SankeySlot.boundsChangedEvent, this.recalculate.bind(this));
      secondSlot.addEventListener(SankeySlot.boundsChangedEvent, this.recalculate.bind(this));
      firstSlot.addEventListener(SankeySlot.deletionEvent, this.delete.bind(this, secondSlot));
      secondSlot.addEventListener(SankeySlot.deletionEvent, this.delete.bind(this, firstSlot));
      this._svgPath = SvgFactory.createSvgPath("link", "animate-appearance");
      this._resourceDisplay = this.createResourceDisplay({
        id: firstSlot.resourceId,
        amount: firstSlot.resourcesAmount
      });
      this.recalculate();
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
      let resourceAmount = document.createElement("div");
      resourceAmount.classList.add("resource-amount");
      resourceAmount.innerText = `${resource.amount}/min`;
      container.appendChild(icon);
      container.appendChild(resourceAmount);
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
    _isDeleted = false;
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
    setPanContext(panContext) {
      this.panContext = panContext;
    }
    handleMouseMove(event) {
      if (this.panContext == void 0) {
        throw Error("Pan context must be initialized before using mouse handlers");
      }
      if (this.mouseStatus === _MouseHandler.MouseStatus.DraggingNode) {
        if (this.draggedNode == void 0) {
          throw Error("Dragged node wasn't saved.");
        }
        let previousPos = this.draggedNode.position;
        let zoomScale = this.panContext.getTransform().scale;
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
        if (this.panContext == void 0) {
          throw Error("Pan context must be initialized before using mouse handlers");
        }
        if (this.firstConnectingSlot == void 0) {
          throw Error("First connecting slot wasn't saved.");
        }
        if (this.firstConnectingSlot.resourceId != targetSlot.resourceId) {
          return;
        }
        let resourcesAmount = Math.min(targetSlot.resourcesAmount, this.firstConnectingSlot.resourcesAmount);
        let newSlot1 = this.firstConnectingSlot.splitOffSlot(resourcesAmount);
        let newSlot2 = targetSlot.splitOffSlot(resourcesAmount);
        SankeyLink.connect(newSlot1, newSlot2, this.panContext);
        this.cancelConnectingSlots();
      }
    }
    outputSlotClicked(event, targetSlot) {
      if (this.mouseStatus === _MouseHandler.MouseStatus.Free) {
        this.mouseStatus = _MouseHandler.MouseStatus.ConnectingOutputSlot;
        this.startConnectingSlot(event, targetSlot, false);
      } else if (this.mouseStatus === _MouseHandler.MouseStatus.ConnectingInputSlot) {
        if (this.panContext == void 0) {
          throw Error("Pan context must be initialized before using mouse handlers");
        }
        if (this.firstConnectingSlot == void 0) {
          throw Error("First connecting slot wasn't saved.");
        }
        if (this.firstConnectingSlot.resourceId != targetSlot.resourceId) {
          return;
        }
        let resourcesAmount = Math.min(targetSlot.resourcesAmount, this.firstConnectingSlot.resourcesAmount);
        let newSlot1 = this.firstConnectingSlot.splitOffSlot(resourcesAmount);
        let newSlot2 = targetSlot.splitOffSlot(resourcesAmount);
        SankeyLink.connect(newSlot1, newSlot2, this.panContext);
        this.cancelConnectingSlots();
      }
    }
    startConnectingSlot(event, firstSlot, isInput) {
      if (this.panContext == void 0) {
        throw Error("Pan context must be initialized before using mouse handlers");
      }
      this.firstConnectingSlot = firstSlot;
      let zoomScale = this.panContext.getTransform().scale;
      let slotBounds = firstSlot.slotSvgRect.getBoundingClientRect();
      slotBounds = {
        x: (slotBounds.x - this.panContext.getTransform().x) / zoomScale,
        y: (slotBounds.y - this.panContext.getTransform().y) / zoomScale,
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
    panContext;
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
        if (!event.altKey) {
          MouseHandler.getInstance().outputSlotClicked(event, this);
        }
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
        if (!event.altKey) {
          MouseHandler.getInstance().inputSlotClicked(event, this);
        }
      });
    }
    splitOffSlot(resourcesAmount) {
      return this.parentGroup.addSlot(resourcesAmount);
    }
  };

  // src/Sankey/SlotsGroup.ts
  var SlotsGroup = class _SlotsGroup extends EventTarget {
    static boundsChangedEvent = "bounds-changed";
    type;
    maxHeight;
    resource;
    constructor(node, type, resource, nodeResourcesAmount, startY) {
      super();
      this.type = type;
      this.resource = resource;
      let nodeHeight = +(node.nodeSvg.getAttribute("height") ?? 0);
      this.maxHeight = nodeHeight * (resource.amount / nodeResourcesAmount);
      let position = type === "input" ? new Point(0, startY) : new Point(SankeyNode.nodeWidth + SankeySlot.slotWidth, startY);
      this.groupSvg = SvgFactory.createSvgGroup(position, `${type}-slots`);
      this.lastSlot = this.initializeLastSlot();
      node.nodeSvgGroup.appendChild(this.groupSvg);
      this.addEventListener(_SlotsGroup.boundsChangedEvent, () => {
        for (const slot of this.slots) {
          slot.dispatchEvent(new Event(SankeySlot.boundsChangedEvent));
        }
      });
    }
    addSlot(resourcesAmount) {
      resourcesAmount = Math.min(resourcesAmount, this.lastSlot.resourcesAmount);
      this.lastSlot.resourcesAmount -= resourcesAmount;
      let newSlot;
      if (this.type === "input") {
        newSlot = new InputSankeySlot(this, this.groupSvg, {
          id: this.resource.id,
          amount: resourcesAmount
        });
      } else if (this.type === "output") {
        newSlot = new OutputSankeySlot(this, this.groupSvg, {
          id: this.resource.id,
          amount: resourcesAmount
        });
      } else {
        throw Error("Unexpected slots group type");
      }
      this.slots.push(newSlot);
      newSlot.addEventListener(SankeySlot.deletionEvent, () => {
        let index = this.slots.findIndex((slot) => Object.is(slot, newSlot));
        this.slots.splice(index, 1);
        this.updateSlotPositions();
      });
      this.updateSlotPositions();
      return newSlot;
    }
    delete() {
      while (this.slots.length !== 0) {
        this.slots[0].delete();
      }
      this.groupSvg.remove();
    }
    updateSlotPositions() {
      let freeResourcesAmount = this.resource.amount;
      let nextYPosition = 0;
      for (const slot of this.slots) {
        slot.setYPosition(nextYPosition);
        freeResourcesAmount -= slot.resourcesAmount;
        nextYPosition += +(slot.slotSvgRect.getAttribute("height") ?? 0);
      }
      this.lastSlot.setYPosition(nextYPosition);
      this.lastSlot.resourcesAmount = freeResourcesAmount;
    }
    initializeLastSlot() {
      if (this.type === "input") {
        return new SankeySlotMissing(this, this.groupSvg, { ...this.resource });
      } else if (this.type === "output") {
        return new SankeySlotExceeding(this, this.groupSvg, { ...this.resource });
      } else {
        throw Error("Unexpected slots group type");
      }
    }
    groupSvg;
    lastSlot;
    slots = [];
  };

  // src/ContextMenu/CustomContextMenu.ts
  var CustomContextMenu = class extends EventTarget {
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
    }
    closeMenu() {
      this._isMenuOpened = false;
      this._menuContainer.classList.add("hidden");
    }
    addMenuTo(node) {
      let contextMenu = document.querySelector(`#${this.containerId}>.context-menu`);
      node.addEventListener("contextmenu", (event) => {
        let mouseEvent = event;
        event.preventDefault();
        this._openingPosition = { x: mouseEvent.clientX, y: mouseEvent.clientY };
        contextMenu.style.top = `${mouseEvent.pageY + 5}px`;
        contextMenu.style.left = `${mouseEvent.pageX + 5}px`;
        this.openMenu();
        event.stopPropagation();
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

  // src/Sankey/NodeConfiguration.ts
  var NodeConfiguration = class _NodeConfiguration extends EventTarget {
    static machinesAmountChangedEvent = "machines-amount-changed";
    static overclockChangedEvent = "overclock-changed";
    constructor(recipe, machine) {
      super();
      let closeSelector = `#${_NodeConfiguration._modalContainer.id} .title-row .close`;
      let closeButton = document.querySelector(closeSelector);
      closeButton.addEventListener("click", () => {
        this.closeConfigurationWindow();
      });
      window.addEventListener("keydown", (event) => {
        if (event.code === "Escape" && this._isOpened) {
          this.closeConfigurationWindow();
        }
      });
      this.setupTableElements(recipe, machine);
    }
    openConfigurationWindow() {
      _NodeConfiguration._machinesColumn.appendChild(this._machineConfigurator.htmlElement);
      for (const configurator of this._amountConfigurators.inputsConfigurators) {
        _NodeConfiguration._amountInputsColumn.appendChild(configurator.htmlElement);
      }
      for (const configurator of this._amountConfigurators.outputsConfigurators) {
        _NodeConfiguration._amountOutputsColumn.appendChild(configurator.htmlElement);
      }
      _NodeConfiguration._amountPowerColumn.appendChild(
        this._amountConfigurators.powerConfigurator.htmlElement
      );
      _NodeConfiguration._multipliersColumn.appendChild(this._overclockConfigurator.htmlElement);
      for (const configurator of this._overclockConfigurators.inputsConfigurators) {
        _NodeConfiguration._overclockInputsColumn.appendChild(configurator.htmlElement);
      }
      for (const configurator of this._overclockConfigurators.outputsConfigurators) {
        _NodeConfiguration._overclockOutputsColumn.appendChild(configurator.htmlElement);
      }
      _NodeConfiguration._overclockPowerColumn.appendChild(
        this._overclockConfigurators.powerConfigurator.htmlElement
      );
      _NodeConfiguration._modalContainer.classList.remove("hidden");
      this._isOpened = true;
    }
    closeConfigurationWindow() {
      this._machineConfigurator.htmlElement.remove();
      this._overclockConfigurator.htmlElement.remove();
      this._amountConfigurators.removeFromDom();
      this._overclockConfigurators.removeFromDom();
      _NodeConfiguration._modalContainer.classList.add("hidden");
      this._isOpened = false;
    }
    setupTableElements(recipe, machine) {
      let machineIcon = _NodeConfiguration.createImgIcon(machine.displayName, machine.iconPath);
      this._machineConfigurator = this.generateConfigurator(
        machineIcon,
        1,
        ""
      );
      this.setupMachinesAmountConfigurator(this._machineConfigurator.inputElement);
      let overclockIcon = _NodeConfiguration.createImgIcon(
        "Overclock",
        "Resource/Environment/Crystal/PowerShard.png"
      );
      this._overclockConfigurator = this.generateConfigurator(
        overclockIcon,
        100,
        "%"
      );
      this.setupOverclockConfigurator(this._overclockConfigurator.inputElement);
      let createResourceConfigurators = (resource, amountConfigurators, overclockConfigurators) => {
        let resourceDesc = Satisfactory_default.resources.find(
          // I specify type because deploy fails otherwise for some reason.
          (resourceData) => {
            return resourceData.id == resource.id;
          }
        );
        let resourceIcon1 = _NodeConfiguration.createImgIcon(resourceDesc.displayName, resourceDesc.iconPath);
        let resourceIcon2 = _NodeConfiguration.createImgIcon(resourceDesc.displayName, resourceDesc.iconPath);
        let itemsInMinute = toItemsInMinute(resource.amount, recipe.manufacturingDuration);
        let amountConfigurator = this.generateConfigurator(
          resourceIcon1,
          itemsInMinute,
          "/min"
        );
        this.setupAmountInOutConfigurator(amountConfigurator.inputElement, itemsInMinute);
        amountConfigurators.push(amountConfigurator);
        let overclockConfigurator = this.generateConfigurator(
          resourceIcon2,
          itemsInMinute,
          "/min"
        );
        this.setupOverclockInOutConfigurator(overclockConfigurator.inputElement, itemsInMinute);
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
      let powerIcon1 = _NodeConfiguration.createPowerSvgIcon();
      let powerIcon2 = _NodeConfiguration.createPowerSvgIcon();
      this._amountConfigurators.powerConfigurator = this.generateConfigurator(
        powerIcon1,
        machine.powerConsumption,
        "MW"
      );
      this.setupAmountPowerConfigurator(
        this._amountConfigurators.powerConfigurator.inputElement,
        machine.powerConsumption,
        machine.powerConsumptionExponent
      );
      this._overclockConfigurators.powerConfigurator = this.generateConfigurator(
        powerIcon2,
        machine.powerConsumption,
        "MW"
      );
      this.setupOverclockPowerConfigurator(
        this._overclockConfigurators.powerConfigurator.inputElement,
        machine.powerConsumption,
        machine.powerConsumptionExponent
      );
    }
    static numberParser(str) {
      let value1 = +str;
      let value2 = Number.parseFloat(str);
      if (Number.isNaN(value1) || Number.isNaN(value2) || value1 === 0) {
        return NaN;
      }
      return value1;
    }
    setupMachinesAmountConfigurator(machinesAmount) {
      machinesAmount.addEventListener("input", () => {
        let value = _NodeConfiguration.numberParser(machinesAmount.value);
        if (!Number.isNaN(value)) {
          machinesAmount.classList.remove("error");
          this.setMachinesAmount(value);
        } else {
          machinesAmount.classList.add("error");
        }
      });
      let normalize = () => {
        machinesAmount.classList.remove("error");
        machinesAmount.value = `${+this.getMachinesAmount().toFixed(4)}`;
      };
      machinesAmount.addEventListener("blur", normalize);
      machinesAmount.addEventListener("keydown", function(event) {
        if (event.repeat) {
          return;
        }
        if (event.key === "Enter") {
          machinesAmount.blur();
          normalize();
        }
      });
      this.addEventListener(_NodeConfiguration.machinesAmountChangedEvent, () => {
        let targetValue = this.getMachinesAmount();
        machinesAmount.value = `${+targetValue.toFixed(4)}`;
      });
    }
    setupOverclockConfigurator(overclock) {
      overclock.addEventListener("input", () => {
        let value = _NodeConfiguration.numberParser(overclock.value);
        if (!Number.isNaN(value) && value >= 1 && value <= 250) {
          overclock.classList.remove("error");
          this.setOverclockRatio(value / 100);
        } else {
          overclock.classList.add("error");
        }
      });
      let normalize = () => {
        overclock.classList.remove("error");
        let value = _NodeConfiguration.numberParser(overclock.value);
        if (value < 1) {
          this.setOverclockRatio(1 / 100);
        } else if (value > 250) {
          this.setOverclockRatio(250 / 100);
        } else {
          overclock.value = `${+(this.getOverclockRatio() * 100).toFixed(4)}`;
        }
      };
      overclock.addEventListener("blur", normalize);
      overclock.addEventListener("keydown", function(event) {
        if (event.repeat) {
          return;
        }
        if (event.key === "Enter") {
          overclock.blur();
        }
      });
      this.addEventListener(_NodeConfiguration.overclockChangedEvent, () => {
        let targetValue = this.getOverclockRatio() * 100;
        overclock.value = `${+targetValue.toFixed(4)}`;
      });
    }
    setupAmountInOutConfigurator(amountInOut, initialValue) {
      amountInOut.addEventListener("input", () => {
        let value = _NodeConfiguration.numberParser(amountInOut.value);
        if (!Number.isNaN(value)) {
          amountInOut.classList.remove("error");
          this.setMachinesAmount(value / initialValue / this.getOverclockRatio());
        } else {
          amountInOut.classList.add("error");
        }
      });
      let normalize = () => {
        amountInOut.classList.remove("error");
        amountInOut.value = `${+(initialValue * this.getOverclockRatio() * this.getMachinesAmount()).toFixed(4)}`;
      };
      amountInOut.addEventListener("blur", normalize);
      amountInOut.addEventListener("keydown", function(event) {
        if (event.repeat) {
          return;
        }
        if (event.key === "Enter") {
          amountInOut.blur();
        }
      });
      this.addEventListener(_NodeConfiguration.machinesAmountChangedEvent, () => {
        let targetValue = +(initialValue * this.getOverclockRatio() * this.getMachinesAmount()).toFixed(4);
        amountInOut.value = `${targetValue}`;
      });
      this.addEventListener(_NodeConfiguration.overclockChangedEvent, () => {
        let targetValue = +(initialValue * this.getOverclockRatio() * this.getMachinesAmount()).toFixed(4);
        amountInOut.value = `${targetValue}`;
      });
    }
    setupAmountPowerConfigurator(amountPower, initialValue, powerExponent) {
      amountPower.addEventListener("input", () => {
        let value = _NodeConfiguration.numberParser(amountPower.value);
        if (!Number.isNaN(value)) {
          amountPower.classList.remove("error");
          let initialOverclockedValue = initialValue * Math.pow(this.getOverclockRatio(), powerExponent);
          this.setMachinesAmount(value / initialOverclockedValue);
        } else {
          amountPower.classList.add("error");
        }
      });
      let normalize = () => {
        amountPower.classList.remove("error");
        let initialOverclockedValue = initialValue * Math.pow(this.getOverclockRatio(), powerExponent);
        amountPower.value = `${+(initialOverclockedValue * this.getMachinesAmount()).toFixed(4)}`;
      };
      amountPower.addEventListener("blur", normalize);
      amountPower.addEventListener("keydown", function(event) {
        if (event.repeat) {
          return;
        }
        if (event.key === "Enter") {
          amountPower.blur();
        }
      });
      this.addEventListener(_NodeConfiguration.machinesAmountChangedEvent, () => {
        let initialOverclockedValue = initialValue * Math.pow(this.getOverclockRatio(), powerExponent);
        let targetValue = +(initialOverclockedValue * this.getMachinesAmount()).toFixed(4);
        amountPower.value = `${targetValue}`;
      });
      this.addEventListener(_NodeConfiguration.overclockChangedEvent, () => {
        let initialOverclockedValue = initialValue * Math.pow(this.getOverclockRatio(), powerExponent);
        let targetValue = +(initialOverclockedValue * this.getMachinesAmount()).toFixed(4);
        amountPower.value = `${targetValue}`;
      });
    }
    setupOverclockInOutConfigurator(overclockInOut, initialValue) {
      overclockInOut.addEventListener("input", () => {
        let value = _NodeConfiguration.numberParser(overclockInOut.value);
        if (!Number.isNaN(value)) {
          overclockInOut.classList.remove("error");
          this.setOverclockRatio(value / initialValue);
        } else {
          overclockInOut.classList.add("error");
        }
      });
      let normalize = () => {
        overclockInOut.classList.remove("error");
        overclockInOut.value = `${+(initialValue * this.getOverclockRatio()).toFixed(4)}`;
      };
      overclockInOut.addEventListener("blur", normalize);
      overclockInOut.addEventListener("keydown", function(event) {
        if (event.repeat) {
          return;
        }
        if (event.key === "Enter") {
          overclockInOut.blur();
        }
      });
      this.addEventListener(_NodeConfiguration.machinesAmountChangedEvent, () => {
        let targetValue = +(initialValue * this.getOverclockRatio()).toFixed(4);
        overclockInOut.value = `${targetValue}`;
      });
      this.addEventListener(_NodeConfiguration.overclockChangedEvent, () => {
        let targetValue = +(initialValue * this.getOverclockRatio()).toFixed(4);
        overclockInOut.value = `${targetValue}`;
      });
    }
    setupOverclockPowerConfigurator(overclockPower, initialValue, powerExponent) {
      overclockPower.addEventListener("input", () => {
        let value = _NodeConfiguration.numberParser(overclockPower.value);
        if (!Number.isNaN(value)) {
          overclockPower.classList.remove("error");
          this.setOverclockRatio(Math.pow(value / initialValue, 1 / powerExponent));
        } else {
          overclockPower.classList.add("error");
        }
      });
      let normalize = () => {
        overclockPower.classList.remove("error");
        overclockPower.value = `${+(initialValue * Math.pow(this.getOverclockRatio(), powerExponent)).toFixed(4)}`;
      };
      overclockPower.addEventListener("blur", normalize);
      overclockPower.addEventListener("keydown", function(event) {
        if (event.repeat) {
          return;
        }
        if (event.key === "Enter") {
          overclockPower.blur();
        }
      });
      this.addEventListener(_NodeConfiguration.machinesAmountChangedEvent, () => {
        overclockPower.value = `${+(initialValue * Math.pow(this.getOverclockRatio(), powerExponent)).toFixed(4)}`;
      });
      this.addEventListener(_NodeConfiguration.overclockChangedEvent, () => {
        overclockPower.value = `${+(initialValue * Math.pow(this.getOverclockRatio(), powerExponent)).toFixed(4)}`;
      });
    }
    generateConfigurator(icon, initialValue, units) {
      let editElement = document.createElement("div");
      editElement.classList.add("edit");
      let iconContainer = document.createElement("div");
      iconContainer.classList.add("icon-container");
      iconContainer.appendChild(icon);
      let inputElement = document.createElement("input");
      inputElement.value = `${initialValue}`;
      let unitsElement = document.createElement("div");
      unitsElement.classList.add("units");
      unitsElement.innerText = units;
      editElement.appendChild(iconContainer);
      editElement.appendChild(inputElement);
      editElement.appendChild(unitsElement);
      return new Configurator(editElement, inputElement, initialValue);
    }
    static createImgIcon(name, iconPath) {
      let icon = document.createElement("img");
      icon.src = satisfactoryIconPath(iconPath);
      icon.alt = name;
      icon.title = name;
      return icon;
    }
    static createPowerSvgIcon() {
      let icon = SvgFactory.createSvgElement("svg");
      icon.setAttribute("xmlns", "http://www.w3.org/2000/svg");
      icon.setAttribute("viewBox", "0 -960 960 960");
      let path = SvgFactory.createSvgPath();
      path.setAttribute("d", "M420-412H302q-14 0-20-12t2-23l203-295q5-7 12-9t15 1q8 3 11.5 9.5T528-726l-27 218h140q14 0 20 13t-3 24L431-199q-5 6-12 7.5t-14-1.5q-7-3-10.5-9t-2.5-14l28-196Z");
      icon.appendChild(path);
      return icon;
    }
    getMachinesAmount() {
      return this._machinesAmount;
    }
    setMachinesAmount(value) {
      this._machinesAmount = value;
      this.dispatchEvent(new Event(_NodeConfiguration.machinesAmountChangedEvent));
    }
    getOverclockRatio() {
      return this._overclockRatio;
    }
    setOverclockRatio(value) {
      value = Math.min(2.5, Math.max(0.01, value));
      this._overclockRatio = value;
      this.dispatchEvent(new Event(_NodeConfiguration.overclockChangedEvent));
    }
    _isOpened = false;
    _machinesAmount = 1;
    _overclockRatio = 1;
    _machineConfigurator;
    _overclockConfigurator;
    _amountConfigurators = new Configurators();
    _overclockConfigurators = new Configurators();
    static _modalContainer = document.querySelector("#machine-configuration-container");
    static _machinesColumn = document.querySelector(
      `#${_NodeConfiguration._modalContainer.id} .table.amount>.column.machines`
    );
    static _amountInputsColumn = document.querySelector(
      `#${_NodeConfiguration._modalContainer.id} .table.amount>.column.inputs`
    );
    static _amountOutputsColumn = document.querySelector(
      `#${_NodeConfiguration._modalContainer.id} .table.amount>.column.outputs`
    );
    static _amountPowerColumn = document.querySelector(
      `#${_NodeConfiguration._modalContainer.id} .table.amount>.column.power`
    );
    static _multipliersColumn = document.querySelector(
      `#${_NodeConfiguration._modalContainer.id} .table.overclock>.column.multipliers`
    );
    static _overclockInputsColumn = document.querySelector(
      `#${_NodeConfiguration._modalContainer.id} .table.overclock>.column.inputs`
    );
    static _overclockOutputsColumn = document.querySelector(
      `#${_NodeConfiguration._modalContainer.id} .table.overclock>.column.outputs`
    );
    static _overclockPowerColumn = document.querySelector(
      `#${_NodeConfiguration._modalContainer.id} .table.overclock>.column.power`
    );
  };
  var Configurators = class {
    inputsConfigurators = new Array();
    outputsConfigurators = new Array();
    powerConfigurator;
    removeFromDom() {
      for (const configurator of this.inputsConfigurators) {
        configurator.htmlElement.remove();
      }
      for (const configurator of this.outputsConfigurators) {
        configurator.htmlElement.remove();
      }
      if (this.powerConfigurator != void 0) {
        this.powerConfigurator.htmlElement.remove();
      }
    }
  };
  var Configurator = class {
    constructor(htmlElement, inputElement, initialValue) {
      this.htmlElement = htmlElement;
      this.inputElement = inputElement;
      this.initialValue = initialValue;
    }
  };

  // src/Sankey/SankeyNode.ts
  var SankeyNode = class _SankeyNode {
    nodeSvg;
    nodeSvgGroup;
    static nodeHeight = 260;
    static nodeWidth = 60;
    constructor(parentGroup, position, recipe, machine) {
      this.nodeSvgGroup = SvgFactory.createSvgGroup({
        x: position.x - _SankeyNode.nodeWidth / 2 - SankeySlot.slotWidth,
        y: position.y - _SankeyNode.nodeHeight / 2
      }, "node", "animate-appearance");
      this.nodeSvg = SvgFactory.createSvgRect({
        width: _SankeyNode.nodeWidth,
        height: _SankeyNode.nodeHeight,
        x: SankeySlot.slotWidth,
        y: 0
      }, "machine");
      this.configureContextMenu(recipe, machine);
      let totalInputResourcesAmount = recipe.ingredients.reduce((sum, ingredient) => {
        return sum + toItemsInMinute(ingredient.amount, recipe.manufacturingDuration);
      }, 0);
      let totalOutputResourcesAmount = recipe.products.reduce((sum, product) => {
        return sum + toItemsInMinute(product.amount, recipe.manufacturingDuration);
      }, 0);
      let nextInputGroupY = 0;
      for (const ingredient of recipe.ingredients) {
        let newGroup = new SlotsGroup(
          this,
          "input",
          {
            id: ingredient.id,
            amount: toItemsInMinute(ingredient.amount, recipe.manufacturingDuration)
          },
          totalInputResourcesAmount,
          nextInputGroupY
        );
        this._inputSlotGroups.push(newGroup);
        nextInputGroupY += newGroup.maxHeight;
      }
      let nextOutputGroupY = 0;
      for (const product of recipe.products) {
        let newGroup = new SlotsGroup(
          this,
          "output",
          {
            id: product.id,
            amount: toItemsInMinute(product.amount, recipe.manufacturingDuration)
          },
          totalOutputResourcesAmount,
          nextOutputGroupY
        );
        this._outputSlotGroups.push(newGroup);
        nextOutputGroupY += newGroup.maxHeight;
      }
      let foreignObject = SvgFactory.createSvgForeignObject();
      foreignObject.setAttribute("x", "10");
      foreignObject.setAttribute("y", "0");
      foreignObject.setAttribute("width", `${_SankeyNode.nodeWidth}`);
      foreignObject.setAttribute("height", `${_SankeyNode.nodeHeight}`);
      let recipeContainer = document.createElement("div");
      recipeContainer.classList.add("recipe-container");
      let recipeMachineProp = document.createElement("div");
      recipeMachineProp.classList.add("property");
      let recipeMachineTitle = document.createElement("div");
      recipeMachineTitle.classList.add("title");
      recipeMachineTitle.innerText = "Machine";
      let recipeMachineValue = document.createElement("div");
      recipeMachineValue.classList.add("machine");
      let recipeMachineIcon = document.createElement("img");
      recipeMachineIcon.classList.add("icon");
      let recipeInputsProp = document.createElement("div");
      recipeInputsProp.classList.add("property");
      let recipeInputsTitle = document.createElement("div");
      recipeInputsTitle.classList.add("title");
      recipeInputsTitle.innerText = "Input/min";
      let recipeOutputsProp = document.createElement("div");
      recipeOutputsProp.classList.add("property");
      let recipeOutputsTitle = document.createElement("div");
      recipeOutputsTitle.classList.add("title");
      recipeOutputsTitle.innerText = "Output/min";
      let recipePowerProp = document.createElement("div");
      recipePowerProp.classList.add("property");
      let recipePowerTitle = document.createElement("div");
      recipePowerTitle.classList.add("title");
      recipePowerTitle.innerText = "Power";
      let recipePowerText = document.createElement("div");
      recipePowerText.classList.add("text");
      recipeMachineValue.appendChild(recipeMachineIcon);
      recipeMachineProp.appendChild(recipeMachineTitle);
      recipeMachineProp.appendChild(recipeMachineValue);
      recipeInputsProp.appendChild(recipeInputsTitle);
      recipeOutputsProp.appendChild(recipeOutputsTitle);
      recipePowerProp.appendChild(recipePowerTitle);
      recipePowerProp.appendChild(recipePowerText);
      recipeContainer.appendChild(recipeMachineProp);
      recipeContainer.appendChild(recipeInputsProp);
      recipeContainer.appendChild(recipeOutputsProp);
      recipeContainer.appendChild(recipePowerProp);
      foreignObject.appendChild(recipeContainer);
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
          amount.innerText = `${+(60 / craftingTime * recipeResource.amount).toPrecision(3)}`;
          resourceDiv.appendChild(icon);
          resourceDiv.appendChild(amount);
          parentDiv.appendChild(resourceDiv);
        };
      };
      recipeMachineIcon.src = satisfactoryIconPath(machine.iconPath);
      recipeMachineIcon.title = machine.displayName;
      recipeMachineIcon.alt = machine.displayName;
      recipe.ingredients.forEach(createResourceDisplay(recipeInputsProp, recipe.manufacturingDuration));
      recipe.products.forEach(createResourceDisplay(recipeOutputsProp, recipe.manufacturingDuration));
      recipePowerText.innerText = `${machine.powerConsumption} MW`;
      this.nodeSvgGroup.appendChild(this.nodeSvg);
      this.nodeSvgGroup.appendChild(foreignObject);
      parentGroup.appendChild(this.nodeSvgGroup);
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
    delete() {
      for (const slotsGroup of this._inputSlotGroups) {
        slotsGroup.delete();
      }
      for (const slotsGroup of this._outputSlotGroups) {
        slotsGroup.delete();
      }
      this.nodeSvgGroup.remove();
    }
    configureContextMenu(recipe, machine) {
      let nodeContextMenu = new NodeContextMenu(this.nodeSvg);
      nodeContextMenu.addEventListener(NodeContextMenu.deleteNodeOptionClickedEvent, () => {
        this.delete();
      });
      let configurator = new NodeConfiguration(recipe, machine);
      let openConfigurator = function(event) {
        configurator.openConfigurationWindow();
        event.stopPropagation();
      };
      nodeContextMenu.addEventListener(NodeContextMenu.configureNodeOptionClickedEvent, openConfigurator);
      this.nodeSvg.addEventListener("dblclick", openConfigurator);
    }
    _inputSlotGroups = [];
    _outputSlotGroups = [];
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
    setPanContext(panContext) {
      this._panContext = panContext;
    }
    get isCanvasLocked() {
      return this._isCanvasLocked;
    }
    set isCanvasLocked(canvasLocked) {
      if (this._panContext == void 0) {
        throw Error("Pan context must be initialized before locking canvas");
      }
      if (canvasLocked) {
        this._panContext.pause();
      } else {
        this._panContext.resume();
      }
      this._isCanvasLocked = canvasLocked;
      this.dispatchEvent(new Event(_Settings.isCanvasLockedChangedEvent));
    }
    constructor() {
      super();
    }
    static _instance = new _Settings();
    _panContext;
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

  // src/main.ts
  async function main() {
    let viewport = document.querySelector("#viewport");
    let nodesGroup = document.querySelector("g.nodes");
    let linksGroup = document.querySelector("g.links");
    let zoomRatioDisplay = document.querySelector("p#ratio-display");
    if (viewport == null || nodesGroup == null || linksGroup == null) {
      throw new Error("Svg container is broken");
    }
    let isHoldingCtrl = false;
    let panContext = (0, import_panzoom.default)(viewport, {
      zoomDoubleClickSpeed: 1,
      // disables double click zoom
      beforeMouseDown: function() {
        return !isHoldingCtrl;
      },
      beforeWheel: function() {
        return !isHoldingCtrl;
      }
    });
    panContext.on("zoom", () => {
      let zoomScale = panContext.getTransform()?.scale ?? 1;
      zoomRatioDisplay.textContent = `Zoom: ${zoomScale.toFixed(2)}x`;
    });
    Settings.instance.setPanContext(panContext);
    MouseHandler.getInstance().setPanContext(panContext);
    let nodeCreationPosition;
    function createNode(recipe, machine) {
      const node = new SankeyNode(nodesGroup, nodeCreationPosition, recipe, machine);
      node.nodeSvg.onmousedown = (event) => {
        if (!isHoldingCtrl && event.buttons === 1) {
          MouseHandler.getInstance().startDraggingNode(event, node);
        }
      };
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
      if (event.key === "Control") {
        isHoldingCtrl = true;
        document.querySelector("#container").classList.add("move");
      }
      if (event.key === "Escape") {
        MouseHandler.getInstance().cancelConnectingSlots();
      }
    });
    window.addEventListener("keyup", (event) => {
      if (event.repeat) {
        return;
      }
      if (event.key === "Control") {
        isHoldingCtrl = false;
        document.querySelector("#container").classList.remove("move");
      }
    });
    window.addEventListener("focusout", () => {
      document.querySelector("#container").classList.remove("move");
    });
    let nodeCreationContainer = document.querySelector("div#node-creation-container");
    let canvas = document.querySelector("#canvas");
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
    recipeTabs.addEventListener("click", () => {
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
            document.dispatchEvent(new GameRecipeEvent(recipe, machine, "recipe-selected"));
            recipeNode.classList.add("selected");
            event.stopPropagation();
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
