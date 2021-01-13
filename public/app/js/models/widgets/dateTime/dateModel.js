define([
  'backbone',
], function (Backbone) {
  return Backbone.Model.extend({
    defaults: {
      //id: null,
      name: 'date',
      title: 'Дата и время',
      size: 14,
      uppercase: false,
      fontWeight: 'none',
      italic: false,
      font: 'arial',
      color: '#ffffff',
      textBefore: '',
      textAfter: '',
      gmt: '3',
      format: 'DD.MM.YYYY HH:mm',
      isShown: true,
      dateX: 110,
      dateY: 50
    }
  });
});