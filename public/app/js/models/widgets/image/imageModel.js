define([
  'backbone',
], function (Backbone) {
  return Backbone.Model.extend({
    defaults: {
      name: 'image',
      title: 'Изображение по ссылке',
      size: 100,
      file_url: '',
      isShown: true,
      imageX: 110,
      imageY: 20,
      predifined_file: 'head_moroz'
    }
  });
});