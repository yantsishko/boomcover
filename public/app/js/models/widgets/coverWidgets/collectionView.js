define([
  'app',
  'marionette',
  'js/models/widgets/coverWidgets/itemView'
], function (App, Marionette, itemView) {

  'use strict';

  return Marionette.CollectionView.extend({
    childView: itemView,
    onChildviewSelectItem: function (childView) {
      this.triggerMethod('settings:show', childView);
    }
  });
});