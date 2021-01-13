define([
  'app',
  'backbone'
], function (App, Backbone) {
  var data = null;
  var _getData = function (url) {
    Backbone.$.ajax({
      async: false,
      url: url,
      success: function (resData) {
        data = resData;
      },
      error: function (err) {
        data = 'error';
        if (err.status == 401) {
          window.location = '/login';
        }
      }
    });

    return data;
  };

  return {
    getData: _getData
  }
});