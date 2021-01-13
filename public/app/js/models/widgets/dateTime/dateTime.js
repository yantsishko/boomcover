define([
  'app',
  'marionette',
  'backbone',
  'underscore',
  'text!templates/widgets/dateTime/index.ejs',
  'bootstrapcolorpicker',
], function (App, Marionette, Backbone, _, dateTimeTmpl, bootstrapcolorpicker) {

  'use strict';

  return Marionette.ItemView.extend({
    template: _.template(dateTimeTmpl),
    ui: {
      subscriber1: 'select[name=subscriber_form_1]'
    },
    events: {
      'change select[name=date_gmt]': 'changeGmt',
      'change select[name=date_format]': 'changeDateFormat',
      'change select[name=date_text_font]': 'changeFont',
      'change input[name=date_text_register]': 'toggleRegister',
      'change input[name=date_text_before]': 'textBefore',
      'change input[name=date_text_after]': 'textAfter',
      'change input[name=date_text_bold]': 'fontBold',
      'change input[name=date_text_italic]': 'fontItalic',
      'change input[name=date_text_tiny]': 'fontTiny'
    },
    initialize: function (options) {
      //console.log(this.model);
    },
    onRender: function () {
      this.setSliders();

      var self = this;
      this.$el.find('#date_text_color').colorpicker()
        .on('changeColor', function () {
          self.$el.find('#date_text_color_p_1').css("background", self.$el.find(this).colorpicker('getValue', '#ffffff'));
          self.model.set('color', self.$el.find(this).colorpicker('getValue', '#ffffff'));
        });
      this.$el.find('#date_text_color').colorpicker()
        .on('changeColor', function () {
          self.$el.find('#date_text_color_p_1').css("background", self.$el.find(this).colorpicker('getValue', '#ffffff'));
          self.model.set('color', self.$el.find(this).colorpicker('getValue', '#ffffff'));
        });

    },
    changeGmt: function () {
      var gmt = this.$el.find('[name=date_gmt]').val();
      this.model.set('gmt', gmt);
    },
    changeDateFormat: function () {
      var dateFormat = this.$el.find('[name=date_format]').val();
      this.model.set('format', dateFormat);
    },
    changeFont: function () {
      var font = this.$el.find('[name=date_text_font]').val();
      this.model.set('font', font);
    },
    textBefore: function (e) {
      this.model.set('textBefore', e.target.value);
    },
    textAfter: function (e) {
      this.model.set('textAfter', e.target.value);
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
    setSliders: function () {
      var self = this;

      this.$el.find('#date_text_size').ionRangeSlider({
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