(function($) {

  $.fn.horizontalMenu = function(options) {

    var settings = $.extend({
      container: this,
      classes: {
        hasChildren: 'expanded',
        activeTrail: 'is-active-trail'
      },
      numMenus: 1,
      onInit: function() {},
      onOpen: function() {},
      onClose: function() {}
    }, options);

    return this.each(function() {
      var menu = new Menu(settings);
      menu.init();
    });
  };

})(jQuery);
