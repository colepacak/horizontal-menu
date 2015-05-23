var Item = (function($) {

  var Constructor = function(elem, menu) {
    this.elem = $(elem);
    this.menu = menu;
    this.parentBar = this.elem.parent();
    this.childBar = $('#hm-child-of-' + this.elem.prop('id'));
  }

  Constructor.prototype = {
    slideChildBar: function() {
      var that = this;
      var slideDistance;
      var b = this.parentBar.css('bottom');
      var h = this.parentBar.outerHeight(true);

      if (b === 'auto') {
        slideDistance = h;
      } else {
        slideDistance = (Math.abs(parseInt(b)) + h);
      }

      this.childBar.animate({
        bottom: slideDistance * -1
      }, 300, function() {
        that.gatherDescendantBars();
      });
    },
    gatherDescendantBars: function() {
      // queue up - by position - the children of the newly revealed menu
      var that = this;
      var items = $('li.' + this.menu.classes.hasChildren, this.childBar);

      if (items.length) {
        items.each(function() {
          $('#hm-child-of-' + $(this).prop('id')).css({
            bottom: that.childBar.css('bottom')
          });
        });
      }
    }
  }

  return Constructor;

})(jQuery)
