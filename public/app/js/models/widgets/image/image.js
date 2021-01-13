define([
  'app',
  'marionette',
  'backbone',
  'underscore',
  'text!templates/widgets/image/index.ejs',
  'bootstrapcolorpicker',
  'datetimepicker',
  'moment',
  'notify',
  'rangeslider'
], function (App, Marionette, Backbone, _, imageTmpl, bootstrapcolorpicker, datetimepicker, moment, notify, rangeslider) {

  'use strict';

  return Marionette.ItemView.extend({
    template: _.template(imageTmpl),
    events: {
      'change input[name=image_url]': 'url',
      'change input[name=image_size]': 'size',
      'click .image-sticker': 'sticker',
    },
    initialize: function (options) {

      // var _self = this;
      // Backbone.$.ajax({
      //   url: '/api/v1/file/list',
      //   async: false,
      //   success: function (resData) {
      //     _self.images = resData.data;
      //     console.log(_self.images);
      //   },
      //   error: function (err) {
      //
      //   }
      // });
      // console.log('222',_self.images);
      // Backbone.$.ajax({
      //   url: '/api/v1/file/' + _self.images[0],
      //   async: false,
      //   type: 'GET',
      //   success: function (resData) {
      //     console.log('3',resData);
      //   },
      //   error: function (err) {
      //
      //   }
      // });
    },
    onRender: function () {
      this.setSliders();

    },
    onShow: function () {
      // Backbone.$('#file-upload-sticker').on('change', function (e) {
      //   this.uploadFile(e.target.files[0]);
      //   Backbone.$('#file-upload-sticker').val('');
      // }.bind(this));
    },
    uploadFile: function (file) {
      if (file.size > 3072000) {
        Backbone.$.notify("Размер файла до 3х мб", "warn");
      } else {
        var _URL = window.URL || window.webkitURL;

        var img = new Image();
        img.onload = function () {
          var formData = new FormData();
          formData.append('file', file);

          Backbone.$.ajax({
            method: "POST",
            processData: false,
            contentType: false,
            data: formData,
            url: App.url + '/api/v1/file',
            success: function (resp) {
              console.log(resp);
            },
            error: function (err) {
              Backbone.$.notify("Произошла ошибка", "error");
              if (err.status == 401) {
                window.location = '/login';
              }
            }
          });
        };
        img.src = _URL.createObjectURL(file);
      }
    },
    url: function (e) {
      this.model.set('file_url', e.target.value);
    },
    sticker: function (e) {
      this.model.set('predifined_file', e.target.id);
    },
    setSliders: function () {
      var self = this;

      this.$el.find('#image_size').ionRangeSlider({
        type: 'single',
        min: 0,
        max: 200,
        from: self.model.get('size'),
        step: 1,
        postfix: ' px',
        onChange: function (obj) {
          self.model.set('size', obj.from);
        }
      });
    }
  });
});