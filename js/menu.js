var Menu = (function($) {

  var Constructor = function(settings) {
    // store settings for later use
    this.settings = settings;
    this.elem = $(settings.container);
    this.items = [];
    this.activeItem = null;
    this.activeTrail = [];
    this.leaveTimer;
  };

  Constructor.prototype = {
    init: function() {
      // which methods should be blocking?
      // which should be async?
      this.setParentItems()
        .setActiveTrailClasses()
        .setItemIds()
        .setBarDepth()
        .setBarIds()
        .explodeBars()
        .bindEvents()
        .setActiveTrail(0)
        .fadeIn()
        .settings.onInit(this);
    },
    // this could be passed to the Item prototype
    setParentItems: function() {
      var settingsClass = this.settings.classes.hasChildren;
      var items = $('li.' + settingsClass, this.elem);
      this.items = items.addClass(MenuClasses.hasChildren);
      return this;
    },
    setItemIds: function() {
      var items = $('li', this.elem);
      // this could be passed to the Item prototype
      items.each(function() {
        var id = $.uuid();
        $(this).prop('id', id);
      });
      return this;
    },
    // TODO: move to bar proto
    setBarDepth: function() {
      var depth = 1;

      var setBar = function(context) {
        var b;
        if (context.prop('tagName') === 'UL') {
          b = $('> li > ul', context);
        }
        return b;
      };

      var context = bar = $(this.elem.getNthClosestDescendants(this.settings.numMenus, 'ul'));

      while (bar.length) {
        var isDepthOdd = depth % 2;

        if (depth === 1) {
          bar.addClass('hm-primary-bar');
          bar.prop('id', 'hm-primary-bar');
        } else {
          bar.addClass('hm-sub-bar hm-sub-bar-depth-' + depth);
          if (isDepthOdd) {
            bar.addClass('hm-sub-bar-odd');
          } else {
            bar.addClass('hm-sub-bar-even');
          }
        }

        // apply descending z-index to menus stack behind parents
        bar.css('z-index', depth * - 1);

        context = bar;
        bar = setBar(context);
        depth++;
      }
      return this;
    },
    // move to bar proto
    setBarIds: function() {
      var b = $('ul', this.elem).not('.hm-primary-bar');
      b.each(function() {
        var parentId = $(this).parent().prop('id');
        $(this).prop('id', 'hm-child-of-' + parentId);
      });
      return this;
    },
    explodeBars: function() {
      var b = $('ul', this.elem).not('.hm-primary-bar').not(this.settings.excludeMenus);
      $('.horizontal-menu').append(b);
      return this;
    },
    setActiveTrailClasses: function() {
      var activeFromSettings = $('li.' + this.settings.classes.activeTrail, this.elem);
      this.activeTrail = activeFromSettings.addClass(MenuClasses.activeTrail);
      return this;
    },
    setActiveTrail: function(showToDepth) {
      var index = 0;

      recursiveItemShow.call(this, this.activeTrail, index, showToDepth);

      if (this.activeTrail.length) {
        var activeIndex = this.activeTrail.length - 2;
        this.activeItem = new Item(this.activeTrail.eq(activeIndex), this.elem);
      }

      return this;
    },
    fadeIn: function() {
      // avoid pre-JS flash
      this.elem.addClass('hm-has-init');
      return this;
    },
    hideChildBarsOf: function(selectedItem, animOp) {
      var that = this;
      // dismiss ready bars
      var readyBars = $('ul.hm-bar-status-ready', this.elem);

      readyBars.each(function() {
        var b = new Bar('ul#' + $(this).prop('id'), that.elem);
        b.hide();
      });

      // hide shown bars, sorted by ascending ancestry
      // this needs to be limited to only child bars of the selected item
      var shownBars = $($('ul.hm-bar-status-show', this.elem).get().reverse());
      var index = 0;

      var recursiveHide = function() {
        var b = new Bar('ul#' + shownBars.eq(index).prop('id'), that.elem);
        // hide bars until we hit the parent bar of the selected item
        if (b.hasItem(selectedItem)) {
          var dfd = $.Deferred();
          return dfd.resolve();
        } else {
          var promise = b.hide(animOp).promise();

          return promise.then(function() {
            index++;
            if (index < shownBars.length) {
              return recursiveHide();
            }
          });
        }
      };

      return recursiveHide(index);
    },
    setActive: function(item, noDelay) {
      if (!item.length) { return this; }

      var selected = new Item(item, this.elem);
      // when menu is closed
      if (this.activeItem === null) {
        selected.showChildBar();
      } else {
        // when menu is open
        var relationship = selected.getRelationshipTo(this.activeItem);

        switch (relationship) {
          case 'self':
            if (this.activeItem.hasShownChildBars()) {
              this.hideChildBarsOf(selected);
            } else {
              selected.showChildBar();
            }
            break;
          case 'child':
            selected.showChildBar();
            break;
          case 'sibling':
            if (this.activeItem.hasShownChildBars()) {
              this.hideChildBarsOf(selected).then(function () {
                selected.showChildBar();
              });
            } else {
              selected.showChildBar();
            }
            break;
          case 'ancestor':
            this.hideChildBarsOf(selected);
            break;
          case 'nonAncestor':
            this.hideChildBarsOf(selected).then(function () {
              selected.showChildBar();
            });
            break;
        }
      }

      this.activeItem = setActiveItem(this.activeItem, selected);

      return this;
    },
    bindEvents: function() {
      var that = this;
      this.items
        .children('a')
        .on('click', function(event) {
          // instead of following primary link menu, show it's children
          event.preventDefault();
          that.setActive($(this).parent());
        });

      // reset active trail, close the menu when mousing away from open menu
      // with no active trail
      this.elem.on('mouseleave', function() {
        that.leaveTimer = setTimeout(function() {
          that.reset();
        }, 1000);
      });

      // allows user to quickly navigate away and right back to menu without
      // resetting current menu item
      this.elem.on('mouseenter', function() {
        if (typeof that.leaveTimer !== 'undefined') {
          clearTimeout(that.leaveTimer);
        }
      });
      return this;
    },
    reset: function() {
      // if no active trail item, dismiss all
      var that = this;
      if (!this.activeTrail.length) {

        // dismiss ready bars
        var readyBars = $('ul.hm-bar-status-ready', this.elem);

        readyBars.each(function() {
          var b = new Bar('ul#' + $(this).prop('id'), that.elem);
          b.hide();
        });

        var index = 0;
        var shownBars = $($('.hm-bar-status-show', this.elem).get().reverse());

        recursiveItemHide(shownBars, index);
        this.activeItem = null;
      } else {
        // create bar array of active trail children
        var activeTrailBars = this.activeTrail.map(function(index, item) {
          return $('#hm-child-of-' + $(this).attr('id'), that.elem).get(0);
        });
        // find shown bars that need to be dismissed
        var showToDepth = 0;
        var shownBars = $('.hm-bar-status-show', this.elem);
        var barsToRemove = shownBars.filter(function(index) {
          var inArray = activeTrailBars.index($(this)) === -1 || index > showToDepth ? true : false;
          return inArray;
        });
        // find bars that needed to be added back
        var neededActiveTrailBars = activeTrailBars.filter(function(index) {
          var inArray = shownBars.index($(this)) === -1 && index <= showToDepth ? true : false;
          return inArray;
        });

        var indexRec = 0;
        recursiveItemHide.call(this, $(barsToRemove.get().reverse()), indexRec).then(function() {
          recursiveBarShow.call(that, $(neededActiveTrailBars.get().reverse()), indexRec);
          that.activeItem = new Item(that.activeTrail.eq(that.activeTrail.length - 2));
        });
      }
    }
  };

  function setActiveItem(currentActive, selected) {
    var active;

    if (
      currentActive !== null &&
      selected.parentBar.hasClass('hm-primary-bar') &&
      selected.isAncestorOf(currentActive)
    ) {
      active = null;
    } else {
      active = selected;
    }

    return active;
  }

  function recursiveBarShow(arr, index, showToDepth) {
    if (
      !arr.length ||
      !arr.eq(index).length ||
      index > showToDepth
    ) { return; }

    var that = this;

    var b = new Bar(arr.eq(index), that.menuElem);
    var promise = b.show().promise();
    return promise.then(function() {
      index++;
      return recursiveBarShow.call(that, arr, index, showToDepth);
    });
  }

  function recursiveItemShow(arr, index, showToDepth) {
    if (
      !arr.length ||
      !arr.eq(index).length ||
      index > showToDepth
    ) { return; }

    var that = this;
    var item = new Item(arr.eq(index), this.elem);

    if (!item.childBar.length) {
      return;
    }

    var promise = item.showChildBar().promise();
    return promise.then(function() {
      index++;
      return recursiveItemShow.call(that, arr, index, showToDepth);
    });
  }

  function recursiveItemHide(arr, index) {
    if (
      !arr.length ||
      !arr.eq(index).length) {
      return $.Deferred().resolve();
    }

    var that = this;
    var b = new Bar(arr.eq(index), this.elem);
    var promise = b.hide().promise();

    return promise.then(function () {
      index++;
      return recursiveItemHide.call(that, arr, index);
    });
  }


  $.fn.getNthClosestDescendants = function(n, type) {
    var closestMatches = [];
    var children = this.children();

    recursiveMatch(children);

    function recursiveMatch(children) {
      var matches = children.filter(type);

      if (
        matches.length &&
        closestMatches.length < n
      ) {
        var neededMatches = n - closestMatches.length;
        var matchesToAdd = matches.slice(0, neededMatches);
        matchesToAdd.each(function() {
          closestMatches.push(this);
        });
      }

      if (closestMatches.length < n) {
        var newChildren = children.children();
        recursiveMatch(newChildren);
      }
    }

    return closestMatches;
  };

  return Constructor;

})(jQuery);
