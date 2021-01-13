define([
    'marionette',
    'underscore',
    'text!templates/accessDenies/index.ejs'
], function (Marionette, _, accessDeniedTmpl) {
    'use strict';

    return Marionette.ItemView.extend({
        template: _.template(accessDeniedTmpl),
        className: "access-denied"
    });

});
