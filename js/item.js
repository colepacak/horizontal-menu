var Item = (function($) {

  var Constructor = function(elem, menuElem) {
    this.elem = $(elem);
    this.id = this.elem.prop('id');
    this.menuElem = menuElem;
    this.parentBar = this.elem.parent();
    this.childBar = $('#hm-child-of-' + this.id);
  };

  Constructor.prototype = {
    showChildBar: function(animOp) {
      var childBar = new Bar('ul#hm-child-of-' + this.id, this.menuElem);
      childBar.show(animOp);
    },
    hasShownChildBars: function() {
      return this.childBar.hasClass('hm-bar-status-show');
    },
    isSameElemAs: function(item) {
      return this.id === item.id;
    },
    isAncestorOf: function(item) {
      // method is not self-inclusive
      if (this.isSameElemAs(item)) {
        return false;
      } else {
        return compare(this, item);
      }

      function compare(anc, desc) {
        var haveSameParentBar = anc.parentBar.prop('id') === desc.parentBar.prop('id');

        if (haveSameParentBar) {
          return anc.isSameElemAs(desc);
        } else {
          var closest = desc.getClosestItem();
          return compare(anc, closest);
        }
      }
    },
    isChildOf: function(item) {
      var isChild = false;
      var c = this.getClosestItem();

      if (c !== null) {
        isChild = c.isSameElemAs(item);
      }

      return isChild;
    },
    getClosestItem: function() {
      var pid = this.parentBar.prop('id');
      var c = null;

      if (pid !== '') {
        var closestItemId = pid.replace('hm-child-of-', '');
        c = new Item('li#' + closestItemId, this.menuElem);
      }

      return c;
    },
    isSiblingTo: function(item) {
      var hasSameParent = this.parentBar.prop('id') === item.parentBar.prop('id');
      return hasSameParent && !this.isSameElemAs(item);
    },
    getAncestorByBar: function(barId) {
      var checkClosestBar = function(item) {
        var c = item.getClosestItem();
        if (c.parentBar.prop('id') === barId) {
          return c;
        } else {
          return checkClosestBar(c);
        }
      };
      return checkClosestBar(this);
    },
    getRelationshipTo: function(item) {
      var relationship;

      if (this.isSameElemAs(item)) {
        relationship = 'self';
      } else if (this.isChildOf(item)) {
        relationship = 'child';
      } else if (this.isSiblingTo(item)) {
        relationship = 'sibling';
      } else if (this.isAncestorOf(item)) {
        relationship = 'ancestor';
      } else {
        relationship = 'nonAncestor';
      }

      return relationship;
    }
  };

  return Constructor;

})(jQuery);
