define([
  'app',
  'marionette',
  'backbone',
  'text!templates/widgets/coverWidgetsTemplates/commentatorDay/index.ejs',
  'text!templates/widgets/coverWidgetsTemplates/commentatorLast/index.ejs',
  'text!templates/widgets/coverWidgetsTemplates/commentatorLikes/index.ejs',
  'text!templates/widgets/coverWidgetsTemplates/dateTime/index.ejs',
  'text!templates/widgets/coverWidgetsTemplates/subscriber/index.ejs',
  'text!templates/widgets/coverWidgetsTemplates/winner/index.ejs',
  'text!templates/widgets/coverWidgetsTemplates/text/index.ejs',
  'text!templates/widgets/coverWidgetsTemplates/textUrl/index.ejs',
  'text!templates/widgets/coverWidgetsTemplates/timer/index.ejs',
  'text!templates/widgets/coverWidgetsTemplates/weather/index.ejs',
  'text!templates/widgets/coverWidgetsTemplates/reposterDay/index.ejs',
  'text!templates/widgets/coverWidgetsTemplates/likerDay/index.ejs',
  'text!templates/widgets/coverWidgetsTemplates/reposterLast/index.ejs',
  'text!templates/widgets/coverWidgetsTemplates/courses/index.ejs',
  'text!templates/widgets/coverWidgetsTemplates/statistic/index.ejs',
  'text!templates/widgets/coverWidgetsTemplates/traffic/index.ejs',
  'text!templates/widgets/coverWidgetsTemplates/image/index.ejs',
  'underscore',
  'moment',
  'notify',
], function (App, Marionette, Backbone,
             commentatorDayTmpl,
             commentatorLastTmpl,
             commentatorLikesTmpl,
             dateTimeTmpl,
             subscriberTmpl,
             winnerTmpl,
             textTmpl,
             textUrlTmpl,
             timerTmpl,
             weatherTmpl,
             reposterTmpl,
             likerTmpl,
             reposterLastTmpl,
             coursesTmpl,
             statisticTmpl,
             trafficTmpl,
             imageTmpl,
             _,
             moment,
             notify) {

  'use strict';

  return Marionette.ItemView.extend({
    triggers: {
      'click [data-action=show-settings]': 'select:item'
    },
    initialize: function () {

      switch (this.model.get('name')) {
        case 'subscriber':
          this.template = _.template(subscriberTmpl);
          break;
        case 'winner':
          this.template = _.template(winnerTmpl);
          break;
        case 'date':
          this.template = _.template(dateTimeTmpl);
          break;
        case 'text':
          this.template = _.template(textTmpl);
          break;
        case 'url':
          this.template = _.template(textUrlTmpl);
          break;
        case 'timer':
          this.template = _.template(timerTmpl);
          break;
        case 'weather':
          this.template = _.template(weatherTmpl);
          break;
        case 'currency':
          this.template = _.template(coursesTmpl);
          break;
        case 'statistic':
          this.template = _.template(statisticTmpl);
          break;
        case 'commentatorLast':
          this.template = _.template(commentatorLastTmpl);
          break;
        case 'reposterLast':
          this.template = _.template(reposterLastTmpl);
          break;
        case 'commentatorDay':
          this.template = _.template(commentatorDayTmpl);
          break;
        case 'commentatorLikes':
          this.template = _.template(commentatorLikesTmpl);
          break;
        case 'reposterDay':
          this.template = _.template(reposterTmpl);
          break;
        case 'likerDay':
          this.template = _.template(likerTmpl);
          break;
        case 'traffic':
          this.template = _.template(trafficTmpl);
          break;
        case 'image':
          this.template = _.template(imageTmpl);
          break;
      }
    },
    modelEvents: {
      'change': 'render'
    },
    serializeData: function () {
      var model = this.model.toJSON();

      var dateNow = '';
      var months = {
        1: 'январь',
        2: 'февраль',
        3: 'март',
        4: 'апрель',
        5: 'май',
        6: 'июнь',
        7: 'июль',
        8: 'август',
        9: 'сентябрь',
        10: 'октябрь',
        11: 'ноябрь',
        12: 'декабрь'
      };

      var short_months = {
        1: 'янв.',
        2: 'фев.',
        3: 'мар.',
        4: 'апр.',
        5: 'май',
        6: 'июн.',
        7: 'июл.',
        8: 'авг.',
        9: 'сен.',
        10: 'окт.',
        11: 'ноя.',
        12: 'дек.'
      };

      if (this.model.get('name') === 'date') {
        switch (this.model.get('format')) {
          case 'DD MMM YYYY':
            dateNow = moment().format('DD ') + short_months[moment().format('M')] + moment().format(' YYYY');
            break;
          case 'DD MMM YYYY HH:mm':
            dateNow = moment().format('DD ') + short_months[moment().format('M')] + moment().format(' YYYY HH:mm');
            break;
          case 'DD MMMM YYYY HH:mm':
            dateNow = moment().format('DD ') + months[moment().format('M')] + moment().format(' YYYY HH:mm');
            break;
          case 'DD MMMM YYYY':
            dateNow = moment().format('DD ') + months[moment().format('M')] + moment().format(' YYYY');
            break;
          default:
            dateNow = moment().format(this.model.get('format'));
        }
      }

      if (this.model.get('name') === 'timer') {
        dateNow += this.model.get('dayShow') ? this.model.get('dayZeroShow') ? 'XX день ' : 'X день ' : '';
        dateNow += this.model.get('hourShow') ? this.model.get('hourZeroShow') ? 'XX часов ' : 'X часов ' : '';
        dateNow += this.model.get('minutesShow') ? this.model.get('minutesZeroShow') ? 'XX минут' : 'X минут' : '';
      }

      return _.extend(model, {
        id: this.model.cid,
        dateNow: dateNow
      });
    },
    onRender: function () {
      if (this.model.get('name') === 'subscriber') {
        this.$el.find('#subscriber_' + this.model.cid).draggable({
          containment: '#coverEditorZone',
          scroll: false,
          stop: function (event, ui) {
            var wrapper = Backbone.$("#coverEditorZone").offset();
            var borderLeft = parseInt(Backbone.$("#coverEditorZone").css("border-left-width"), 10);
            var borderTop = parseInt(Backbone.$("#coverEditorZone").css("border-top-width"), 10);
            var pos = ui.helper.offset();
            this.model.set('imageX', pos.left - wrapper.left - borderLeft);
            this.model.set('imageY', pos.top - wrapper.top - borderTop);

            this.model.set('nameX', this.model.get('imageX') + this.model.get('absoluteNameX'));
            this.model.set('lnameX', this.model.get('imageX') + this.model.get('absoluteLNameX'));

            this.model.set('nameY', this.model.get('imageY') + this.model.get('absoluteNameY'));
            this.model.set('lnameY', this.model.get('imageY') + this.model.get('absoluteLNameY'));
          }.bind(this)
        });

        this.$el.find('#subscriber_fname_' + this.model.cid).draggable({
          containment: '#coverEditorZone', scroll: false,
          stop: function (event, ui) {
            var wrapper = Backbone.$('#subscriber_' + this.model.cid).offset();
            var borderLeft = parseInt(Backbone.$("#coverEditorZone").css("border-left-width"), 10);
            var borderTop = parseInt(Backbone.$("#coverEditorZone").css("border-top-width"), 10);
            var pos = ui.helper.offset();

            this.model.set('nameX', this.model.get('imageX') + (pos.left - wrapper.left - borderLeft) + 1);
            this.model.set('nameY', this.model.get('imageY') + (pos.top - wrapper.top - borderTop) + 1);

            this.model.set('absoluteNameX', pos.left - wrapper.left - borderLeft);
            this.model.set('absoluteNameY', pos.top - wrapper.top - borderTop);
          }.bind(this)
        });

        this.$el.find('#subscriber_lname_' + this.model.cid).draggable({
          containment: '#coverEditorZone', scroll: false,
          stop: function (event, ui) {
            var wrapper = Backbone.$('#subscriber_' + this.model.cid).offset();
            var borderLeft = parseInt(Backbone.$("#coverEditorZone").css("border-left-width"), 10);
            var borderTop = parseInt(Backbone.$("#coverEditorZone").css("border-top-width"), 10);
            var pos = ui.helper.offset();

            this.model.set('lnameX', this.model.get('imageX') + (pos.left - wrapper.left - borderLeft) + 1);
            this.model.set('lnameY', this.model.get('imageY') + (pos.top - wrapper.top - borderTop) + 1);

            this.model.set('absoluteLNameX', pos.left - wrapper.left - borderLeft);
            this.model.set('absoluteLNameY', pos.top - wrapper.top - borderTop);
          }.bind(this)
        });
      }

      if (this.model.get('name') === 'winner') {
        this.$el.find('#winner_' + this.model.cid).draggable({
          containment: '#coverEditorZone',
          scroll: false,
          stop: function (event, ui) {
            var wrapper = Backbone.$("#coverEditorZone").offset();
            var borderLeft = parseInt(Backbone.$("#coverEditorZone").css("border-left-width"), 10);
            var borderTop = parseInt(Backbone.$("#coverEditorZone").css("border-top-width"), 10);
            var pos = ui.helper.offset();
            this.model.set('imageX', pos.left - wrapper.left - borderLeft);
            this.model.set('imageY', pos.top - wrapper.top - borderTop);

            this.model.set('nameX', this.model.get('imageX') + this.model.get('absoluteNameX'));
            this.model.set('lnameX', this.model.get('imageX') + this.model.get('absoluteLNameX'));

            this.model.set('nameY', this.model.get('imageY') + this.model.get('absoluteNameY'));
            this.model.set('lnameY', this.model.get('imageY') + this.model.get('absoluteLNameY'));
          }.bind(this)
        });

        this.$el.find('#winner_fname_' + this.model.cid).draggable({
          containment: '#coverEditorZone', scroll: false,
          stop: function (event, ui) {
            var wrapper = Backbone.$('#winner_' + this.model.cid).offset();
            var borderLeft = parseInt(Backbone.$("#coverEditorZone").css("border-left-width"), 10);
            var borderTop = parseInt(Backbone.$("#coverEditorZone").css("border-top-width"), 10);
            var pos = ui.helper.offset();

            this.model.set('nameX', this.model.get('imageX') + (pos.left - wrapper.left - borderLeft) + 1);
            this.model.set('nameY', this.model.get('imageY') + (pos.top - wrapper.top - borderTop) + 1);

            this.model.set('absoluteNameX', pos.left - wrapper.left - borderLeft);
            this.model.set('absoluteNameY', pos.top - wrapper.top - borderTop);
          }.bind(this)
        });

        this.$el.find('#winner_lname_' + this.model.cid).draggable({
          containment: '#coverEditorZone', scroll: false,
          stop: function (event, ui) {
            var wrapper = Backbone.$('#winner_' + this.model.cid).offset();
            var borderLeft = parseInt(Backbone.$("#coverEditorZone").css("border-left-width"), 10);
            var borderTop = parseInt(Backbone.$("#coverEditorZone").css("border-top-width"), 10);
            var pos = ui.helper.offset();

            this.model.set('lnameX', this.model.get('imageX') + (pos.left - wrapper.left - borderLeft) + 1);
            this.model.set('lnameY', this.model.get('imageY') + (pos.top - wrapper.top - borderTop) + 1);

            this.model.set('absoluteLNameX', pos.left - wrapper.left - borderLeft);
            this.model.set('absoluteLNameY', pos.top - wrapper.top - borderTop);
          }.bind(this)
        });
      }

      if (this.model.get('name') === 'text') {
        this.$el.find('#text_' + this.model.cid).draggable({
          containment: '#coverEditorZone',
          scroll: false,
          stop: function (event, ui) {
            var wrapper = Backbone.$("#coverEditorZone").offset();
            var borderLeft = parseInt(Backbone.$("#coverEditorZone").css("border-left-width"), 10);
            var borderTop = parseInt(Backbone.$("#coverEditorZone").css("border-top-width"), 10);
            var pos = ui.helper.offset();
            this.model.set('textX', pos.left - wrapper.left - borderLeft);
            this.model.set('textY', pos.top - wrapper.top - borderTop);
          }.bind(this)
        });
      }

      if (this.model.get('name') === 'url') {
        var _this = this;
        if (this.model.get('url') != '') {
          Backbone.$.ajax({
            url: this.model.get('url'),
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
        this.$el.find('#textUrl_' + this.model.cid).draggable({
          containment: '#coverEditorZone',
          scroll: false,
          stop: function (event, ui) {
            var wrapper = Backbone.$("#coverEditorZone").offset();
            var borderLeft = parseInt(Backbone.$("#coverEditorZone").css("border-left-width"), 10);
            var borderTop = parseInt(Backbone.$("#coverEditorZone").css("border-top-width"), 10);
            var pos = ui.helper.offset();
            this.model.set('textX', pos.left - wrapper.left - borderLeft);
            this.model.set('textY', pos.top - wrapper.top - borderTop);
          }.bind(this)
        });
      }

      if (this.model.get('name') === 'image') {
        this.$el.find('#image_' + this.model.cid).draggable({
          containment: '#coverEditorZone',
          scroll: false,
          stop: function (event, ui) {
            var wrapper = Backbone.$("#coverEditorZone").offset();
            var borderLeft = parseInt(Backbone.$("#coverEditorZone").css("border-left-width"), 10);
            var borderTop = parseInt(Backbone.$("#coverEditorZone").css("border-top-width"), 10);
            var pos = ui.helper.offset();
            this.model.set('imageX', pos.left - wrapper.left - borderLeft);
            this.model.set('imageY', pos.top - wrapper.top - borderTop);
          }.bind(this)
        });
      }

      if (this.model.get('name') === 'statistic') {
        this.$el.find('#statistic_' + this.model.cid).draggable({
          containment: '#coverEditorZone',
          scroll: false,
          stop: function (event, ui) {
            var wrapper = Backbone.$("#coverEditorZone").offset();
            var borderLeft = parseInt(Backbone.$("#coverEditorZone").css("border-left-width"), 10);
            var borderTop = parseInt(Backbone.$("#coverEditorZone").css("border-top-width"), 10);
            var pos = ui.helper.offset();
            this.model.set('textX', pos.left - wrapper.left - borderLeft);
            this.model.set('textY', pos.top - wrapper.top - borderTop);
          }.bind(this)
        });
      }

      if (this.model.get('name') === 'date') {
        this.$el.find('#date_' + this.model.cid).draggable({
          containment: '#coverEditorZone',
          scroll: false,
          stop: function (event, ui) {
            var wrapper = Backbone.$("#coverEditorZone").offset();
            var borderLeft = parseInt(Backbone.$("#coverEditorZone").css("border-left-width"), 10);
            var borderTop = parseInt(Backbone.$("#coverEditorZone").css("border-top-width"), 10);
            var pos = ui.helper.offset();
            this.model.set('dateX', pos.left - wrapper.left - borderLeft);
            this.model.set('dateY', pos.top - wrapper.top - borderTop);
          }.bind(this)
        });
      }

      if (this.model.get('name') === 'timer') {
        this.$el.find('#timer_' + this.model.cid).draggable({
          containment: '#coverEditorZone',
          scroll: false,
          stop: function (event, ui) {
            var wrapper = Backbone.$("#coverEditorZone").offset();
            var borderLeft = parseInt(Backbone.$("#coverEditorZone").css("border-left-width"), 10);
            var borderTop = parseInt(Backbone.$("#coverEditorZone").css("border-top-width"), 10);
            var pos = ui.helper.offset();
            this.model.set('timerX', pos.left - wrapper.left - borderLeft);
            this.model.set('timerY', pos.top - wrapper.top - borderTop);
          }.bind(this)
        });
      }

      if (this.model.get('name') === 'weather') {
        this.$el.find('#weather_' + this.model.cid).draggable({
          containment: '#coverEditorZone',
          scroll: false,
          stop: function (event, ui) {
            var wrapper = Backbone.$("#coverEditorZone").offset();
            var borderLeft = parseInt(Backbone.$("#coverEditorZone").css("border-left-width"), 10);
            var borderTop = parseInt(Backbone.$("#coverEditorZone").css("border-top-width"), 10);
            var pos = ui.helper.offset();
            this.model.set('weatherX', pos.left - wrapper.left - borderLeft);
            this.model.set('weatherY', pos.top - wrapper.top - borderTop);
          }.bind(this)
        });



        this.$el.find('#weather_' + this.model.cid).draggable({
          containment: '#coverEditorZone',
          scroll: false,
          stop: function (event, ui) {
            var wrapper = Backbone.$("#coverEditorZone").offset();
            var borderLeft = parseInt(Backbone.$("#coverEditorZone").css("border-left-width"), 10);
            var borderTop = parseInt(Backbone.$("#coverEditorZone").css("border-top-width"), 10);
            var pos = ui.helper.offset();
            this.model.set('weatherX', pos.left - wrapper.left - borderLeft);
            this.model.set('weatherY', pos.top - wrapper.top - borderTop);

            this.model.set('weatherTypeX', this.model.get('weatherX') + this.model.get('absoluteWeatherTypeX'));
            this.model.set('weatherWindX', this.model.get('weatherX') + this.model.get('absoluteWeatherWindX'));

            this.model.set('weatherTypeY', this.model.get('weatherY') + this.model.get('absoluteWeatherTypeY'));
            this.model.set('weatherWindY', this.model.get('weatherY') + this.model.get('absoluteWeatherWindY'));
          }.bind(this)
        });

        this.$el.find('#weather_type_' + this.model.cid).draggable({
          containment: '#coverEditorZone', scroll: false,
          stop: function (event, ui) {
            var wrapper = Backbone.$('#weather_' + this.model.cid).offset();
            var borderLeft = parseInt(Backbone.$("#coverEditorZone").css("border-left-width"), 10);
            var borderTop = parseInt(Backbone.$("#coverEditorZone").css("border-top-width"), 10);
            var pos = ui.helper.offset();

            this.model.set('weatherTypeX', this.model.get('weatherX') + (pos.left - wrapper.left - borderLeft) + 1);
            this.model.set('weatherTypeY', this.model.get('weatherY') + (pos.top - wrapper.top - borderTop) + 1);

            this.model.set('absoluteWeatherTypeX', pos.left - wrapper.left - borderLeft);
            this.model.set('absoluteWeatherTypeY', pos.top - wrapper.top - borderTop);
          }.bind(this)
        });

        this.$el.find('#weather_wind_' + this.model.cid).draggable({
          containment: '#coverEditorZone', scroll: false,
          stop: function (event, ui) {
            var wrapper = Backbone.$('#weather_' + this.model.cid).offset();
            var borderLeft = parseInt(Backbone.$("#coverEditorZone").css("border-left-width"), 10);
            var borderTop = parseInt(Backbone.$("#coverEditorZone").css("border-top-width"), 10);
            var pos = ui.helper.offset();

            this.model.set('weatherWindX', this.model.get('weatherX') + (pos.left - wrapper.left - borderLeft) + 1);
            this.model.set('weatherWindY', this.model.get('weatherY') + (pos.top - wrapper.top - borderTop) + 1);

            this.model.set('absoluteWeatherWindX', pos.left - wrapper.left - borderLeft);
            this.model.set('absoluteWeatherWindY', pos.top - wrapper.top - borderTop);
          }.bind(this)
        });
      }

      if (this.model.get('name') === 'traffic') {
        this.$el.find('#traffic_' + this.model.cid).draggable({
          containment: '#coverEditorZone',
          scroll: false,
          stop: function (event, ui) {
            var wrapper = Backbone.$("#coverEditorZone").offset();
            var borderLeft = parseInt(Backbone.$("#coverEditorZone").css("border-left-width"), 10);
            var borderTop = parseInt(Backbone.$("#coverEditorZone").css("border-top-width"), 10);
            var pos = ui.helper.offset();
            this.model.set('iconX', pos.left - wrapper.left - borderLeft);
            this.model.set('iconY', pos.top - wrapper.top - borderTop);
          }.bind(this)
        });

        this.$el.find('#traffic_' + this.model.cid).draggable({
          containment: '#coverEditorZone',
          scroll: false,
          stop: function (event, ui) {
            var wrapper = Backbone.$("#coverEditorZone").offset();
            var borderLeft = parseInt(Backbone.$("#coverEditorZone").css("border-left-width"), 10);
            var borderTop = parseInt(Backbone.$("#coverEditorZone").css("border-top-width"), 10);
            var pos = ui.helper.offset();
            this.model.set('iconX', pos.left - wrapper.left - borderLeft);
            this.model.set('iconY', pos.top - wrapper.top - borderTop);

            this.model.set('textX', this.model.get('iconX') + this.model.get('absoluteTextX'));
            this.model.set('markX', this.model.get('iconX') + this.model.get('absoluteMarkX'));

            this.model.set('textY', this.model.get('iconY') + this.model.get('absoluteTextY'));
            this.model.set('markY', this.model.get('iconY') + this.model.get('absoluteMarkY'));
          }.bind(this)
        });

        this.$el.find('#traffic_type_' + this.model.cid).draggable({
          containment: '#coverEditorZone', scroll: false,
          stop: function (event, ui) {
            var wrapper = Backbone.$('#traffic_' + this.model.cid).offset();
            var borderLeft = parseInt(Backbone.$("#coverEditorZone").css("border-left-width"), 10);
            var borderTop = parseInt(Backbone.$("#coverEditorZone").css("border-top-width"), 10);
            var pos = ui.helper.offset();

            this.model.set('textX', this.model.get('iconX') + (pos.left - wrapper.left - borderLeft) + 1);
            this.model.set('textY', this.model.get('iconY') + (pos.top - wrapper.top - borderTop) + 1);

            this.model.set('absoluteTextX', pos.left - wrapper.left - borderLeft);
            this.model.set('absoluteTextY', pos.top - wrapper.top - borderTop);
          }.bind(this)
        });

        this.$el.find('#traffic_wind_' + this.model.cid).draggable({
          containment: '#coverEditorZone', scroll: false,
          stop: function (event, ui) {
            var wrapper = Backbone.$('#traffic_' + this.model.cid).offset();
            var borderLeft = parseInt(Backbone.$("#coverEditorZone").css("border-left-width"), 10);
            var borderTop = parseInt(Backbone.$("#coverEditorZone").css("border-top-width"), 10);
            var pos = ui.helper.offset();

            this.model.set('markX', this.model.get('iconX') + (pos.left - wrapper.left - borderLeft) + 1);
            this.model.set('markY', this.model.get('iconY') + (pos.top - wrapper.top - borderTop) + 1);

            this.model.set('absoluteMarkX', pos.left - wrapper.left - borderLeft);
            this.model.set('absoluteMarkY', pos.top - wrapper.top - borderTop);
          }.bind(this)
        });
      }

      if (this.model.get('name') === 'currency') {
        this.$el.find('#courses_from_' + this.model.cid).draggable({
          containment: '#coverEditorZone',
          scroll: false,
          stop: function (event, ui) {
            var wrapper = Backbone.$("#coverEditorZone").offset();
            var borderLeft = parseInt(Backbone.$("#coverEditorZone").css("border-left-width"), 10);
            var borderTop = parseInt(Backbone.$("#coverEditorZone").css("border-top-width"), 10);
            var pos = ui.helper.offset();
            this.model.set('currencyFromX', pos.left - wrapper.left - borderLeft);
            this.model.set('currencyFromY', pos.top - wrapper.top - borderTop);
          }.bind(this)
        });

        this.$el.find('#courses_to_' + this.model.cid).draggable({
          containment: '#coverEditorZone',
          scroll: false,
          stop: function (event, ui) {
            var wrapper = Backbone.$("#coverEditorZone").offset();
            var borderLeft = parseInt(Backbone.$("#coverEditorZone").css("border-left-width"), 10);
            var borderTop = parseInt(Backbone.$("#coverEditorZone").css("border-top-width"), 10);
            var pos = ui.helper.offset();
            this.model.set('currencyToX', pos.left - wrapper.left - borderLeft);
            this.model.set('currencyToY', pos.top - wrapper.top - borderTop);
          }.bind(this)
        });
      }

      if (this.model.get('name') === 'commentatorLast') {
        this.$el.find('#commentator_last_' + this.model.cid).draggable({
          containment: '#coverEditorZone',
          scroll: false,
          stop: function (event, ui) {
            var wrapper = Backbone.$("#coverEditorZone").offset();
            var borderLeft = parseInt(Backbone.$("#coverEditorZone").css("border-left-width"), 10);
            var borderTop = parseInt(Backbone.$("#coverEditorZone").css("border-top-width"), 10);
            var pos = ui.helper.offset();
            this.model.set('imageX', pos.left - wrapper.left - borderLeft);
            this.model.set('imageY', pos.top - wrapper.top - borderTop);

            this.model.set('nameX', this.model.get('imageX') + this.model.get('absoluteNameX'));
            this.model.set('lnameX', this.model.get('imageX') + this.model.get('absoluteLNameX'));

            this.model.set('nameY', this.model.get('imageY') + this.model.get('absoluteNameY'));
            this.model.set('lnameY', this.model.get('imageY') + this.model.get('absoluteLNameY'));
          }.bind(this)
        });

        this.$el.find('#commentator_last_fname_' + this.model.cid).draggable({
          containment: '#coverEditorZone', scroll: false,
          stop: function (event, ui) {
            var wrapper = Backbone.$('#commentator_last_' + this.model.cid).offset();
            var borderLeft = parseInt(Backbone.$("#coverEditorZone").css("border-left-width"), 10);
            var borderTop = parseInt(Backbone.$("#coverEditorZone").css("border-top-width"), 10);
            var pos = ui.helper.offset();

            this.model.set('nameX', this.model.get('imageX') + (pos.left - wrapper.left - borderLeft) + 1);
            this.model.set('nameY', this.model.get('imageY') + (pos.top - wrapper.top - borderTop) + 1);

            this.model.set('absoluteNameX', pos.left - wrapper.left - borderLeft);
            this.model.set('absoluteNameY', pos.top - wrapper.top - borderTop);
          }.bind(this)
        });

        this.$el.find('#commentator_last_lname_' + this.model.cid).draggable({
          containment: '#coverEditorZone', scroll: false,
          stop: function (event, ui) {
            var wrapper = Backbone.$('#commentator_last_' + this.model.cid).offset();
            var borderLeft = parseInt(Backbone.$("#coverEditorZone").css("border-left-width"), 10);
            var borderTop = parseInt(Backbone.$("#coverEditorZone").css("border-top-width"), 10);
            var pos = ui.helper.offset();

            this.model.set('lnameX', this.model.get('imageX') + (pos.left - wrapper.left - borderLeft) + 1);
            this.model.set('lnameY', this.model.get('imageY') + (pos.top - wrapper.top - borderTop) + 1);

            this.model.set('absoluteLNameX', pos.left - wrapper.left - borderLeft);
            this.model.set('absoluteLNameY', pos.top - wrapper.top - borderTop);
          }.bind(this)
        });
      }

      if (this.model.get('name') === 'commentatorDay') {
        this.$el.find('#commentator_day_' + this.model.cid).draggable({
          containment: '#coverEditorZone',
          scroll: false,
          stop: function (event, ui) {
            var wrapper = Backbone.$("#coverEditorZone").offset();
            var borderLeft = parseInt(Backbone.$("#coverEditorZone").css("border-left-width"), 10);
            var borderTop = parseInt(Backbone.$("#coverEditorZone").css("border-top-width"), 10);
            var pos = ui.helper.offset();
            this.model.set('imageX', pos.left - wrapper.left - borderLeft);
            this.model.set('imageY', pos.top - wrapper.top - borderTop);

            this.model.set('nameX', this.model.get('imageX') + this.model.get('absoluteNameX'));
            this.model.set('lnameX', this.model.get('imageX') + this.model.get('absoluteLNameX'));
            this.model.set('CommentCountX', this.model.get('imageX') + this.model.get('absoluteCommentCountX'));

            this.model.set('nameY', this.model.get('imageY') + this.model.get('absoluteNameY'));
            this.model.set('lnameY', this.model.get('imageY') + this.model.get('absoluteLNameY'));
            this.model.set('CommentCountY', this.model.get('imageY') + this.model.get('absoluteCommentCountY'));

          }.bind(this)
        });

        this.$el.find('#commentator_day_fname_' + this.model.cid).draggable({
          containment: '#coverEditorZone', scroll: false,
          stop: function (event, ui) {
            var wrapper = Backbone.$('#commentator_day_' + this.model.cid).offset();
            var borderLeft = parseInt(Backbone.$("#coverEditorZone").css("border-left-width"), 10);
            var borderTop = parseInt(Backbone.$("#coverEditorZone").css("border-top-width"), 10);
            var pos = ui.helper.offset();

            this.model.set('nameX', this.model.get('imageX') + (pos.left - wrapper.left - borderLeft) + 1);
            this.model.set('nameY', this.model.get('imageY') + (pos.top - wrapper.top - borderTop) + 1);

            this.model.set('absoluteNameX', pos.left - wrapper.left - borderLeft);
            this.model.set('absoluteNameY', pos.top - wrapper.top - borderTop);
          }.bind(this)
        });

        this.$el.find('#commentator_day_lname_' + this.model.cid).draggable({
          containment: '#coverEditorZone', scroll: false,
          stop: function (event, ui) {
            var wrapper = Backbone.$('#commentator_day_' + this.model.cid).offset();
            var borderLeft = parseInt(Backbone.$("#coverEditorZone").css("border-left-width"), 10);
            var borderTop = parseInt(Backbone.$("#coverEditorZone").css("border-top-width"), 10);
            var pos = ui.helper.offset();

            this.model.set('lnameX', this.model.get('imageX') + (pos.left - wrapper.left - borderLeft) + 1);
            this.model.set('lnameY', this.model.get('imageY') + (pos.top - wrapper.top - borderTop) + 1);

            this.model.set('absoluteLNameX', pos.left - wrapper.left - borderLeft);
            this.model.set('absoluteLNameY', pos.top - wrapper.top - borderTop);
          }.bind(this)
        });

        this.$el.find('#commentator_day_comments_count_' + this.model.cid).draggable({
          containment: '#coverEditorZone', scroll: false,
          stop: function (event, ui) {
            var wrapper = Backbone.$('#commentator_day_' + this.model.cid).offset();
            var borderLeft = parseInt(Backbone.$("#coverEditorZone").css("border-left-width"), 10);
            var borderTop = parseInt(Backbone.$("#coverEditorZone").css("border-top-width"), 10);
            var pos = ui.helper.offset();

            this.model.set('CommentCountX', this.model.get('imageX') + (pos.left - wrapper.left - borderLeft) + 1);
            this.model.set('CommentCountY', this.model.get('imageY') + (pos.top - wrapper.top - borderTop) + 1);

            this.model.set('absoluteCommentCountX', pos.left - wrapper.left - borderLeft);
            this.model.set('absoluteCommentCountY', pos.top - wrapper.top - borderTop);
          }.bind(this)
        });
      }

      if (this.model.get('name') === 'reposterDay') {
        this.$el.find('#reposter_day_' + this.model.cid).draggable({
          containment: '#coverEditorZone',
          scroll: false,
          stop: function (event, ui) {
            var wrapper = Backbone.$("#coverEditorZone").offset();
            var borderLeft = parseInt(Backbone.$("#coverEditorZone").css("border-left-width"), 10);
            var borderTop = parseInt(Backbone.$("#coverEditorZone").css("border-top-width"), 10);
            var pos = ui.helper.offset();
            this.model.set('imageX', pos.left - wrapper.left - borderLeft);
            this.model.set('imageY', pos.top - wrapper.top - borderTop);

            this.model.set('nameX', this.model.get('imageX') + this.model.get('absoluteNameX'));
            this.model.set('lnameX', this.model.get('imageX') + this.model.get('absoluteLNameX'));
            this.model.set('repostsCountX', this.model.get('imageX') + this.model.get('absoluteRepostsCountX'));

            this.model.set('nameY', this.model.get('imageY') + this.model.get('absoluteNameY'));
            this.model.set('lnameY', this.model.get('imageY') + this.model.get('absoluteLNameY'));
            this.model.set('repostsCountY', this.model.get('imageY') + this.model.get('absoluteRepostsCountY'));

          }.bind(this)
        });

        this.$el.find('#reposter_day_fname_' + this.model.cid).draggable({
          containment: '#coverEditorZone', scroll: false,
          stop: function (event, ui) {
            var wrapper = Backbone.$('#reposter_day_' + this.model.cid).offset();
            var borderLeft = parseInt(Backbone.$("#coverEditorZone").css("border-left-width"), 10);
            var borderTop = parseInt(Backbone.$("#coverEditorZone").css("border-top-width"), 10);
            var pos = ui.helper.offset();

            this.model.set('nameX', this.model.get('imageX') + (pos.left - wrapper.left - borderLeft) + 1);
            this.model.set('nameY', this.model.get('imageY') + (pos.top - wrapper.top - borderTop) + 1);

            this.model.set('absoluteNameX', pos.left - wrapper.left - borderLeft);
            this.model.set('absoluteNameY', pos.top - wrapper.top - borderTop);
          }.bind(this)
        });

        this.$el.find('#reposter_day_lname_' + this.model.cid).draggable({
          containment: '#coverEditorZone', scroll: false,
          stop: function (event, ui) {
            var wrapper = Backbone.$('#reposter_day_' + this.model.cid).offset();
            var borderLeft = parseInt(Backbone.$("#coverEditorZone").css("border-left-width"), 10);
            var borderTop = parseInt(Backbone.$("#coverEditorZone").css("border-top-width"), 10);
            var pos = ui.helper.offset();

            this.model.set('lnameX', this.model.get('imageX') + (pos.left - wrapper.left - borderLeft) + 1);
            this.model.set('lnameY', this.model.get('imageY') + (pos.top - wrapper.top - borderTop) + 1);

            this.model.set('absoluteLNameX', pos.left - wrapper.left - borderLeft);
            this.model.set('absoluteLNameY', pos.top - wrapper.top - borderTop);
          }.bind(this)
        });

        this.$el.find('#reposter_day_reposts_count_' + this.model.cid).draggable({
          containment: '#coverEditorZone', scroll: false,
          stop: function (event, ui) {
            var wrapper = Backbone.$('#reposter_day_' + this.model.cid).offset();
            var borderLeft = parseInt(Backbone.$("#coverEditorZone").css("border-left-width"), 10);
            var borderTop = parseInt(Backbone.$("#coverEditorZone").css("border-top-width"), 10);
            var pos = ui.helper.offset();

            this.model.set('repostsCountX', this.model.get('imageX') + (pos.left - wrapper.left - borderLeft) + 1);
            this.model.set('repostsCountY', this.model.get('imageY') + (pos.top - wrapper.top - borderTop) + 1);

            this.model.set('absoluteRepostsCountX', pos.left - wrapper.left - borderLeft);
            this.model.set('absoluteRepostsCountY', pos.top - wrapper.top - borderTop);
          }.bind(this)
        });
      }

      if (this.model.get('name') === 'likerDay') {
        this.$el.find('#liker_day_' + this.model.cid).draggable({
          containment: '#coverEditorZone',
          scroll: false,
          stop: function (event, ui) {
            var wrapper = Backbone.$("#coverEditorZone").offset();
            var borderLeft = parseInt(Backbone.$("#coverEditorZone").css("border-left-width"), 10);
            var borderTop = parseInt(Backbone.$("#coverEditorZone").css("border-top-width"), 10);
            var pos = ui.helper.offset();
            this.model.set('imageX', pos.left - wrapper.left - borderLeft);
            this.model.set('imageY', pos.top - wrapper.top - borderTop);

            this.model.set('nameX', this.model.get('imageX') + this.model.get('absoluteNameX'));
            this.model.set('lnameX', this.model.get('imageX') + this.model.get('absoluteLNameX'));
            this.model.set('likesCountX', this.model.get('imageX') + this.model.get('absoluteLikesCountX'));

            this.model.set('nameY', this.model.get('imageY') + this.model.get('absoluteNameY'));
            this.model.set('lnameY', this.model.get('imageY') + this.model.get('absoluteLNameY'));
            this.model.set('likesCountY', this.model.get('imageY') + this.model.get('absoluteLikesCountY'));

          }.bind(this)
        });

        this.$el.find('#liker_day_fname_' + this.model.cid).draggable({
          containment: '#coverEditorZone', scroll: false,
          stop: function (event, ui) {
            var wrapper = Backbone.$('#liker_day_' + this.model.cid).offset();
            var borderLeft = parseInt(Backbone.$("#coverEditorZone").css("border-left-width"), 10);
            var borderTop = parseInt(Backbone.$("#coverEditorZone").css("border-top-width"), 10);
            var pos = ui.helper.offset();

            this.model.set('nameX', this.model.get('imageX') + (pos.left - wrapper.left - borderLeft) + 1);
            this.model.set('nameY', this.model.get('imageY') + (pos.top - wrapper.top - borderTop) + 1);

            this.model.set('absoluteNameX', pos.left - wrapper.left - borderLeft);
            this.model.set('absoluteNameY', pos.top - wrapper.top - borderTop);
          }.bind(this)
        });

        this.$el.find('#liker_day_lname_' + this.model.cid).draggable({
          containment: '#coverEditorZone', scroll: false,
          stop: function (event, ui) {
            var wrapper = Backbone.$('#liker_day_' + this.model.cid).offset();
            var borderLeft = parseInt(Backbone.$("#coverEditorZone").css("border-left-width"), 10);
            var borderTop = parseInt(Backbone.$("#coverEditorZone").css("border-top-width"), 10);
            var pos = ui.helper.offset();

            this.model.set('lnameX', this.model.get('imageX') + (pos.left - wrapper.left - borderLeft) + 1);
            this.model.set('lnameY', this.model.get('imageY') + (pos.top - wrapper.top - borderTop) + 1);

            this.model.set('absoluteLNameX', pos.left - wrapper.left - borderLeft);
            this.model.set('absoluteLNameY', pos.top - wrapper.top - borderTop);
          }.bind(this)
        });

        this.$el.find('#liker_day_reposts_count_' + this.model.cid).draggable({
          containment: '#coverEditorZone', scroll: false,
          stop: function (event, ui) {
            var wrapper = Backbone.$('#liker_day_' + this.model.cid).offset();
            var borderLeft = parseInt(Backbone.$("#coverEditorZone").css("border-left-width"), 10);
            var borderTop = parseInt(Backbone.$("#coverEditorZone").css("border-top-width"), 10);
            var pos = ui.helper.offset();

            this.model.set('likesCountX', this.model.get('imageX') + (pos.left - wrapper.left - borderLeft) + 1);
            this.model.set('likesCountY', this.model.get('imageY') + (pos.top - wrapper.top - borderTop) + 1);

            this.model.set('absoluteLikesCountX', pos.left - wrapper.left - borderLeft);
            this.model.set('absoluteLikesCountY', pos.top - wrapper.top - borderTop);
          }.bind(this)
        });
      }

      if (this.model.get('name') === 'reposterLast') {
        this.$el.find('#reposter_last_' + this.model.cid).draggable({
          containment: '#coverEditorZone',
          scroll: false,
          stop: function (event, ui) {
            var wrapper = Backbone.$("#coverEditorZone").offset();
            var borderLeft = parseInt(Backbone.$("#coverEditorZone").css("border-left-width"), 10);
            var borderTop = parseInt(Backbone.$("#coverEditorZone").css("border-top-width"), 10);
            var pos = ui.helper.offset();
            this.model.set('imageX', pos.left - wrapper.left - borderLeft);
            this.model.set('imageY', pos.top - wrapper.top - borderTop);

            this.model.set('nameX', this.model.get('imageX') + this.model.get('absoluteNameX'));
            this.model.set('lnameX', this.model.get('imageX') + this.model.get('absoluteLNameX'));

            this.model.set('nameY', this.model.get('imageY') + this.model.get('absoluteNameY'));
            this.model.set('lnameY', this.model.get('imageY') + this.model.get('absoluteLNameY'));
          }.bind(this)
        });

        this.$el.find('#reposter_last_fname_' + this.model.cid).draggable({
          containment: '#coverEditorZone', scroll: false,
          stop: function (event, ui) {
            var wrapper = Backbone.$('#reposter_last_' + this.model.cid).offset();
            var borderLeft = parseInt(Backbone.$("#coverEditorZone").css("border-left-width"), 10);
            var borderTop = parseInt(Backbone.$("#coverEditorZone").css("border-top-width"), 10);
            var pos = ui.helper.offset();

            this.model.set('nameX', this.model.get('imageX') + (pos.left - wrapper.left - borderLeft) + 1);
            this.model.set('nameY', this.model.get('imageY') + (pos.top - wrapper.top - borderTop) + 1);

            this.model.set('absoluteNameX', pos.left - wrapper.left - borderLeft);
            this.model.set('absoluteNameY', pos.top - wrapper.top - borderTop);
          }.bind(this)
        });

        this.$el.find('#reposter_last_lname_' + this.model.cid).draggable({
          containment: '#coverEditorZone', scroll: false,
          stop: function (event, ui) {
            var wrapper = Backbone.$('#reposter_last_' + this.model.cid).offset();
            var borderLeft = parseInt(Backbone.$("#coverEditorZone").css("border-left-width"), 10);
            var borderTop = parseInt(Backbone.$("#coverEditorZone").css("border-top-width"), 10);
            var pos = ui.helper.offset();

            this.model.set('lnameX', this.model.get('imageX') + (pos.left - wrapper.left - borderLeft) + 1);
            this.model.set('lnameY', this.model.get('imageY') + (pos.top - wrapper.top - borderTop) + 1);

            this.model.set('absoluteLNameX', pos.left - wrapper.left - borderLeft);
            this.model.set('absoluteLNameY', pos.top - wrapper.top - borderTop);
          }.bind(this)
        });
      }

      if (this.model.get('name') === 'commentatorLikes') {
        this.$el.find('#commentator_likes_' + this.model.cid).draggable({
          containment: '#coverEditorZone',
          scroll: false,
          stop: function (event, ui) {
            var wrapper = Backbone.$("#coverEditorZone").offset();
            var borderLeft = parseInt(Backbone.$("#coverEditorZone").css("border-left-width"), 10);
            var borderTop = parseInt(Backbone.$("#coverEditorZone").css("border-top-width"), 10);
            var pos = ui.helper.offset();
            this.model.set('imageX', pos.left - wrapper.left - borderLeft);
            this.model.set('imageY', pos.top - wrapper.top - borderTop);

            this.model.set('nameX', this.model.get('imageX') + this.model.get('absoluteNameX'));
            this.model.set('lnameX', this.model.get('imageX') + this.model.get('absoluteLNameX'));
            this.model.set('likeX', this.model.get('imageX') + this.model.get('absoluteLikeX'));

            this.model.set('nameY', this.model.get('imageY') + this.model.get('absoluteNameY'));
            this.model.set('lnameY', this.model.get('imageY') + this.model.get('absoluteLNameY'));
            this.model.set('likeY', this.model.get('imageY') + this.model.get('absoluteLikeY'));


          }.bind(this)
        });

        this.$el.find('#commentator_likes_fname_' + this.model.cid).draggable({
          containment: '#coverEditorZone', scroll: false,
          stop: function (event, ui) {
            var wrapper = Backbone.$('#commentator_likes_' + this.model.cid).offset();
            var borderLeft = parseInt(Backbone.$("#coverEditorZone").css("border-left-width"), 10);
            var borderTop = parseInt(Backbone.$("#coverEditorZone").css("border-top-width"), 10);
            var pos = ui.helper.offset();

            this.model.set('nameX', this.model.get('imageX') + (pos.left - wrapper.left - borderLeft) + 1);
            this.model.set('nameY', this.model.get('imageY') + (pos.top - wrapper.top - borderTop) + 1);

            this.model.set('absoluteNameX', pos.left - wrapper.left - borderLeft);
            this.model.set('absoluteNameY', pos.top - wrapper.top - borderTop);
          }.bind(this)
        });

        this.$el.find('#commentator_likes_lname_' + this.model.cid).draggable({
          containment: '#coverEditorZone', scroll: false,
          stop: function (event, ui) {
            var wrapper = Backbone.$('#commentator_likes_' + this.model.cid).offset();
            var borderLeft = parseInt(Backbone.$("#coverEditorZone").css("border-left-width"), 10);
            var borderTop = parseInt(Backbone.$("#coverEditorZone").css("border-top-width"), 10);
            var pos = ui.helper.offset();

            this.model.set('lnameX', this.model.get('imageX') + (pos.left - wrapper.left - borderLeft) + 1);
            this.model.set('lnameY', this.model.get('imageY') + (pos.top - wrapper.top - borderTop) + 1);

            this.model.set('absoluteLNameX', pos.left - wrapper.left - borderLeft);
            this.model.set('absoluteLNameY', pos.top - wrapper.top - borderTop);
          }.bind(this)
        });

        this.$el.find('#commentator_likes_like_' + this.model.cid).draggable({
          containment: '#coverEditorZone', scroll: false,
          stop: function (event, ui) {
            var wrapper = Backbone.$('#commentator_likes_' + this.model.cid).offset();
            var borderLeft = parseInt(Backbone.$("#coverEditorZone").css("border-left-width"), 10);
            var borderTop = parseInt(Backbone.$("#coverEditorZone").css("border-top-width"), 10);
            var pos = ui.helper.offset();

            this.model.set('likeX', this.model.get('imageX') + (pos.left - wrapper.left - borderLeft) + 1);
            this.model.set('likeY', this.model.get('imageY') + (pos.top - wrapper.top - borderTop) + 1);

            this.model.set('absoluteLikeX', pos.left - wrapper.left - borderLeft);
            this.model.set('absoluteLikeY', pos.top - wrapper.top - borderTop);
          }.bind(this)
        });
      }
    }
  });
});