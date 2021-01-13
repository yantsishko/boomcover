define([
  'backbone',
], function (Backbone) {
  return Backbone.Model.extend({
    defaults: {
      //id: null,
      name: 'reposterDay',
      title: 'Репостер дня',
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
      nameFont: 'Arial',
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
      minReposts: 0,
      changeTime: '',
      isShown: true,
      lnameX: 110,
      lnameY: 50,
      absoluteLNameX: 110,
      absoluteLNameY: 50,
      repostsCountShow: true,
      absoluteRepostsCountX: 110,
      absoluteRepostsCountY: 80,
      repostsCountX: 110,
      repostsCountY: 80,
      reposterIconColor: 'blue',
      namePosition: 'separated'
    }
  });
});