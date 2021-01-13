define([
  'backbone',
  'marionette',
  'js/pages/navCollection',
  'mainLayout'
], function (Backbone, Marionette, Navigation, mainLayout) {

  var App = new Marionette.Application();

  App.pages = new Navigation([
    {name: "groups"},
    {name: "price"},
    {name: "notifications"},
    {name: "partners"},
    {name: "constructor"},
    {name: "history"}
  ]);

  var token = localStorage.getItem('token');

  if (token) {
    Backbone.$.ajaxSetup({
      headers: {
        'Authorization': 'Bearer ' + token,
      }
    });
  }

  App.addRegions({
    main: '#main'
  });

  App.url = window.location.origin;

  App.on("start", function (data) {
    if (Backbone.history) {
      data = data || {};
      data.pushState = true;
      Backbone.history.start(data);
    }
  });

  mainLayout.updateUserData();

  return App;
});