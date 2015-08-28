var MenuClasses = (function($) {

  var Constructor = function(hasChildren) {
    this.hasChildren = 'hm-item-has-children';
    this.activeTrail = 'hm-active-trail';
  };

  return new Constructor();

})(jQuery);
