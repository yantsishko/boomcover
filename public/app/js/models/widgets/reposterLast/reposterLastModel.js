define([
  'backbone',
], function (Backbone) {
  return Backbone.Model.extend({
    defaults: {
      //id: null,
      name: 'reposterLast',
      title: 'Посл. репостер',
      imageSize: 100,
      borderSize: 0,
      borderColor: '#ffffff',
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
      nameX: 110,
      nameY: 20,
      absoluteNameX: 110,
      absoluteNameY: 20,
      lnameSize: 14,
      lnameShow: true,
      lnameUppercase: false,
      lnameFontWeight: 'none',
      lnameItalic: false,
      lnameFont: 'Arial',
      lnameColor: '#ffffff',
      isShown: true,
      lnameX: 110,
      lnameY: 50,
      absoluteLNameX: 110,
      absoluteLNameY: 50,
      namePosition: 'separated'
    }
  });
});
