define([
    'app',
    'marionette',
    'js/models/widgets/activeWidgets/itemView'
], function (App, Marionette, itemView) {

    'use strict';

    return Marionette.CollectionView.extend({
        childView: itemView,
        onChildviewSelectItem: function(childView) {
            this.triggerMethod('settings:show', childView);
        },
        onChildviewDeleteItem: function(childView) {
            this.collection.remove(childView.model);
        }
    });
});