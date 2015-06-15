var Menu = (function($) {

  var Constructor = function(settings) {
    // store settings for later use
    this.settings = settings;
    this.elem = $(settings.container);
    this.items = [];
    this.activeItem = null;
    this.activeTrail = [];
    this.leaveTimer;
  }

  Constructor.prototype = {
    init: function() {
      // which methods should be blocking?
      // which should be async?
      this.setParentItems()
        .setActiveTrail()
        .setItemIds()
        .setBarDepth()
        .setBarIds()
        .explodeBars()
        .bindEvents()
        .setActive(this.activeTrail, true)
        .settings.onInit(this);
    },
    // only manage menu items that have a child ul. menu items with no children
    // will simply function as links

    // this could be passed to the Item prototype
    setParentItems: function() {
      var settingsClass = this.settings.classes.hasChildren;
      var items = $('li.' + settingsClass, this.elem);
      this.items = items.addClass(MenuClasses.hasChildren);
      return this;
    },
    setItemIds: function() {
      var items = $('li.' + MenuClasses.hasChildren);
      // this could be passed to the Item prototype
      items.each(function() {
        var id = $.uuid();
        $(this).prop('id', id);
      });
      return this;
    },
    // move to bar proto
    setBarDepth: function() {
      var context = this.elem;
      var depth = 1;

      var setBar = function(context) {
        var b;
        if (context.prop('tagName') === 'UL') {
          b = $('> li > ul', context);
        } else {
          b = context.children().filter('ul');
        }
        return b;
      };

      var bar = setBar(context);

      while (bar.length) {
        var isDepthOdd = depth % 2;

        if (depth === 1) {
          bar.addClass('hm-primary-bar');
          bar.prop('id', 'hm-primary-bar');
        } else {
          bar.addClass('hm-sub-bar');
        }

        if (depth > 1 && isDepthOdd) {
          bar.addClass('hm-sub-bar hm-sub-bar-odd');
        } else if (depth > 1) {
          bar.addClass('hm-sub-bar hm-sub-bar-even');
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
      var b = $('ul').not('.hm-primary-bar')
      $('.horizontal-menu').append(b);
      return this;
    },
    setActiveTrail: function() {
      var activeFromSettings = $('.' + this.settings.classes.activeTrail, this.elem);
      this.activeTrail = activeFromSettings.addClass(MenuClasses.activeTrail);
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

      } else if (selected.isChildOf(this.activeItem)) {
        // child
        selected.showChildBar();

      } else if (selected.isSiblingTo(this.activeItem)) {
        // sibling
        // i only want to do the noSlide when the activeItem doesn't have any shown children
        // dismiss all bars (no slide), show selected child bars (no slide)
        console.log('sibs');
        // does the activeItem have any shown children? if yes
        if (this.activeItem.hasShownChildBars()) {
          this.hideChildBarsOf(selected, 'noSlide').then(function() {
            selected.showChildBar('noSlide');
          });
        } else {
          // if not, just do regular selected.showChildBar()
          selected.showChildBar();
        }

      } else if (selected.isAncestorOf(this.activeItem)) {
        // ancestor, self-inclusive
        // dismiss all bars
        console.log('is ancs');
        this.hideChildBarsOf(selected);

      } else {
        // selected is not an ancestor of active
        var barId = selected.parentBar.prop('id');
        var a = this.activeItem.getAncestorByBar(barId);
        // a dismisss all bars
        // show child bar of selected
        console.log('not an anc');
        this.hideChildBarsOf(selected).then(function() {
          selected.showChildBar();
        });
      }

      this.activeItem = selected;

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
      this.setActive(this.activeTrail);
    }
  };

  return Constructor;

})(jQuery);
