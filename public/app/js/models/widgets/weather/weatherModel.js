define([
  'backbone',
], function (Backbone) {
  return Backbone.Model.extend({
    defaults: {
      //id: null,
      name: 'weather',
      title: 'Погода',
      size: 14,
      uppercase: false,
      fontWeight: 'none',
      italic: false,
      font: 'arial',
      color: '#ffffff',
      city: '',
      textBefore: '',
      textAfter: '°C',
      showWind: false,
      showType: true,
      isShown: true,
      weatherX: 0, //pos of icon X
      weatherY: 0, //pos of icon Y
      //new
      weatherTemplate: 'touch',
      weatherTypeX: 65,
      weatherTypeY: 10,
      absoluteWeatherTypeX: 65,
      absoluteWeatherTypeY: 10,
      weatherWindX: 65,
      weatherWindY: 10,
      absoluteWeatherWindX: 65,
      absoluteWeatherWindY: 30,
      gmt: '3',
      weatherTime: 'today'
    }
  });
});