var Item = (function($) {

  var Constructor = function(elem, menuElem) {
    this.elem = $(elem);
    this.id = this.elem.prop('id');
    this.menuElem = menuElem;
    this.parentBar = this.elem.parent();
    this.childBar = $('#hm-child-of-' + this.id);
  }

  Constructor.prototype = {
    showChildBar: function() {
      var childBar = new Bar('ul#hm-child-of-' + this.id, this.menuElem);
      childBar.show();
    },
    hasSameIdAs: function(item) {
      return this.id === item.id;
    },
    isAncestorOf: function(item) {
      // method self inclusive, i.e. returns true if comparing object to itself
      var compare = function(anc, desc) {
        var haveSameParentBar = anc.parentBar.prop('id') === desc.parentBar.prop('id');

        if (haveSameParentBar) {
          return anc.hasSameIdAs(desc);
        } else {
          var closest = desc.getClosestItem();
          return compare(anc, closest);
        }
      }

      return compare(this, item);
    },
    isChildItemOf: function(item) {
      var isChild = false;
      var c = this.getClosestItem();

      if (c !== null) {
        isChild = c.hasSameIdAs(item);
      }

      return isChild;
    },
    getClosestItem: function() {
      var pid = this.parentBar.prop('id');
      var c = null;

      if (pid !== '') {
        var closestItemId = pid.replace('hm-child-of-', '');
        var c = new Item('li#' + closestItemId, this.menuElem);
      }

      return c;
    },
    isSiblingTo: function(item) {
      return this.parentBar.prop('id') === item.parentBar.prop('id');
    },
    getAncestorByBar: function(barId) {
      var checkClosestBar = function(item) {
        var c = item.getClosestItem();
        if (c.parentBar.prop('id') === barId) {
          return c;
        } else {
          return checkClosestBar(c);
        }
      }
      return checkClosestBar(this);
    },
    // we alredy know selected is not ancestor of active
    //

    // relic, the real should be isDescendantOf given primary level item
    // isDescendantOf: function(elem) {
    //   var compare = function(i) {
    //     if (i.parent().hasClass('hm-bar-primary')) {
    //       return i.prop('id') === elem.prop('id');
    //     } else {
    //       var pid = i.parent().prop('id');
    //       return compare($('li#' + pid.replace('hm-child-of-', '')));
    //     }
    //   }
    //
    //   return compare(this.elem);
    // },
  }

  return Constructor;

})(jQuery)
