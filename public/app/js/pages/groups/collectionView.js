define([
    'app',
    'marionette',
    'backbone',
    'underscore',
    './groupView'
], function (App, Marionette, Backbone, _, groupView) {
    'use strict';

    return Marionette.CollectionView.extend({
        emptyView: false,
        childView: groupView,
        childViewOptions: function () {
            return this.options.template ? { templateName: 'constructor' } : { templateName: 'main' };
        }
    });

});