define([
  'app',
  'marionette',
  'backbone',
  'underscore',
  'text!templates/widgets/timer/index.ejs',
  'bootstrapcolorpicker',
  'datetimepicker',
  'moment'
], function (App, Marionette, Backbone, _, timerTmpl, bootstrapcolorpicker, datetimepicker, moment) {

  'use strict';

  return Marionette.ItemView.extend({
    template: _.template(timerTmpl),
    events: {
      'change select[name=timer_gmt]': 'changeGmt',
      'change select[name=timer_text_font]': 'changeFont',
      'change input[name=timer_text_register]': 'toggleRegister',
      'change input[name=timer_text_before]': 'textBefore',
      'change input[name=timer_text_bold]': 'fontBold',
      'change input[name=timer_text_italic]': 'fontItalic',
      'change input[name=timer_text_tiny]': 'fontTiny',

      'change input[name=timer_day1_name]': 'changeDay1Name',
      'change input[name=timer_day2_name]': 'changeDay2Name',
      'change input[name=timer_day3_name]': 'changeDay3Name',
      'change input[name=timer_day_show]': 'changeDayShow',
      'change input[name=timer_day_zero_show]': 'changeDayZeroShow',
      'change input[name=timer_day_zero]': 'changeDayZero',
      'change select[name=timer_day_position]': 'changeDayPosition',

      'change input[name=timer_hour1_name]': 'changeHour1Name',
      'change input[name=timer_hour2_name]': 'changeHour2Name',
      'change input[name=timer_hour3_name]': 'changeHour3Name',
      'change input[name=timer_hour_show]': 'changeHourShow',
      'change input[name=timer_hour_zero_show]': 'changeHourZeroShow',
      'change input[name=timer_hour_zero]': 'changeHourZero',
      'change select[name=timer_hour_position]': 'changeHourPosition',

      'change input[name=timer_minutes1_name]': 'changeMinutes1Name',
      'change input[name=timer_minutes2_name]': 'changeMinutes2Name',
      'change input[name=timer_minutes3_name]': 'changeMinutes3Name',
      'change input[name=timer_minutes_show]': 'changeMinutesShow',
      'change input[name=timer_minutes_zero_show]': 'changeMinutesZeroShow',
      'change input[name=timer_minutes_zero]': 'changeMinutesZero',
      'change select[name=timer_minutes_position]': 'changeMinutesPosition',
    },
    initialize: function (options) {
      //console.log(this.model);
    },
    onRender: function () {
      this.setSliders();

      var self = this;
      this.$el.find('#timer_text_color').colorpicker()
        .on('changeColor', function () {
          self.$el.find('#timer_text_color_p_1').css("background", self.$el.find(this).colorpicker('getValue', '#ffffff'));
          self.model.set('color', self.$el.find(this).colorpicker('getValue', '#ffffff'));
        });

    },
    changeGmt: function () {
      var gmt = this.$el.find('[name=timer_gmt]').val();
      this.model.set('gmt', gmt);
    },
    changeFont: function () {
      var font = this.$el.find('[name=timer_text_font]').val();
      this.model.set('font', font);
    },
    textBefore: function (e) {
      this.model.set('textBefore', e.target.value);
    },
    changeDay1Name: function (e) {
      this.model.set('day1', e.target.value);
    },
    changeDay2Name: function (e) {
      this.model.set('day2', e.target.value);
    },
    changeDay3Name: function (e) {
      this.model.set('day3', e.target.value);
    },
    changeDayShow: function (e) {
      if (!e.target.checked) {
        this.model.set('dayShow', true);
      } else {
        this.model.set('dayShow', false);
      }
    },
    changeDayZeroShow: function (e) {
      if (!e.target.checked) {
        this.model.set('dayZeroShow', true);
      } else {
        this.model.set('dayZeroShow', false);
      }
    },
    changeDayZero: function (e) {
      if (!e.target.checked) {
        this.model.set('dayZero', true);
      } else {
        this.model.set('dayZero', false);
      }
    },
    changeDayPosition: function () {
      var position = this.$el.find('[name=timer_day_position]').val();
      this.model.set('dayPosition', position);
    },

    changeHour1Name: function (e) {
      this.model.set('hour1', e.target.value);
    },
    changeHour2Name: function (e) {
      this.model.set('hour2', e.target.value);
    },
    changeHour3Name: function (e) {
      this.model.set('hour3', e.target.value);
    },
    changeHourShow: function (e) {
      if (!e.target.checked) {
        this.model.set('hourShow', true);
      } else {
        this.model.set('hourShow', false);
      }
    },
    changeHourZeroShow: function (e) {
      if (!e.target.checked) {
        this.model.set('hourZeroShow', true);
      } else {
        this.model.set('hourZeroShow', false);
      }
    },
    changeHourZero: function (e) {
      if (!e.target.checked) {
        this.model.set('hourZero', true);
      } else {
        this.model.set('hourZero', false);
      }
    },
    changeHourPosition: function () {
      var position = this.$el.find('[name=timer_hour_position]').val();
      this.model.set('hourPosition', position);
    },

    changeMinutes1Name: function (e) {
      this.model.set('minutes1', e.target.value);
    },
    changeMinutes2Name: function (e) {
      this.model.set('minutes2', e.target.value);
    },
    changeMinutes3Name: function (e) {
      this.model.set('minutes3', e.target.value);
    },
    changeMinutesShow: function (e) {
      if (!e.target.checked) {
        this.model.set('minutesShow', true);
      } else {
        this.model.set('minutesShow', false);
      }
    },
    changeMinutesZeroShow: function (e) {
      if (!e.target.checked) {
        this.model.set('minutesZeroShow', true);
      } else {
        this.model.set('minutesZeroShow', false);
      }
    },
    changeMinutesZero: function (e) {
      if (!e.target.checked) {
        this.model.set('minutesZero', true);
      } else {
        this.model.set('minutesZero', false);
      }
    },
    changeMinutesPosition: function () {
      var position = this.$el.find('[name=timer_minutes_position]').val();
      this.model.set('minutesPosition', position);
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

      this.$el.find('#datepicker').datetimepicker({
        format: 'YYYY-MM-DD HH:mm'
      });

      this.$el.find('#datepicker').on("dp.change", function (e) {
        self.model.set('endDate', e.date.format('YYYY-MM-DD HH:mm'));
      });

      this.$el.find('#timer_text_size').ionRangeSlider({
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