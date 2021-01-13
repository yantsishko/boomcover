define([
  'app',
  'marionette',
  'backbone',
  'underscore',
  'text!templates/widgets/weather/index.ejs',
  'bootstrapcolorpicker',
], function (App, Marionette, Backbone, _, weatherTmpl, bootstrapcolorpicker) {

  'use strict';

  return Marionette.ItemView.extend({
    template: _.template(weatherTmpl),
    events: {
      'change select[name=weather_text_font]': 'changeFont',
      'change select[name=weather_template]': 'changeWeatherTemplate',
      'change select[name=weather_gmt]': 'changeGmt',
      'change select[name=weather_time]': 'changeTime',
      'change input[name=weather_city]': 'changeCity',
      'change input[name=weather_text_register]': 'toggleRegister',
      'change input[name=weather_text_bold]': 'fontBold',
      'change input[name=weather_text_italic]': 'fontItalic',
      'change input[name=weather_text_tiny]': 'fontTiny',
      'change input[name=weather_wind_show]': 'showWind',
      'change input[name=weather_type_show]': 'showType',
      'change input[name=weather_text_after]': 'textAfter',
      'change input[name=weather_text_before]': 'textBefore'
    },
    initialize: function (options) {
      //console.log(this.model);
      this.icons = [
        '01d.png',
        '01n.png',
        '02d.png',
        '02n.png',
        '03d.png',
        '04d.png',
        '04n.png',
        '09d.png',
        '09n.png',
        '10d.png',
        '10n.png',
        '11d.png',
        '11n.png',
        '13d.png',
        '13n.png',
        '50d.png'
      ];
    },
    onRender: function () {
      this.setSliders();

      var self = this;
      this.$el.find('#weather_text_color').colorpicker()
        .on('changeColor', function () {
          self.$el.find('#weather_text_color_p_1').css("background", self.$el.find(this).colorpicker('getValue', '#ffffff'));
          self.model.set('color', self.$el.find(this).colorpicker('getValue', '#ffffff'));
        });
      var resultIcons = '';
      for(var i=0; i<this.icons.length; i++){
        resultIcons += '<li><img src="/imgs/weather_templates/'+ this.model.get('weatherTemplate') +'/'+ this.icons[i] +'"></li>';
      }

      this.$el.find('#weather_icons').html(resultIcons);
    },
    changeGmt: function () {
      var gmt = this.$el.find('[name=weather_gmt]').val();
      this.model.set('gmt', gmt);
    },
    changeTime: function () {
      var time = this.$el.find('[name=weather_time]').val();
      this.model.set('weatherTime', time);
    },
    changeFont: function () {
      var font = this.$el.find('[name=weather_text_font]').val();
      this.model.set('font', font);
    },
    changeWeatherTemplate: function () {
      var weatherT = this.$el.find('[name=weather_template]').val();
      this.model.set('weatherTemplate', weatherT);

      var resultIcons = '';
      for(var i=0; i<this.icons.length; i++){
        resultIcons += '<li><img src="/imgs/weather_templates/'+ this.model.get('weatherTemplate') +'/'+ this.icons[i] +'"></li>';
      }

      this.$el.find('#weather_icons').html(resultIcons);
    },
    changeCity: function () {
      var city = this.$el.find('[name=weather_city]').val();
      this.model.set('city', city);
    },
    fontBold: function (e) {
      if (e.target.checked) {
        this.model.set('fontWeight', '700');
      } else {
        this.model.set('fontWeight', 'none');
      }
    },
    fontItalic: function (e) {
      if (e.target.checked) {
        this.model.set('italic', true);
      } else {
        this.model.set('italic', false);
      }
    },
    fontTiny: function (e) {
      if (e.target.checked) {
        this.model.set('fontWeight', '300');
      } else {
        this.model.set('fontWeight', 'none');
      }
    },
    toggleRegister: function (e) {
      if (e.target.checked) {
        this.model.set('uppercase', true);
      } else {
        this.model.set('uppercase', false);
      }
    },
    showWind: function (e) {
      if (!e.target.checked) {
        this.model.set('showWind', true);
      } else {
        this.model.set('showWind', false);
      }
    },
    showType: function (e) {
      if (!e.target.checked) {
        this.model.set('showType', true);
      } else {
        this.model.set('showType', false);
      }
    },
    textAfter: function (e) {
      this.model.set('textAfter', e.target.value);
    },
    textBefore: function (e) {
      this.model.set('textBefore', e.target.value);
    },
    setSliders: function () {
      var self = this;

      this.$el.find('#weather_text_size').ionRangeSlider({
        type: 'single',
        min: 14,
        max: 80,
        from: self.model.get('size'),
        step: 1,
        postfix: ' px',
        onChange: function (obj) {
          self.model.set('size', obj.from);
        }
      });
    },
    // serializeData: function () {
    //   var model = this.model.toJSON();
    //
    //   return _.extend(model, {
    //     icons: this.icons
    //   });
    // }
  });
});