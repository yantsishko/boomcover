define([
  'app',
  'marionette',
  'backbone',
  'underscore',
  'text!templates/widgets/text/index.ejs',
  'bootstrapcolorpicker',
  'datetimepicker',
  'moment'
], function (App, Marionette, Backbone, _, textTmpl, bootstrapcolorpicker, datetimepicker, moment) {

  'use strict';

  return Marionette.ItemView.extend({
    template: _.template(textTmpl),
    events: {
      'change select[name=text_gmt]': 'changeGmt',
      'change select[name=text_font]': 'changeFont',
      'change input[name=text_register]': 'toggleRegister',
      'change input[name=text_time_show]': 'toggleTimeText',
      'change input[name=text_text]': 'text',
      'change input[name=text_bold]': 'fontBold',
      'change input[name=text_italic]': 'fontItalic',
      'change input[name=text_tiny]': 'fontTiny'
    },
    initialize: function (options) {
      //console.log(this.model);
    },
    onRender: function () {
      this.setSliders();

      var self = this;
      this.$el.find('#text_color').colorpicker()
        .on('changeColor', function () {
          self.$el.find('#text_color_p_1').css("background", self.$el.find(this).colorpicker('getValue', '#ffffff'));
          self.model.set('color', self.$el.find(this).colorpicker('getValue', '#ffffff'));
        });
    },
    text: function (e) {
      this.model.set('text', e.target.value);
    },
    changeGmt: function () {
      var gmt = this.$el.find('[name=text_gmt]').val();
      this.model.set('gmt', gmt);
    },
    changeFont: function () {
      var font = this.$el.find('[name=text_font]').val();
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
        this.$el.find('#text_time').show();
        this.model.set('showTextTime', true);
      } else {
        this.$el.find('#text_time').hide();
        this.model.set('showTextTime', false);
      }
    },
    setSliders: function () {
      var self = this;

      this.$el.find('#text_start').datetimepicker({
        format: 'YYYY-MM-DD HH:mm'
      });

      this.$el.find('#text_start').on("dp.change", function (e) {
        self.model.set('textStart', e.date.format('YYYY-MM-DD HH:mm'));
      });

      this.$el.find('#text_end').datetimepicker({
        format: 'YYYY-MM-DD HH:mm'
      });

      this.$el.find('#text_end').on("dp.change", function (e) {
        self.model.set('textEnd', e.date.format('YYYY-MM-DD HH:mm'));
      });

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
    }
  });
});