define([
  'backbone',
], function (Backbone) {
  return Backbone.Model.extend({
    defaults: {
      name: 'text',
      title: 'Текст',
      size: 14,
      uppercase: false,
      fontWeight: 'none',
      italic: false,
      font: 'arial',
      color: '#ffffff',
      text: 'Виджет текста',
      isShown: true,
      textX: 110,
      textY: 20,
      showTextTime: false,
      textStart: null,
      textEnd: null,
      gmt: '3'
    }
  });
});