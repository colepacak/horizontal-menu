var Item = (function($) {

  var Constructor = function(elem, menu) {
    this.elem = $(elem);
    this.menu = menu;
    this.parentBar = this.elem.parent();
    this.childBar = $('#hm-child-of-' + this.elem.prop('id'));
  }

  Constructor.prototype = {
    showChildBar: function() {
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
      }, {
        duration: 300,
        complete: function() {
          that.gatherDescendantBars();
        }
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
    },
    isDescendantOf: function(elem) {
      var compare = function(i) {
        if (i.parent().hasClass('hm-bar-primary')) {
          return i.prop('id') === elem.prop('id');
        } else {
          var pid = i.parent().prop('id');
          return compare($('li#' + pid.replace('hm-child-of-', '')));
        }
      }

      return compare(this.elem);
    }
  }

  return Constructor;

})(jQuery)
