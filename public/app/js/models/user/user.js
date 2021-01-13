define([
    'backbone',
], function (Backbone) {
    return Backbone.Model.extend({

        urlRoot: '/user',

        defaults: {
            id: null,
            name: null
        }
    });
});