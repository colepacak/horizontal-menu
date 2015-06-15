Horizontal Menu
===============

Goals:
* click to activate
* show active trail
* new depths are revealed using slide animation
* make options so that menu is framework-agnostic
* include a few event callbacks

TODO:
* ~~have js add helper classes to primary and secondary menus to avoid overuse of direct descendent selector~~
* ~~clean up styling~~
* ~~apply css classes based on options~~
* ~~add namespaced active trail class~~
* ~~integrate event handlers into class definition~~
* ~~add event callbacks~~
* allow multiple depths of items

Multiple Depth Work Flow
* ~~li's with children~~
  * ~~css class of hm-item-has-children~~
  * ~~identity active trail~~
  * ~~give uuid as css id~~
* ~~menus (css class)~~
  * ~~top level vs sub menu~~
  * ~~if sub, even or odd~~
  * ~~child of unique li~~
  * somehow provide descending z-indexes
* ~~explode menus so that they are all siblings and direct children of container~~
* ~~child menus need to be flush bottom with their parent li's parent menu, on init or when parent has moved~~
* dismissing
  * ~~add a css prop on bars for shown~~
  * then, when an item needs to dismiss its child bars, just get the ones that are open, order by depth, reverse,
  * each one, slides up its one height, and is then dismissed
