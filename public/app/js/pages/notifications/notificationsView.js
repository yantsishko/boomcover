define([
  'app',
  'marionette',
  'backbone',
  'underscore',
  'pace',
  'text!templates/notifications/index.ejs'
], function (App, Marionette, Backbone, _, pace, notificationsTmpl) {
  'use strict';

  return Marionette.LayoutView.extend({
    template: _.template(notificationsTmpl),
    ui: {},
    events: {},
    onShow: function () {

    }
  });

});
