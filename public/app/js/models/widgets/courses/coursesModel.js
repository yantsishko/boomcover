define([
  'backbone',
], function (Backbone) {
  return Backbone.Model.extend({
    defaults: {
      //id: null,
      name: 'currency',
      title: 'Курс валют',
      size: 14,
      uppercase: false,
      fontWeight: 'none',
      italic: false,
      font: 'arial',
      color: '#ffffff',
      isShown: true,
      currencyFrom: 'USD',
      currencyFromShowType: 'sign',
      currencyFromX: 65,
      currencyFromY: 10,
      currencyTo: 'RUB',
      currencyToShowType: 'sign',
      currencyToX: 65,
      currencyToY: 30,
      currencyFromShow: true,
      currencyFromShowTypePosition: 'before',
      currencyToShowTypePosition: 'before',
      currencyToPrecision: 2
    }
  });
});