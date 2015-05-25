var HorizontalMenu = (function($) {

  var Constructor = function(settings) {
    // store settings for later use
    this.settings = settings;
    this.container = $(settings.container);
    this.items = [];
    this.status = 'closed';
    this.hasCurrentSubItem = false;
    this.activeItemPrimary;
    this.activeTrail = [];
    this.leaveTimer;
  }

  Constructor.prototype = {
    classes: {
      hasChildren: 'hm-item-has-children',
      activeTrail: 'hm-active-trail'
    },

    init: function() {
      // which methods should be blocking?
      // which should be async?
      this.setParentItems()
        .setActiveTrail()
        .setItemIds()
        .setMenuDepth()
        .setMenuIds()
        .explodeBars()
        .bindEvents()
        .setCurrent(this.activeTrail, true)
        .settings.onInit(this);
    },
    // only manage menu items that have a child ul. menu items with no children
    // will simply function as links
    setParentItems: function() {
      var settingsClass = this.settings.classes.hasChildren;
      var items = $('li.' + settingsClass, this.container);
      this.items = items.addClass(this.classes.hasChildren);
      return this;
    },
    setItemIds: function() {
      var items = $('li.' + this.classes.hasChildren);
      // this could be passed to the Item prototype
      items.each(function() {
        var id = $.uuid();
        $(this).prop('id', id);
      });
      return this;
    },
    setMenuDepth: function() {
      var context = this.container;
      var depth = 1;

      var setMenu = function(context) {
        var m;
        if (context.prop('tagName') === 'UL') {
          m = $('> li > ul', context);
        } else {
          m = context.children().filter('ul');
        }
        return m;
      };

      var menu = setMenu(context);

      while (menu.length) {
        var isDepthOdd = depth % 2;

        if (depth === 1) {
          menu.addClass('hm-bar-primary');
        } else {
          menu.addClass('hm-bar-sub');
        }

        if (depth > 1 && isDepthOdd) {
          menu.addClass('hm-bar-sub hm-bar-sub-odd');
        } else if (depth > 1) {
          menu.addClass('hm-bar-sub hm-bar-sub-even');
        }

        // apply descending z-index to menus stack behind parents
        menu.css('z-index', depth * - 1);

        context = menu;
        menu = setMenu(context);
        depth++;
      }
      return this;
    },
    setMenuIds: function() {
      var m = $('ul', this.container).not('.hm-bar-primary');
      m.each(function() {
        var parentId = $(this).parent().prop('id');
        $(this).prop('id', 'hm-child-of-' + parentId);
      });
      return this;
    },
    explodeBars: function() {
      var b = $('ul').not('.hm-bar-primary')
      $('.horizontal-menu').append(b);
      return this;
    },
    setActiveTrail: function() {
      var activeFromSettings = $('.' + this.settings.classes.activeTrail, this.container);
      this.activeTrail = activeFromSettings.addClass(this.classes.activeTrail);
      return this;
    },
    setCurrent: function(item, noDelay) {

      if (!item.length) { return this; }

      var that = this;
      var i = new Item(item, this);

      if (this.status === 'closed') {
        // show (slide) the child bar of item
        // set status to shallow
        i.showChildBar(this.status);
        this.status = 'shallow';
        this.activeItemPrimary = item;
      } else if (this.status === 'shallow' && i.isDescendantOf(this.activeItemPrimary)) {
        // show (slide) the child bar of item and set status to deep
        i.showChildBar(this.status);
        this.status = 'deep';
      } else if (this.status === 'shallow') {
        // dismiss current primary, show child bar of item, status stays shallow
      } else {
        // if deep,
      }

      // if (noDelay && ci.length) {
      //   // does this matter anymore since there is no longer just one 'current' item?
      //   this.items.removeClass('hm-current');
      //   ci.addClass('hm-current');
      //   this.open(ci.parent());
      // } else if (ci.length) {
      //   var that = this;
      //   // this.items.removeClass('hm-current');
      //   // get item and ancestors in array, ordered by anscestry (desc)
      //
      //   // var ancestry = item.parents('li').get().reverse();
      //   // ancestry.push(item.get(0));
      //   // $(ancestry).each(function() {
      //   //   $(this).addClass('woofer')
      //   //     .delay(2000 )
      //   //     .queue(function(next) {
      //   //       next();
      //   //     });
      //   // });
      //
      //   item.addClass('hm-current')
      //     .delay(500)
      //     .queue(function(next) {
      //       that.open(ci.parent());
      //       next();
      //     });
      // } else {
      //   this.close();
      // }
      return this;
    },
    bindEvents: function() {
      var that = this;
      this.items
        .children('a')
        .on('click', function(event) {
          // instead of following primary link menu, show it's children
          event.preventDefault();
          that.setCurrent($(this).parent());
        });

      // reset active trail, close the menu when mousing away from open menu
      // with no active trail
      this.container.on('mouseleave', function() {
        that.leaveTimer = setTimeout(function() {
          that.reset();
        }, 1000);
      });

      // allows user to quickly navigate away and right back to menu without
      // resetting current menu item
      this.container.on('mouseenter', function() {
        if (typeof that.leaveTimer !== 'undefined') {
          clearTimeout(that.leaveTimer);
        }
      });
      return this;
    },
    // open: function(status) {
    //   // this class may not be needed
    //   // this.container.addClass('hm-open');
    //   this.status = status;
    //   this.settings.onOpen(this);
    //   return this;
    // },
    close: function() {
      // if (this.container.hasClass('hm-open')) {
      //   var that = this;
      //   this.container.removeClass('hm-open')
      //     .delay(500)
      //     .queue(function(next) {
      //       that.items.filter('.hm-current')
      //         .removeClass('hm-current');
      //       // that.isOpen = false;
      //       that.settings.onClose(this);
      //       next();
      //     });
      // }
    },
    reset: function() {
      this.setCurrent(this.activeTrail);
    }
  };

  $.fn.horizontalMenu = function(options) {

    var settings = $.extend({
      container: this,
      classes: {
        hasChildren: 'expanded',
        activeTrail: 'is-active-trail'
      },
      onInit: function() {},
      onOpen: function() {},
      onClose: function() {},
    }, options);

    return this.each(function() {
      var menu = new HorizontalMenu(settings);
      menu.init();
    });
  };

  return Constructor;

})(jQuery);
