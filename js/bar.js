var Bar = (function($) {

  var Constructor = function(elem, menuElem) {
    this.elem = $(elem);
    this.id = this.elem.prop('id');
    this.menuElem = menuElem;
    this.parent = getParent(this.id, this.menuElem);
  }

  Constructor.prototype = {
    updateStatus: function(s) {
      var that = this;
      var classList = this.elem.attr('class').split(/\s+/);
      var current;

      $.each(classList, function(i, val) {
        if(val.match(/hm-bar-status-/)) {
          that.elem.removeClass(val);
        }
        that.elem.addClass('hm-bar-status-' + s);
      });
      return this;
    },
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
          that.updateStatus('show')
            .dismiss()
            .musterChildren();
          // dismiss all bars that are ready (before mustering children), they don't need to linger around

        }
      });
    },
    hide: function(anim) {
      var that = this;
      var b = parseInt(this.elem.css('bottom'));
      var h = this.elem.outerHeight(true);

      var slideDistance = b + h;

      this.elem.animate({
        bottom: slideDistance
      }, {
        duration: anim ? 0 : 300,
        complete: function() {
          that.updateStatus('ready')
            .dismiss();
          }
      })
    },
    dismiss: function() {
      var readyClass = 'hm-bar-status-ready';
      var bars = $('.' + readyClass, this.menuElem);
      bars.removeClass(readyClass)
        .css({
          bottom: 0
        });
      return this;
    },
    musterChildren: function() {
      // queue up - by position - the children of the newly revealed bar
      // so they'll be ready to animate themselves if their parent li is set to active
      var that = this;
      var childItems = $('li.' + MenuClasses.hasChildren, this.elem);

      // is it necessary to update status on the proto, OR could this just be handled via classes so that these objects don't need to be inited?
      if (childItems.length) {
        childItems.each(function() {
          var b = new Bar('#hm-child-of-' + $(this).prop('id'), that.menuElem);
          b.elem.css({
            bottom: that.elem.css('bottom')
          });
          b.updateStatus('ready');
        });
      }
    },
  }

  function getParent(id, menuElem) {
    var itemId = id.replace('hm-child-of-', '');
    var parent = $('li#' + itemId, menuElem).parent();
    return parent;
  }

  return Constructor;

})(jQuery);