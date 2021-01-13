define([
  'backbone',
], function (Backbone) {
  return Backbone.Model.extend({
    defaults: {
      name: 'statistic',
      title: 'Статистика группы',
      size: 14,
      uppercase: false,
      fontWeight: 'none',
      italic: false,
      font: 'arial',
      color: '#ffffff',
      text: '',
      isShown: true,
      textX: 110,
      textY: 20,
      showTextTime: false,
      textStart: null,
      textEnd: null,
      gmt: '3',
      type: 'subscribers_count'
    }
  });
});