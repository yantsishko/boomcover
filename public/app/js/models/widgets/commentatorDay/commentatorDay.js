define([
  'app',
  'marionette',
  'backbone',
  'underscore',
  'text!templates/widgets/commentatorDay/index.ejs',
  'bootstrapcolorpicker',
  'datetimepicker',
  'moment'
], function (App, Marionette, Backbone, _, commentatorDayTmpl, bootstrapcolorpicker, datetimepicker, moment) {

  'use strict';

  return Marionette.ItemView.extend({
    template: _.template(commentatorDayTmpl),
    ui: {
      subscriber1: 'select[name=commentator_day_form]',
      position: 'select[name=commentator_day_namePosition]',
    },
    events: {
      'change select[name=commentator_day_form]': 'changeForm',
      'change select[name=commentator_day_namePosition]': 'changeNamePosition',
      'change select[name=commentator_day_name_font]': 'changeNameFont',
      'change select[name=commentator_day_lname_font]': 'changeLNameFont',
      'change select[name=comments_color]': 'changeCommentsColor',
      'change input[name=commentator_day_name_show]': 'toggleName',
      'change input[name=commentator_day_comment_show]': 'toggleCommentShow',
      'change input[name=commentator_day_name_register]': 'toggleNameRegister',
      'change input[name=commentator_day_lname_show]': 'toggleLName',
      'change input[name=commentator_day_lname_register]': 'toggleLNameRegister',
      'change input[name=commentator_day_name_bold]': 'nameFontBold',
      'change input[name=commentator_day_lname_bold]': 'lNameFontBold',
      'change input[name=commentator_day_name_italic]': 'nameFontItalic',
      'change input[name=commentator_day_lname_italic]': 'lNameFontItalic',
      'change input[name=commentator_day_name_tiny]': 'nameFontTiny',
      'change input[name=commentator_day_lname_tiny]': 'lNameFontTiny',
      'change input[name=commentator_day_comment_count_show]': 'toggleCount',
    },
    initialize: function (options) {
      //console.log(this.model);
    },
    onRender: function () {
      this.setSliders();

      var self = this;
      this.$el.find('#commentator_day_name_color').colorpicker()
        .on('changeColor', function () {
          self.$el.find('#subscribers_name_color_p').css("background", self.$el.find(this).colorpicker('getValue', '#ffffff'));
          self.model.set('nameColor', self.$el.find(this).colorpicker('getValue', '#ffffff'));
        });
      this.$el.find('#commentator_day_lname_color').colorpicker()
        .on('changeColor', function () {
          self.$el.find('#commentator_day_lname_color_p').css("background", self.$el.find(this).colorpicker('getValue', '#ffffff'));
          self.model.set('lnameColor', self.$el.find(this).colorpicker('getValue', '#ffffff'));
        });

      this.$el.find('#commentator_day_image_border_color').colorpicker()
        .on('changeColor', function () {
          self.$el.find('#commentator_day_image_border_color_p').css("background", self.$el.find(this).colorpicker('getValue', '#ffffff'));
          self.model.set('borderColor', self.$el.find(this).colorpicker('getValue', '#ffffff'));
        });

    },
    changeNamePosition: function () {
      this.model.set('namePosition', this.ui.position.val());
    },
    toggleCommentShow: function (e) {
      if (e.target.checked) {
        this.model.set('commentShow', true);
      } else {
        this.model.set('commentShow', false);
      }
    },
    changeCommentsColor: function () {
      var comments_color = this.$el.find('[name=comments_color]').val();
      this.model.set('commentIconColor', comments_color);
    },
    changeForm: function () {
      this.model.set('imageFigure', this.ui.subscriber1.val());
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
    toggleCount: function (e) {
      if (e.target.checked) {
        this.model.set('commentCountShow', true);
      } else {
        this.model.set('commentCountShow', false);
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
      var font = this.$el.find('[name=commentator_day_name_font]').val();
      this.model.set('nameFont', font);
    },
    changeLNameFont: function (e) {
      var font = this.$el.find('[name=commentator_day_lname_font]').val();
      this.model.set('lnameFont', font);
    },
    nameFontBold: function (e) {
      if (e.target.checked) {
        // Backbone.$('#subscriber_fname_1').css('font-weight', '700');
        this.$el.find('[name=commentator_day_name_tiny]').prop('checked', false);
        this.$el.find('[name=commentator_day_name_tiny]').parent().removeClass('active');
        this.model.set('nameFontWeight', '700');
      } else {
        //Backbone.$('#subscriber_fname_1').css('font-weight', 'initial');
        this.model.set('nameFontWeight', 'none');
      }
    },
    nameFontItalic: function (e) {
      if (e.target.checked) {
        //Backbone.$('#subscriber_fname_1').css('font-style', 'italic');
        this.model.set('nameItalic', true);
      } else {
        //Backbone.$('#subscriber_fname_1').css('font-style', 'normal');
        this.model.set('nameItalic', false);
      }
    },
    nameFontTiny: function (e) {
      if (e.target.checked) {
        // Backbone.$('#subscriber_fname_1').css('font-weight', '300');
        this.$el.find('[name=commentator_day_name_bold_1]').prop('checked', false);
        this.$el.find('[name=commentator_day_name_bold_1]').parent().removeClass('active');
        this.model.set('nameFontWeight', '300');
      } else {
        //Backbone.$('#subscriber_fname_1').css('font-weight', 'initial');
        this.model.set('nameFontWeight', 'none');
      }
    },
    lNameFontBold: function (e) {
      if (e.target.checked) {
        // Backbone.$('#subscriber_lname_1').css('font-weight', '700');
        this.$el.find('[name=commentator_day_lname_tiny_1]').prop('checked', false);
        this.$el.find('[name=commentator_day_lname_tiny_1]').parent().removeClass('active');
        this.model.set('lnameFontWeight', '700');
      } else {
        //Backbone.$('#subscriber_lname_1').css('font-weight', 'initial');
        this.model.set('lnameFontWeight', 'none');
      }
    },
    lNameFontItalic: function (e) {
      if (e.target.checked) {
        //Backbone.$('#subscriber_lname_1').css('font-style', 'italic');
        this.model.set('lnameItalic', true);
      } else {
        //Backbone.$('#subscriber_lname_1').css('font-style', 'normal');
        this.model.set('lnameItalic', false);
      }
    },
    lNameFontTiny: function (e) {
      if (e.target.checked) {
        // Backbone.$('#commentator_day_lname_tiny').css('font-weight', '300');
        this.$el.find('[name=commentator_day_lname_bold_1]').prop('checked', false);
        this.$el.find('[name=commentator_day_lname_bold_1]').parent().removeClass('active');
        this.model.set('lnameFontWeight', '300');
      } else {
        //Backbone.$('#subscriber_lname_1').css('font-weight', 'initial');
        this.model.set('lnameFontWeight', 'none');
      }
    },
    setSliders: function () {
      var self = this;

      this.$el.find('#datetimepicker').datetimepicker({
        format: 'HH:mm'
      });

      this.$el.find('#datetimepicker').on("dp.change", function (e) {
        self.model.set('changeTime', moment(e.date).format('HH:mm'));
      });


      this.$el.find('#commentator_day_min_likes').ionRangeSlider({
        type: "single",
        min: 0,
        max: 30,
        from: self.model.get('minLikes'),
        step: 1,
        postfix: " <div class='fa fa-heart'></div>",
        onChange: function (obj) {
          self.model.set('minLikes', obj.from);
        }
      });

      this.$el.find('#commentator_day_image_size').ionRangeSlider({
        type: "single",
        min: 50,
        max: 150,
        from: self.model.get('imageSize'),
        step: 1,
        postfix: " px",
        onChange: function (obj) {
          self.model.set('imageSize', obj.from);
        }
      });

      this.$el.find('#commentator_day_image_border').ionRangeSlider({
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

      this.$el.find('#commentator_day_text_size_fname').ionRangeSlider({
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

      this.$el.find('#commentator_day_text_size_lname').ionRangeSlider({
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
    }
  });
});
