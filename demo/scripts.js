$(function() {
  $('.horizontal-menu').horizontalMenu({
    onInit: function(menu) {
      console.log('on init');
    },
    onOpen: function(menu) {
      console.log('on open');
    },
    onClose: function(menu) {
      console.log('on close');
    }
  });
});
