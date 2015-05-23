var Item = (function($) {
  
  var Constructor = function(elem, menu) {
    this.elem = $(elem);
    this.menu = menu;
    this.bars = {
      parent: this.elem.parent(),
      child: $('#hm-child-of-' + this.elem.prop('id'))
    };
  }

  Constructor.prototype = {
    slideChildBar: function() {
      var that = this;
      var slideDistance;
      var b = this.bars.parent.css('bottom');
      var h = this.bars.parent.outerHeight(true);

      if (b === 'auto') {
        slideDistance = h;
      } else {
        slideDistance = (Math.abs(parseInt(b)) + h);
      }

      this.bars.child.animate({
        bottom: slideDistance * -1
      }, 300, function() {
        that.prepareDescendantBars();
      });
    },
    prepareDescendantBars: function() {
      // queue up by position the children of the newly revealed menu
      var items = $('li.' + this.menu.classes.hasChildren, this.bars.child);

      if (items.length) {
        items.each(function() {
          // look up child menus by item ids and set bottom, no animate
        });
      }
    }
  }

  return Constructor;

})(jQuery)
