define([
  'app',
  'marionette',
  'backbone',
  'underscore',
  'text!templates/widgets/courses/index.ejs',
  'bootstrapcolorpicker',
  'bootstrapselect'
], function (App, Marionette, Backbone, _, coursesTmpl, bootstrapcolorpicker, bootstrapselect) {

  'use strict';

  return Marionette.ItemView.extend({
    template: _.template(coursesTmpl),
    events: {
      'change select[name=courses_text_font]': 'changeFont',
      'change select[name=courses_from]': 'changeFrom',
      'change select[name=courses_to]': 'changeTo',
      'change select[name=courses_from_type]': 'changeFromType',
      'change select[name=courses_to_type]': 'changeToType',
      'change select[name=courses_from_type_position]': 'changeFromTypePosition',
      'change select[name=courses_to_type_position]': 'changeToTypePosition',
      'change input[name=courses_text_bold]': 'fontBold',
      'change input[name=courses_text_italic]': 'fontItalic',
      'change input[name=courses_text_tiny]': 'fontTiny',
      'change input[name=courses_from_show]': 'showFrom'
    },
    initialize: function (options) {
      this.currencies = null;
      var self = this;
      Backbone.$.ajax({
        async: false,
        url: App.url + '/api/v1/currencies/codes',
        success: function (currencies) {
          self.currencies = currencies;
        }
      });
    },
    onRender: function () {
      this.setSliders();

      var self = this;
      this.$el.find('#courses_text_color').colorpicker()
        .on('changeColor', function () {
          self.$el.find('#courses_text_color_p_1').css("background", self.$el.find(this).colorpicker('getValue', '#ffffff'));
          self.model.set('color', self.$el.find(this).colorpicker('getValue', '#ffffff'));
        });

      this.$el.find('.selectpicker').selectpicker();
    },
    changeFont: function () {
      var font = this.$el.find('[name=courses_text_font]').val();
      this.model.set('font', font);
    },
    changeFrom: function () {
      var from = this.$el.find('[name=courses_from]').val();
      this.model.set('currencyFrom', from);
    },
    changeTo: function () {
      var to = this.$el.find('[name=courses_to]').val();
      this.model.set('currencyTo', to);
    },
    changeToType: function () {
      var type = this.$el.find('[name=courses_to_type]').val();
      this.model.set('currencyToShowType', type);
    },
    changeFromType: function () {
      var type = this.$el.find('[name=courses_from_type]').val();
      this.model.set('currencyFromShowType', type);
    },
    changeFromTypePosition: function () {
      var type = this.$el.find('[name=courses_from_type_position]').val();
      this.model.set('currencyFromShowTypePosition', type);
    },
    changeToTypePosition: function () {
      var type = this.$el.find('[name=courses_to_type_position]').val();
      this.model.set('currencyToShowTypePosition', type);
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
    showFrom: function (e) {
      if (!e.target.checked) {
        this.model.set('currencyFromShow', true);
      } else {
        this.model.set('currencyFromShow', false);
      }
    },
    setSliders: function () {
      var self = this;

      this.$el.find('#courses_text_size').ionRangeSlider({
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
    serializeData: function () {
      var model = this.model.toJSON();

      return _.extend(model, {
        currencies: this.currencies
      });
    }
  });
});