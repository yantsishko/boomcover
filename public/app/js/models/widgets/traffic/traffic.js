define([
  'app',
  'marionette',
  'backbone',
  'underscore',
  'text!templates/widgets/traffic/index.ejs',
  'bootstrapcolorpicker',
  'bootstrapselect'
], function (App, Marionette, Backbone, _, trafficTmpl, bootstrapcolorpicker, bootstrapselect) {

  'use strict';

  return Marionette.ItemView.extend({
    template: _.template(trafficTmpl),
    events: {
      'change select[name=text_font]': 'changeFont',
      'change select[name=region]': 'changeCity',
      'change select[name=icon_size]': 'changeIconSize',
      'change input[name=text_register]': 'toggleRegister',
      'change input[name=text_bold]': 'fontBold',
      'change input[name=text_italic]': 'fontItalic',
      'change input[name=text_tiny]': 'fontTiny',
      'change select[name=text_counter_font]': 'changeCounterFont',
      'change input[name=text_counter_register]': 'toggleCounterRegister',
      'change input[name=text_counter_bold]': 'fontCounterBold',
      'change input[name=text_counter_italic]': 'fontCounterItalic',
      'change input[name=text_counter_tiny]': 'fontCounterTiny',
      'change input[name=icon_show]': 'hideIcon',
      'change input[name=text_show]': 'hideText',
      'change input[name=mark_show]': 'hideMark',
      'change input[name=mark_counter_show]': 'hideMarkCounter',
      'change input[name=text0]': 'changeText0',
      'change input[name=text1]': 'changeText1',
      'change input[name=text2]': 'changeText2',
      'change input[name=text3]': 'changeText3',
      'change input[name=text4]': 'changeText4',
      'change input[name=text5]': 'changeText5',
      'change input[name=text6]': 'changeText6',
      'change input[name=text7]': 'changeText7',
      'change input[name=text8]': 'changeText8',
      'change input[name=text9]': 'changeText9',
    },
    initialize: function (options) {
    },
    onRender: function () {
      this.setSliders();

      var self = this;
      this.$el.find('#text_color').colorpicker()
        .on('changeColor', function () {
          self.$el.find('#text_color_p_1').css("background", self.$el.find(this).colorpicker('getValue', '#ffffff'));
          self.model.set('color', self.$el.find(this).colorpicker('getValue', '#ffffff'));
        });
      this.$el.find('#text_counter_color').colorpicker()
        .on('changeColor', function () {
          self.$el.find('#text_counter_color_p_1').css("background", self.$el.find(this).colorpicker('getValue', '#ffffff'));
          self.model.set('counterColor', self.$el.find(this).colorpicker('getValue', '#ffffff'));
        });
      this.$el.find('.selectpicker').selectpicker();
    },
    changeFont: function () {
      var font = this.$el.find('[name=text_font]').val();
      this.model.set('font', font);
    },
    changeCounterFont: function () {
      var font = this.$el.find('[name=text_counter_font]').val();
      this.model.set('counterFont', font);
    },
    changeCity: function () {
      var city = this.$el.find('[name=region]').val();
      this.model.set('region', city);
    },
    changeIconSize: function () {
      var iconSize = this.$el.find('[name=icon_size]').val();
      this.model.set('iconSize', iconSize);
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
    fontCounterBold: function (e) {
      if (e.target.checked) {
        this.model.set('counterFontWeight', '700');
      } else {
        this.model.set('counterFontWeight', 'none');
      }
    },
    fontCounterItalic: function (e) {
      if (e.target.checked) {
        this.model.set('counterItalic', true);
      } else {
        this.model.set('counterItalic', false);
      }
    },
    fontCounterTiny: function (e) {
      if (e.target.checked) {
        this.model.set('counterFontWeight', '300');
      } else {
        this.model.set('counterFontWeight', 'none');
      }
    },
    toggleCounterRegister: function (e) {
      if (e.target.checked) {
        this.model.set('counterUppercase', true);
      } else {
        this.model.set('counterUppercase', false);
      }
    },
    hideIcon: function (e) {
      if (e.target.checked) {
        this.model.set('iconHide', true);
      } else {
        this.model.set('iconHide', false);
      }
    },
    hideText: function (e) {
      if (e.target.checked) {
        this.model.set('textHide', true);
      } else {
        this.model.set('textHide', false);
      }
    },
    hideMark: function (e) {
      if (e.target.checked) {
        this.model.set('markHide', true);
      } else {
        this.model.set('markHide', false);
      }
    },
    hideMarkCounter: function (e) {
      if (e.target.checked) {
        this.model.set('markHideCounter', true);
      } else {
        this.model.set('markHideCounter', false);
      }
    },
    changeText0: function (e) {
      this.model.set('text0', e.target.value);
    },
    changeText1: function (e) {
      this.model.set('text1', e.target.value);
    },
    changeText2: function (e) {
      this.model.set('text2', e.target.value);
    },
    changeText3: function (e) {
      this.model.set('text3', e.target.value);
    },
    changeText4: function (e) {
      this.model.set('text4', e.target.value);
    },
    changeText5: function (e) {
      this.model.set('text5', e.target.value);
    },
    changeText6: function (e) {
      this.model.set('text6', e.target.value);
    },
    changeText7: function (e) {
      this.model.set('text7', e.target.value);
    },
    changeText8: function (e) {
      this.model.set('text8', e.target.value);
    },
    changeText9: function (e) {
      this.model.set('text9', e.target.value);
    },
    setSliders: function () {
      var self = this;

      this.$el.find('#text_size').ionRangeSlider({
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

      this.$el.find('#text_counter_size').ionRangeSlider({
        type: 'single',
        min: 14,
        max: 80,
        from: self.model.get('counterSize'),
        step: 1,
        postfix: ' px',
        onChange: function (obj) {
          self.model.set('counterSize', obj.from);
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