define([
  'app',
  'marionette',
  'backbone',
  'underscore',
  'text!templates/widgets/statistic/index.ejs',
  'bootstrapcolorpicker'
], function (App, Marionette, Backbone, _, statisticTmpl, bootstrapcolorpicker) {

  'use strict';

  return Marionette.ItemView.extend({
    template: _.template(statisticTmpl),
    events: {
      'change select[name=statistic_type]': 'changeType',
      'change select[name=statistic_font]': 'changeFont',
      'change input[name=statistic_register]': 'toggleRegister',
      'change input[name=statistic_time_show]': 'toggleTimeText',
      'change input[name=statistic_text]': 'text',
      'change input[name=statistic_bold]': 'fontBold',
      'change input[name=statistic_italic]': 'fontItalic',
      'change input[name=statistic_tiny]': 'fontTiny'
    },
    initialize: function (options) {
      //console.log(this.model);
    },
    onRender: function () {
      this.setSliders();

      var self = this;
      this.$el.find('#statistic_color').colorpicker()
        .on('changeColor', function () {
          self.$el.find('#statistic_color_p_1').css("background", self.$el.find(this).colorpicker('getValue', '#ffffff'));
          self.model.set('color', self.$el.find(this).colorpicker('getValue', '#ffffff'));
        });
    },
    text: function (e) {
      this.model.set('text', e.target.value);
    },
    changeType: function () {
      var type = this.$el.find('[name=statistic_type]').val();
      this.model.set('type', type);
    },
    changeFont: function () {
      var font = this.$el.find('[name=statistic_font]').val();
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
        this.$el.find('#statistic_time').show();
        this.model.set('showTextTime', true);
      } else {
        this.$el.find('#statistic_time').hide();
        this.model.set('showTextTime', false);
      }
    },
    setSliders: function () {
      var self = this;

      this.$el.find('#statistic_size').ionRangeSlider({
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