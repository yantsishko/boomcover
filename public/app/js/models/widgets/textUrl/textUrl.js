define([
  'app',
  'marionette',
  'backbone',
  'underscore',
  'text!templates/widgets/textUrl/index.ejs',
  'bootstrapcolorpicker',
  'datetimepicker',
  'moment',
  'notify',
], function (App, Marionette, Backbone, _, textUrlTmpl, bootstrapcolorpicker, datetimepicker, moment, notify) {

  'use strict';

  return Marionette.ItemView.extend({
    template: _.template(textUrlTmpl),
    events: {
      'change select[name=textUrl_gmt]': 'changeGmt',
      'change select[name=textUrl_font]': 'changeFont',
      'change input[name=textUrl_register]': 'toggleRegister',
      'change input[name=textUrl_time_show]': 'toggleTimeText',
      'change input[name=textUrl_url]': 'url',
      'change input[name=textUrl_bold]': 'fontBold',
      'change input[name=textUrl_italic]': 'fontItalic',
      'change input[name=textUrl_tiny]': 'fontTiny'
    },
    initialize: function (options) {
    },
    onRender: function () {
      this.setSliders();

      var self = this;
      this.$el.find('#textUrl_color').colorpicker()
        .on('changeColor', function () {
          self.$el.find('#textUrl_color_p_1').css("background", self.$el.find(this).colorpicker('getValue', '#ffffff'));
          self.model.set('color', self.$el.find(this).colorpicker('getValue', '#ffffff'));
        });
    },
    url: function (e) {
      var _this = this;
      if (e.target.value != '') {
        Backbone.$.ajax({
          url: e.target.value,
          success: function (resData) {
            _this.model.set('text', resData);
          },
          error: function (err) {
            Backbone.$.notify("Неправильная ссылка в виджете текста", "error");
            if (err.status == 401) {
              window.location = '/login';
            }
          }
        });
      }

      this.model.set('url', e.target.value);
    },
    changeGmt: function () {
      var gmt = this.$el.find('[name=textUrl_gmt]').val();
      this.model.set('gmt', gmt);
    },
    changeFont: function () {
      var font = this.$el.find('[name=textUrl_font]').val();
      this.model.set('font', font);
    },
    fontBold: function (e) {
      if (e.target.checked) {
        // Backbone.$('#subscriber_fname_1').css('font-weight', '700');
        // this.$el.find('[name=subscribers_name_tiny_1]').prop('checked', false);
        // this.$el.find('[name=subscribers_name_tiny_1]').parent().removeClass('active');
        this.model.set('fontWeight', '700');
      } else {
        //Backbone.$('#subscriber_fname_1').css('font-weight', 'initial');
        this.model.set('fontWeight', 'none');
      }
    },
    fontItalic: function (e) {
      if (e.target.checked) {
        //Backbone.$('#subscriber_fname_1').css('font-style', 'italic');
        this.model.set('italic', true);
      } else {
        //Backbone.$('#subscriber_fname_1').css('font-style', 'normal');
        this.model.set('italic', false);
      }
    },
    fontTiny: function (e) {
      if (e.target.checked) {
        // Backbone.$('#subscriber_fname_1').css('font-weight', '300');
        // this.$el.find('[name=subscribers_name_bold_1]').prop('checked', false);
        // this.$el.find('[name=subscribers_name_bold_1]').parent().removeClass('active');
        this.model.set('fontWeight', '300');
      } else {
        //Backbone.$('#subscriber_fname_1').css('font-weight', 'initial');
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
    toggleTimeText: function (e) {
      if (e.target.checked) {
        this.$el.find('#textUrl_time').show();
        this.model.set('showTextTime', true);
      } else {
        this.$el.find('#textUrl_time').hide();
        this.model.set('showTextTime', false);
      }
    },
    setSliders: function () {
      var self = this;

      this.$el.find('#textUrl_start').datetimepicker({
        format: 'YYYY-MM-DD HH:mm'
      });

      this.$el.find('#textUrl_start').on("dp.change", function (e) {
        self.model.set('textStart', e.date.format('YYYY-MM-DD HH:mm'));
      });

      this.$el.find('#textUrl_end').datetimepicker({
        format: 'YYYY-MM-DD HH:mm'
      });

      this.$el.find('#textUrl_end').on("dp.change", function (e) {
        self.model.set('textEnd', e.date.format('YYYY-MM-DD HH:mm'));
      });

      this.$el.find('#textUrl_size').ionRangeSlider({
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
    }
  });
});