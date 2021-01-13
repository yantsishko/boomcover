define([
  'backbone',
], function (Backbone) {
  return Backbone.Model.extend({
    defaults: {
      //id: null,
      name: 'winner',
      title: 'Победитель',
      imageSize: 100,
      imageX: 0,
      imageY: 0,
      imageFigure: 'square',
      nameSize: 14,
      nameShow: true,
      nameUppercase: false,
      nameFontWeight: 'none',
      nameItalic: false,
      nameFont: 'arial',
      nameColor: '#ffffff',
      nameX: 10,
      nameY: 100,
      absoluteNameX: 10,
      absoluteNameY: 100,
      lnameSize: 14,
      lnameShow: true,
      lnameUppercase: false,
      lnameFontWeight: 'none',
      lnameItalic: false,
      lnameFont: 'Arial',
      lnameColor: '#ffffff',
      isShown: true,
      borderSize: 0,
      borderColor: '#ffffff',
      lnameX: 10,
      lnameY: 120,
      absoluteLNameX: 10,
      absoluteLNameY: 120,
      winnerId: null,
      namePosition: 'separated'
    }
  });
});
