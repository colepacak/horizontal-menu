var Bar = (function($) {

  var Constructor = function(elem, menuElem) {
    this.elem = $(elem);
    this.id = this.elem.prop('id');
    this.menuElem = menuElem;
    this.parent = getParent(this.id, this.menuElem);
    this.classHasChildren = classHasChildren;
    isOpen = false;
  }

  Constructor.prototype = {
    show: function(anim) {
      var that = this;
      var slideDistance;
      var b = this.parent.css('bottom');
      var h = this.parent.outerHeight(true);

      if (b === 'auto') {
        slideDistance = h;
      } else {
        slideDistance = (Math.abs(parseInt(b)) + h);
      }

      this.elem.animate({
        bottom: slideDistance * -1
      }, {
        duration: anim ? 0 : 300,
        complete: function() {
          that.muster();
        }
      });
    },
    muster: function() {
      // queue up - by position - the children of the newly revealed bar
      // so they'll be ready to animate themselves if their parent li is set to active
      var that = this;
      var items = $('li.' + MenuClasses.hasChildren, this.childBar);

      if (items.length) {
        items.each(function() {
          $('#hm-child-of-' + $(this).prop('id')).css({
            bottom: that.childBar.css('bottom')
          });
        });
      }
    },
  }

  function getParent(id, menuElem) {
    var itemId = id.replace('hm-child-of-', '');
    var parentBar = $('li#' + itemId, menuElem).parent();
    return $(parentBar.prop('id'), menuElem);
  }

  return Constructor;

})(jQuery);
