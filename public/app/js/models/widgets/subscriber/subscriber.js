define([
  'app',
  'marionette',
  'backbone',
  'underscore',
  'text!templates/widgets/subscriber/index.ejs',
  'bootstrapcolorpicker',
], function (App, Marionette, Backbone, _, subscriberTmpl, bootstrapcolorpicker) {

  'use strict';

  return Marionette.ItemView.extend({
    template: _.template(subscriberTmpl),
    ui: {
      subscriber1: 'select[name=subscriber_form_1]',
      position: 'select[name=subscribers_namePosition]',
    },
    events: {
      'change select[name=subscriber_form_1]': 'changeForm',
      'change select[name=subscribers_namePosition]': 'changeNamePosition',
      'change select[name=subscribers_name_font_1]': 'changeNameFont',
      'change select[name=subscribers_lname_font_1]': 'changeLNameFont',
      'change input[name=subscribers_name_show_1]': 'toggleName',
      'change input[name=subscribers_name_register_1]': 'toggleNameRegister',
      'change input[name=subscribers_lname_show_1]': 'toggleLName',
      'change input[name=subscribers_lname_register_1]': 'toggleLNameRegister',
      'change input[name=subscribers_name_bold_1]': 'nameFontBold',
      'change input[name=subscribers_lname_bold_1]': 'lNameFontBold',
      'change input[name=subscribers_name_italic_1]': 'nameFontItalic',
      'change input[name=subscribers_lname_italic_1]': 'lNameFontItalic',
      'change input[name=subscribers_name_tiny_1]': 'nameFontTiny',
      'change input[name=subscribers_lname_tiny_1]': 'lNameFontTiny'
    },
    initialize: function (options) {
      //console.log(this.model);
    },
    onRender: function () {
      this.setSliders();

      var self = this;
      this.$el.find('#subscribers_name_color_1').colorpicker()
        .on('changeColor', function () {
          self.$el.find('#subscribers_name_color_p_1').css("background", self.$el.find(this).colorpicker('getValue', '#ffffff'));
          self.model.set('nameColor', self.$el.find(this).colorpicker('getValue', '#ffffff'));
        });
      this.$el.find('#subscribers_lname_color_1').colorpicker()
        .on('changeColor', function () {
          self.$el.find('#subscribers_lname_color_p_1').css("background", self.$el.find(this).colorpicker('getValue', '#ffffff'));
          self.model.set('lnameColor', self.$el.find(this).colorpicker('getValue', '#ffffff'));
        });

      this.$el.find('#subscribers_image_border_color').colorpicker()
        .on('changeColor', function () {
          self.$el.find('#subscribers_image_border_color_p').css("background", self.$el.find(this).colorpicker('getValue', '#ffffff'));
          self.model.set('borderColor', self.$el.find(this).colorpicker('getValue', '#ffffff'));
        });

    },
    changeForm: function () {
      this.model.set('imageFigure', this.ui.subscriber1.val());
    },
    changeNamePosition: function () {
      this.model.set('namePosition', this.ui.position.val());
    },
    toggleName: function (e) {
      if (e.target.checked) {
        this.model.set('nameShow', false);
      } else {
        this.model.set('nameShow', true);
      }
    },
    toggleNameRegister: function (e) {
      if (e.target.checked) {
        this.model.set('nameUppercase', true);
      } else {
        this.model.set('nameUppercase', false);
      }
    },
    toggleLName: function (e) {
      if (e.target.checked) {
        this.model.set('lnameShow', false);
      } else {
        this.model.set('lnameShow', true);
      }
    },
    toggleLNameRegister: function (e) {
      if (e.target.checked) {
        this.model.set('lnameUppercase', true);
      } else {
        this.model.set('lnameUppercase', false);
      }
    },
    changeNameFont: function (e) {
      var font = this.$el.find('[name=subscribers_name_font_1]').val();
      Backbone.$('#subscriber_fname_1').css('font-family', font);
      this.model.set('nameFont', font);
    },
    changeLNameFont: function (e) {
      var font = this.$el.find('[name=subscribers_lname_font_1]').val();
      Backbone.$('#subscriber_lname_1').css('font-family', font);
      this.model.set('lnameFont', font);
    },
    nameFontBold: function (e) {
      if (e.target.checked) {
        Backbone.$('#subscriber_fname_1').css('font-weight', '700');
        this.$el.find('[name=subscribers_name_tiny_1]').prop('checked', false);
        this.$el.find('[name=subscribers_name_tiny_1]').parent().removeClass('active');
        this.model.set('nameFontWeight', '700');
      } else {
        Backbone.$('#subscriber_fname_1').css('font-weight', 'initial');
        this.model.set('nameFontWeight', 'none');
      }
    },
    nameFontItalic: function (e) {
      if (e.target.checked) {
        Backbone.$('#subscriber_fname_1').css('font-style', 'italic');
        this.model.set('nameItalic', true);
      } else {
        Backbone.$('#subscriber_fname_1').css('font-style', 'normal');
        this.model.set('nameItalic', false);
      }
    },
    nameFontTiny: function (e) {
      if (e.target.checked) {
        Backbone.$('#subscriber_fname_1').css('font-weight', '300');
        this.$el.find('[name=subscribers_name_bold_1]').prop('checked', false);
        this.$el.find('[name=subscribers_name_bold_1]').parent().removeClass('active');
        this.model.set('nameFontWeight', '300');
      } else {
        Backbone.$('#subscriber_fname_1').css('font-weight', 'initial');
        this.model.set('nameFontWeight', 'none');
      }
    },
    lNameFontBold: function (e) {
      if (e.target.checked) {
        Backbone.$('#subscriber_lname_1').css('font-weight', '700');
        this.$el.find('[name=subscribers_lname_tiny_1]').prop('checked', false);
        this.$el.find('[name=subscribers_lname_tiny_1]').parent().removeClass('active');
        this.model.set('lnameFontWeight', '700');
      } else {
        Backbone.$('#subscriber_lname_1').css('font-weight', 'initial');
        this.model.set('lnameFontWeight', 'none');
      }
    },
    lNameFontItalic: function (e) {
      if (e.target.checked) {
        Backbone.$('#subscriber_lname_1').css('font-style', 'italic');
        this.model.set('lnameItalic', true);
      } else {
        Backbone.$('#subscriber_lname_1').css('font-style', 'normal');
        this.model.set('lnameItalic', false);
      }
    },
    lNameFontTiny: function (e) {
      if (e.target.checked) {
        Backbone.$('#subscriber_lname_1').css('font-weight', '300');
        this.$el.find('[name=subscribers_lname_bold_1]').prop('checked', false);
        this.$el.find('[name=subscribers_lname_bold_1]').parent().removeClass('active');
        this.model.set('lnameFontWeight', '300');
      } else {
        Backbone.$('#subscriber_lname_1').css('font-weight', 'initial');
        this.model.set('lnameFontWeight', 'none');
      }
    },
    setSliders: function () {
      var self = this;

      this.$el.find('#subscribers_image_size_1').ionRangeSlider({
        type: 'single',
        min: 50,
        max: 150,
        from: self.model.get('imageSize'),
        step: 1,
        postfix: ' px',
        onChange: function (obj) {
          self.model.set('imageSize', obj.from);
        }
      });

      this.$el.find('#subscribers_text_size_fname_1').ionRangeSlider({
        type: 'single',
        min: 14,
        max: 80,
        from: self.model.get('nameSize'),
        step: 1,
        postfix: ' px',
        onChange: function (obj) {
          self.model.set('nameSize', obj.from);
        }
      });

      this.$el.find('#subscribers_text_size_lname_1').ionRangeSlider({
        type: 'single',
        min: 14,
        max: 80,
        from: self.model.get('lnameSize'),
        step: 1,
        postfix: ' px',
        onChange: function (obj) {
          self.model.set('lnameSize', obj.from);
        }
      });

      this.$el.find('#subscribers_image_border').ionRangeSlider({
        type: "single",
        min: 0,
        max: 20,
        from: self.model.get('borderSize'),
        step: 1,
        postfix: " px",
        onChange: function (obj) {
          self.model.set('borderSize', obj.from);
        }
      });
    }
  });
});
