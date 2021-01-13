define([
  'backbone',
], function (Backbone) {
  return Backbone.Model.extend({
    defaults: {
      name: 'url',
      title: 'Текст по ссылке',
      size: 14,
      uppercase: false,
      fontWeight: 'none',
      italic: false,
      font: 'arial',
      color: '#ffffff',
      url: '',
      text: 'Текст по ссылке',
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