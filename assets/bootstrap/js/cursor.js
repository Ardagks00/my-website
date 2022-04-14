

var e = {
    init: function () {
        e.customCursor();

    },
    isVariableDefined: function (el) {
        return typeof !!el && (el) != 'undefined' && el != null;
    },

    getNextSiblings: function (el, selector, filter) {
        let sibs = [];
        let nextElem = el.parentNode.firstChild;
        const matchesSelector = el.matches || el.webkitMatchesSelector || el.mozMatchesSelector || el.msMatchesSelector;
        do {
            if (nextElem.nodeType === 3) continue; // ignore text nodes
            if (nextElem === el) continue; // ignore elem of target
            if (nextElem === el.nextElementSibling) {
                if ((!filter || filter(el))) {
                    if (selector) {
                        if (matchesSelector.call(nextElem, selector)) {
                            return nextElem;
                        }
                    } else {
                        sibs.push(nextElem);
                    }
                    el = nextElem;

                }
            }
        } while (nextElem = nextElem.nextSibling)
        return sibs;
    },
    on: function (selectors, type, listener) {
        document.addEventListener("DOMContentLoaded", () => {
            if (!(selectors instanceof HTMLElement) && selectors !== null) {
                selectors = document.querySelector(selectors);
            }
            selectors.addEventListener(type, listener);
        });
    },
    onAll: function (selectors, type, listener) {
        document.addEventListener("DOMContentLoaded", () => {
            document.querySelectorAll(selectors).forEach((element) => {
                if (type.indexOf(',') > -1) {
                    let types = type.split(',');
                    types.forEach((type) => {
                        element.addEventListener(type, listener);
                    });
                } else {
                    element.addEventListener(type, listener);
                }


            });
        });
    },
    removeClass: function (selectors, className) {
        if (!(selectors instanceof HTMLElement) && selectors !== null) {
            selectors = document.querySelector(selectors);
        }
        if (e.isVariableDefined(selectors)) {
            selectors.removeClass(className);
        }
    },
    removeAllClass: function (selectors, className) {
        if (e.isVariableDefined(selectors) && (selectors instanceof HTMLElement)) {
            document.querySelectorAll(selectors).forEach((element) => {
                element.removeClass(className);
            });
        }

    },
    toggleClass: function (selectors, className) {
        if (!(selectors instanceof HTMLElement) && selectors !== null) {
            selectors = document.querySelector(selectors);
        }
        if (e.isVariableDefined(selectors)) {
            selectors.toggleClass(className);
        }
    },
    toggleAllClass: function (selectors, className) {
        if (e.isVariableDefined(selectors) && (selectors instanceof HTMLElement)) {
            document.querySelectorAll(selectors).forEach((element) => {
                element.toggleClass(className);
            });
        }
    },
    addClass: function (selectors, className) {
        if (!(selectors instanceof HTMLElement) && selectors !== null) {
            selectors = document.querySelector(selectors);
        }
        if (e.isVariableDefined(selectors)) {
            selectors.addClass(className);
        }
    },
    select: function (selectors) {
        return document.querySelector(selectors);
    },
    selectAll: function (selectors) {
        return document.querySelectorAll(selectors);
    },



    // START: 02 Custom Cursor
    customCursor: function () {
        var c = e.select(".cursor-dot");
        if (e.isVariableDefined(c)) {
            var cursor = {
                delay: 8,
                _x: 0,
                _y: 0,
                endX: (window.innerWidth / 2),
                endY: (window.innerHeight / 2),
                cursorVisible: true,
                cursorEnlarged: false,
                $dot: e.select('.cursor-dot'),
                $outline: e.select('.cursor-dot-outline'),

                init: function () {
                    // Set up element sizes
                    this.dotSize = this.$dot.offsetWidth;
                    this.outlineSize = this.$outline.offsetWidth;

                    this.setupEventListeners();
                    this.animateDotOutline();
                },

                updateCursor: function (e) {
                    var self = this;

                    console.log(e)

                    // Show the cursor
                    self.cursorVisible = true;
                    self.toggleCursorVisibility();

                    // Position the dot
                    self.endX = e.clientX;
                    self.endY = e.clientY;
                    self.$dot.style.top = self.endY + 'px';
                    self.$dot.style.left = self.endX + 'px';
                },

                setupEventListeners: function () {
                    var self = this;

                    // Reposition cursor on window load
                    window.addEventListener('load', (event) => {
                        self.cursorEnlarged = false;
                        self.toggleCursorSize();
                    });

                    // Anchor hovering
                    e.selectAll('a, button').forEach(function (el) {
                        el.addEventListener('mouseover', function () {
                            self.cursorEnlarged = true;
                            self.toggleCursorSize();
                        });
                        el.addEventListener('mouseout', function () {
                            self.cursorEnlarged = false;
                            self.toggleCursorSize();
                        });
                    });

                    // Click events
                    document.addEventListener('mousedown', function () {
                        self.cursorEnlarged = true;
                        self.toggleCursorSize();
                    });
                    document.addEventListener('mouseup', function () {
                        self.cursorEnlarged = false;
                        self.toggleCursorSize();
                    });


                    document.addEventListener('mousemove', function (e) {
                        // Show the cursor
                        self.cursorVisible = true;
                        self.toggleCursorVisibility();

                        // Position the dot
                        self.endX = e.clientX;
                        self.endY = e.clientY;
                        self.$dot.style.top = self.endY + 'px';
                        self.$dot.style.left = self.endX + 'px';
                    });

                    // Hide/show cursor
                    document.addEventListener('mouseenter', function (e) {
                        self.cursorVisible = true;
                        self.toggleCursorVisibility();
                        self.$dot.style.opacity = 1;
                        self.$outline.style.opacity = 1;
                    });

                    document.addEventListener('mouseleave', function (e) {
                        self.cursorVisible = true;
                        self.toggleCursorVisibility();
                        self.$dot.style.opacity = 0;
                        self.$outline.style.opacity = 0;
                    });
                },

                animateDotOutline: function () {
                    var self = this;

                    self._x += (self.endX - self._x) / self.delay;
                    self._y += (self.endY - self._y) / self.delay;
                    self.$outline.style.top = self._y + 'px';
                    self.$outline.style.left = self._x + 'px';

                    requestAnimationFrame(this.animateDotOutline.bind(self));
                },

                toggleCursorSize: function () {
                    var self = this;

                    if (self.cursorEnlarged) {
                        self.$dot.style.transform = 'translate(-50%, -50%) scale(0.75)';
                        self.$outline.style.transform = 'translate(-50%, -50%) scale(1.6)';
                    } else {
                        self.$dot.style.transform = 'translate(-50%, -50%) scale(1)';
                        self.$outline.style.transform = 'translate(-50%, -50%) scale(1)';
                    }
                },

                toggleCursorVisibility: function () {
                    var self = this;

                    if (self.cursorVisible) {
                        self.$dot.style.opacity = 1;
                        self.$outline.style.opacity = 1;
                    } else {
                        self.$dot.style.opacity = 0;
                        self.$outline.style.opacity = 0;
                    }
                }
            }
            cursor.init();
        }
    },
    // END: Custom Cursor
};
e.init();


