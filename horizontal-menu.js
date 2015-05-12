(function($) {

  function HorizontalMenu(settings) {
    // store settings for later use
    this.settings = settings;
    this.container = $(settings.container);
    this.classes = {
      hasChildren: 'hm-item-has-children',
      activeTrail: 'hm-active-trail'
    };
    this.items = {};
    this.leaveTimer;
    this.isOpen = false;
    // elements
    // this.items.primary = [];
    // set after plugin classes are in place
    // this.items.primary = $('> ul > li.' + this.classes.hasChildren, this.container);
    // this.items.secondary = [];
    // set after plugin classes are in place
    // this.items.secondary = this.items.primary.find('> ul > li');

    // set after plugin classes are in place
    // this.primaryActiveTrail = this.items.primary.filter('.' + this.classes.activeTrail);
  }

  HorizontalMenu.prototype = {
    init: function() {
      this.setCssClasses();
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
    setParentItems: function() {
      var settingsClass = this.settings.classes.hasChildren;

      $('li.' + settingsClass, this.container).addClass(this.classes.hasChildren);
      return this;
    },
    setCssClasses: function() {
      this.setMenuDepth()
        .setItemDepth()
        .setParentItems();
      return this;
    },
    // setItems: function() {
    //   // items, primary and secondary, and primaryActiveTrail
    // },
    // open: function() {
    //   if (!this.isOpen) {
    //     this.container.addClass('hm-open');
    //     this.isOpen = true;
    //   }
    // },
    // close: function() {
    //   if (this.container.hasClass('hm-open')) {
    //     var that = this;
    //     this.container.removeClass('hm-open')
    //       .delay(500)
    //       .queue(function(next) {
    //         that.items.primary.filter('.hm-item-current')
    //           .removeClass('hm-item-current');
    //         that.isOpen = false;
    //         next();
    //       });
    //   }
    // },
    // reset: function() {
    //   this.setCurrentItem(this.primaryActiveTrail);
    // },
    // setCurrentItem: function(item, noDelay) {
    //   if (noDelay) {
    //     this.items.primary.removeClass('hm-item-current');
    //     item.addClass('hm-item-current');
    //     this.open();
    //   } else if (item.length) {
    //     var that = this;
    //     this.items.primary.removeClass('hm-item-current');
    //     item.addClass('hm-item-current')
    //       .delay(500)
    //       .queue(function(next) {
    //         that.open();
    //         next();
    //       });
    //   } else {
    //     this.close();
    //   }
    // }
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

      // initially use active trail as current item, no slide
      // if (menu.primaryActiveTrail.length > 0) {
      //   menu.setCurrentItem(menu.primaryActiveTrail, true);
      // }
      //
      // // event handlers
      // menu.items.primary
      //   .children('a')
      //   .on('click', function(event) {
      //     // instead of following primary link menu, show it's children
      //     event.preventDefault();
      //     menu.setCurrentItem($(this).parent());
      //   });
      //
      // // reset active trail, close the menu when mousing away from open menu with no active trail
      // menu.container.on('mouseleave', function() {
      //   menu.leaveTimer = setTimeout(function() {
      //     menu.reset();
      //   }, 1000);
      // });
      //
      // // allows user to quickly navigate away and right back to menu
      // menu.container.on('mouseenter', function() {
      //   if (typeof menu.leaveTimer !== 'undefined') {
      //     clearTimeout(menu.leaveTimer);
      //   }
      // });
    });
  };

})(jQuery);
