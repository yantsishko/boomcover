define([
  'app',
  'marionette',
  'backbone',
  'underscore',
  'pace',
  'text!templates/history/index.ejs',
  'jquery',
  'daterangepicker',
  'moment'
], function (App, Marionette, Backbone, _, pace, historyTmpl, $, daterangepicker, moment) {
  'use strict';

  return Marionette.LayoutView.extend({
    template: _.template(historyTmpl),
    initialize: function () {
      this.model.set('userBCHistory', null);
      var self = this;
      Backbone.$.ajax({
        async: false,
        url: App.url + '/api/v1/history',
        success: function (history) {
          self.model.set('userBCHistory', history);
        },
        error: function (err) {
          if (err.status == 401) {
            window.location = '/login';
          }
        }
      });
    },
    ui: {
      minDatePicker: '#daterange-btn'
    },
    events: {},
    onRender: function () {
      this.ui.minDatePicker.daterangepicker(
        {
          ranges: {
            'Текущий месяц': [moment().startOf('month'), moment().endOf('month')],
            'Предыдущий месяц': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
          },
          startDate: moment().subtract(29, 'days'),
          endDate: moment()
        },
        function (start, end) {
          $('#daterange-btn span').html(start.format('MMMM D, YYYY') + ' - ' + end.format('MMMM D, YYYY'));
        }
      );
    }
  });

});
