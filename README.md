Horizontal Menu
===============

How it works:

* Click to activate
* The crux of the library is the relationship between active and selected menu items. Their relationship determines how child menus are shown or hidden.
  * Selected item is child of active item: show child bar of selected.
  * Selected item is ancestor of active item: hide all child bars of active.
  * Selected item is sibling of active item: show child bar of selected, no slide.
  * Selected item is the same as active bar: hide child bar of active.
  * Selected item is a non-ancestor of active bar: hide child bars of active and show child bar of selected.

Depedencies:
* Bower: run `bower install` to grab JS dependencies
* NPM: run `npm install` to grab gulp-related dependencies in order to compile CSS

Options:
* hasChildren: the name of the CSS class that indicates whether a menu item has children
* activeTrail: the name of the CSS class that indicates a menu item is part of the active trail

Callbacks:
* onInit
* onOpen
* onClose

TODO:
* Show active trail
  * Setting the active trail on active needs to be promise driven since the
  height of ancestor bars dictate bar placement
