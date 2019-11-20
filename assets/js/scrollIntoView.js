/*
 * jQuery scrollintoview() plugin and :scrollable selector filter
 *
 * Version 1.8 (14 Jul 2011)
 * Requires jQuery 1.4 or newer
 *
 * Copyright (c) 2011 Robert Koritnik
 * Licensed under the terms of the MIT license
 * http://www.opensource.org/licenses/mit-license.php
 */
(function(f) {
  var c = {
    vertical: { x: false, y: true },
    horizontal: { x: true, y: false },
    both: { x: true, y: true },
    x: { x: true, y: false },
    y: { x: false, y: true }
  };
  var b = { duration: "fast", direction: "both" };
  var e = /^(?:html)$/i;
  var g = function(k, j) {
    j =
      j ||
      (document.defaultView && document.defaultView.getComputedStyle
        ? document.defaultView.getComputedStyle(k, null)
        : k.currentStyle);
    var i =
      document.defaultView && document.defaultView.getComputedStyle
        ? true
        : false;
    var h = {
      top: parseFloat(i ? j.borderTopWidth : f.css(k, "borderTopWidth")) || 0,
      left:
        parseFloat(i ? j.borderLeftWidth : f.css(k, "borderLeftWidth")) || 0,
      bottom:
        parseFloat(i ? j.borderBottomWidth : f.css(k, "borderBottomWidth")) ||
        0,
      right:
        parseFloat(i ? j.borderRightWidth : f.css(k, "borderRightWidth")) || 0
    };
    return {
      top: h.top,
      left: h.left,
      bottom: h.bottom,
      right: h.right,
      vertical: h.top + h.bottom,
      horizontal: h.left + h.right
    };
  };
  var d = function(h) {
    var j = f(window);
    var i = e.test(h[0].nodeName);
    return {
      border: i ? { top: 0, left: 0, bottom: 0, right: 0 } : g(h[0]),
      scroll: { top: (i ? j : h).scrollTop(), left: (i ? j : h).scrollLeft() },
      scrollbar: {
        right: i ? 0 : h.innerWidth() - h[0].clientWidth,
        bottom: i ? 0 : h.innerHeight() - h[0].clientHeight
      },
      rect: (function() {
        var k = h[0].getBoundingClientRect();
        return {
          top: i ? 0 : k.top,
          left: i ? 0 : k.left,
          bottom: i ? h[0].clientHeight : k.bottom,
          right: i ? h[0].clientWidth : k.right
        };
      })()
    };
  };
  f.fn.extend({
    scrollintoview: function(j) {
      j = f.extend({}, b, j);
      j.direction =
        c[typeof j.direction === "string" && j.direction.toLowerCase()] ||
        c.both;
      var n = "";
      if (j.direction.x === true) {
        n = "horizontal";
      }
      if (j.direction.y === true) {
        n = n ? "both" : "vertical";
      }
      var l = this.eq(0);
      var i = l.closest(":scrollable(" + n + ")");
      if (i.length > 0) {
        i = i.eq(0);
        var m = { e: d(l), s: d(i) };
        var h = {
          top: m.e.rect.top - (m.s.rect.top + m.s.border.top),
          bottom:
            m.s.rect.bottom -
            m.s.border.bottom -
            m.s.scrollbar.bottom -
            m.e.rect.bottom,
          left: m.e.rect.left - (m.s.rect.left + m.s.border.left),
          right:
            m.s.rect.right -
            m.s.border.right -
            m.s.scrollbar.right -
            m.e.rect.right
        };
        var k = {};
        if (j.direction.y === true) {
          if (h.top < 0) {
            k.scrollTop = m.s.scroll.top + h.top;
          } else {
            if (h.top > 0 && h.bottom < 0) {
              k.scrollTop = m.s.scroll.top + Math.min(h.top, -h.bottom);
            }
          }
        }
        if (j.direction.x === true) {
          if (h.left < 0) {
            k.scrollLeft = m.s.scroll.left + h.left;
          } else {
            if (h.left > 0 && h.right < 0) {
              k.scrollLeft = m.s.scroll.left + Math.min(h.left, -h.right);
            }
          }
        }
        if (!f.isEmptyObject(k)) {
          if (e.test(i[0].nodeName)) {
            i = f("html,body");
          }
          i.animate(k, j.duration)
            .eq(0)
            .queue(function(o) {
              f.isFunction(j.complete) && j.complete.call(i[0]);
              o();
            });
        } else {
          f.isFunction(j.complete) && j.complete.call(i[0]);
        }
      }
      return this;
    }
  });
  var a = { auto: true, scroll: true, visible: false, hidden: false };
  f.extend(f.expr[":"], {
    scrollable: function(k, i, n, h) {
      var m = c[typeof n[3] === "string" && n[3].toLowerCase()] || c.both;
      var l =
        document.defaultView && document.defaultView.getComputedStyle
          ? document.defaultView.getComputedStyle(k, null)
          : k.currentStyle;
      var o = {
        x: a[l.overflowX.toLowerCase()] || false,
        y: a[l.overflowY.toLowerCase()] || false,
        isRoot: e.test(k.nodeName)
      };
      if (!o.x && !o.y && !o.isRoot) {
        return false;
      }
      var j = {
        height: { scroll: k.scrollHeight, client: k.clientHeight },
        width: { scroll: k.scrollWidth, client: k.clientWidth },
        scrollableX: function() {
          return (o.x || o.isRoot) && this.width.scroll > this.width.client;
        },
        scrollableY: function() {
          return (o.y || o.isRoot) && this.height.scroll > this.height.client;
        }
      };
      return (m.y && j.scrollableY()) || (m.x && j.scrollableX());
    }
  });
})(jQuery);
