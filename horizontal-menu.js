(function($) {

  function HorizontalMenu(settings) {
    // store settings for later use
    this.settings = settings;
    this.container = $(settings.container);
    this.items = [];
    this.isOpen = false;
    this.activeTrail = [];
    this.leaveTimer;
  }

  HorizontalMenu.prototype = {
    classes: {
      hasChildren: 'hm-item-has-children',
      activeTrail: 'hm-active-trail'
    },
    init: function() {
      this.setDepth()
        .setItems()
        .setActiveTrail()
        .setCurrent(this.activeTrail, true)
        .bindEvents();
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
        menu.addClass('hm-menu-depth-' + depth);

        var isDepthOdd = depth % 2;
        if (depth > 1 && isDepthOdd) {
          menu.addClass('hm-sub-menu hm-sub-menu-odd');
        } else if (depth > 1) {
          menu.addClass('hm-sub-menu hm-sub-menu-even');
        }
        context = menu;
        menu = setMenu(context);
        depth++;
      }
      return this;
    },
    setItemDepth: function() {
      var depth = 1;

      var setMenu = function(d) {
        return $('.hm-menu-depth-' + d, this.container);
      };

      var menu = setMenu(depth);

      while (menu.length) {
        menu.children()
          .filter('li')
          .addClass('hm-item-depth-' + depth);
        depth++;
        menu = setMenu(depth);
      }
      return this;
    },
    // assign css classes based on how deep a menu and its items sit in the
    //  menu structure, relative to the overall container
    setDepth: function() {
      this.setMenuDepth()
        .setItemDepth();
      return this;
    },
    // only manage menu items that have a child ul. menu items with no children
    // will simply function as links
    setItems: function() {
      var hasChildrenFromSettings = this.settings.classes.hasChildren;
      var items = $('li.' + hasChildrenFromSettings, this.container);
      this.items = items.addClass(this.classes.hasChildren);
      return this;
    },
    setActiveTrail: function() {
      var activeFromSettings = $('.' + this.settings.classes.activeTrail, this.container);
      this.activeTrail = activeFromSettings.addClass(this.classes.activeTrail);
      return this;
    },
    setCurrent: function(item, noDelay) {
      if (noDelay && item.length) {
        this.items.removeClass('hm-current');
        item.addClass('hm-current');
        this.open();
      } else if (item.length) {
        var that = this;
        this.items.removeClass('hm-current');
        item.addClass('hm-current')
          .delay(500)
          .queue(function(next) {
            that.open();
            next();
          });
      } else {
        this.close();
      }
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
    open: function() {
      if (!this.isOpen) {
        this.container.addClass('hm-open');
        this.isOpen = true;
      }
    },
    close: function() {
      if (this.container.hasClass('hm-open')) {
        var that = this;
        this.container.removeClass('hm-open')
          .delay(500)
          .queue(function(next) {
            that.items.filter('.hm-current')
              .removeClass('hm-current');
            that.isOpen = false;
            next();
          });
      }
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
      }
    }, options);

    return this.each(function() {
      var menu = new HorizontalMenu(settings);
      menu.init();
    });
  };

})(jQuery);
