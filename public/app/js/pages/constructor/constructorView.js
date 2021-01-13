define([
  'app',
  'marionette',
  'backbone',
  'underscore',
  'pace',
  'text!templates/constructor/index.ejs',
  //widgets start
  'subscriber',
  'js/models/widgets/subscriber/subscriberModel',

  'js/models/widgets/dateTime/dateTime',
  'js/models/widgets/dateTime/dateModel',

  'js/models/widgets/text/text',
  'js/models/widgets/text/textModel',

  'js/models/widgets/textUrl/textUrl',
  'js/models/widgets/textUrl/textUrlModel',

  'js/models/widgets/timer/timer',
  'js/models/widgets/timer/timerModel',

  'js/models/widgets/weather/weather',
  'js/models/widgets/weather/weatherModel',

  'js/models/widgets/commentatorLast/commentatorLast',
  'js/models/widgets/commentatorLast/commentatorLastModel',

  'js/models/widgets/commentatorDay/commentatorDay',
  'js/models/widgets/commentatorDay/commentatorDayModel',

  'js/models/widgets/commentatorLikes/commentatorLikes',
  'js/models/widgets/commentatorLikes/commentatorLikesModel',

  'js/models/widgets/winner/winner',
  'js/models/widgets/winner/winnerModel',

  'js/models/widgets/reposterDay/reposterDay',
  'js/models/widgets/reposterDay/reposterDayModel',

  'js/models/widgets/likerDay/likerDay',
  'js/models/widgets/likerDay/likerDayModel',

  'js/models/widgets/reposterLast/reposterLast',
  'js/models/widgets/reposterLast/reposterLastModel',

  'js/models/widgets/courses/courses',
  'js/models/widgets/courses/coursesModel',

  'js/models/widgets/statistic/statistic',
  'js/models/widgets/statistic/statisticModel',

  'js/models/widgets/traffic/traffic',
  'js/models/widgets/traffic/trafficModel',

  'js/models/widgets/image/image',
  'js/models/widgets/image/imageModel',

  'js/models/widgets/activeWidgets/collectionView',
  'js/models/widgets/coverWidgets/collectionView',

  //widgets end
  'js/pages/groups/collectionView',
  'jqueryui',
  'notify',
  'nicescroll',
  'spinner',
  'enjoyhint',
], function (App,
             Marionette,
             Backbone,
             _,
             pace,
             constructorTmpl,
             //widgets
             subscriberView,
             subscriberModel,
             dateTimeView,
             dateTimeModel,
             textView,
             textModel,
             textUrlView,
             textUrlModel,
             timerView,
             timerModel,
             weatherView,
             weatherModel,
             commentatorLastView,
             commentatorLastModel,
             commentatorDayView,
             commentatorDayModel,
             commentatorLikesView,
             commentatorLikesModel,
             winnerView,
             winnerModel,
             reposterDayView,
             reposterDayModel,
             likerDayView,
             likerDayModel,
             reposterLastView,
             reposterLastModel,
             coursesView,
             coursesModel,
             statisticView,
             statisticModel,
             trafficView,
             trafficModel,
             imageView,
             imageModel,
             activeWidgetsView,
             coverWidgetsView,
             //widgets

             groupsView,
             jqueryui,
             notify,
             nicescroll,
             spinner,
             enjoyhint) {
  'use strict';

  return Marionette.LayoutView.extend({
    template: _.template(constructorTmpl),
    regions: {
      widgetSettings: '[data-selector=widget-settings]',
      activeWidgets: '[data-selector=active-widgets]',
      widgets: '[data-selector=widgets]',
      groups: '[data-selector=groups]'
    },
    ui: {
      canva: '#constructor'
    },
    events: {
      'click [data-action=add-subscriber]': 'addSubscriber',
      'click [data-action=add-winner]': 'addWinner',
      'click [data-action=add-text]': 'addText',
      'click [data-action=add-textUrl]': 'addTextUrl',
      'click [data-action=add-timer]': 'addTimer',
      'click [data-action=add-weather]': 'addWeather',
      'click [data-action=add-courses]': 'addCourses',
      'click [data-action=add-statistic]': 'addStatistic',
      'click [data-action=add-date]': 'addDate',
      'click [data-action=add-last-commentator]': 'addLastCommentator',
      'click [data-action=add-last-reposter]': 'addLastReposter',
      'click [data-action=add-day-commentator]': 'addDayCommentator',
      'click [data-action=add-day-reposter]': 'addDayReposter',
      'click [data-action=add-day-liker]': 'addDayLiker',
      'click [data-action=add-likes-commentator]': 'addLikesCommentator',
      'click [data-action=add-traffic]': 'addTraffic',
      'click [data-action=add-image]': 'addImage',
      'click [data-action=save]': 'saveWidgets',
      'click [data-action=markup]': 'toggleMarkup',
      'click [data-action=preview]': 'showPreview',
      'click [data-action=info-subscriber]': 'showInfoSubscriber',
      'click [data-action=info-winner]': 'showInfoWinner',
      'click [data-action=info-last-comment]': 'showInfoCommLast',
      'click [data-action=info-comm-likes]': 'showInfoCommLikes',
      'click [data-action=info-comm-day]': 'showInfoCommDay',
      'click [data-action=info-reposter-day]': 'showInfoReposterDay',
      'click [data-action=info-liker-day]': 'showInfoLikerDay',
      'click [data-action=info-reposter-last]': 'showInfoReposterLast',
      'click [data-action=info-date]': 'showInfoDate',
      'click [data-action=info-timer]': 'showInfoTimer',
      'click [data-action=info-weather]': 'showInfoWeather',
      'click [data-action=info-text]': 'showInfoText',
      'click [data-action=info-textUrl]': 'showInfoTextUrl',
      'click [data-action=info-courses]': 'showInfoCourses',
      'click [data-action=info-statistic]': 'showInfoStatistic',
      'click [data-action=info-traffic]': 'showInfoTraffic',
      'click [data-action=info-image]': 'showInfoImage',
      'input [name=search-group]': 'searchGroup',
      'click #dismiss': 'hideSidebar',
      'click .overlay': 'hideSidebar',
      'click [data-action=close-info]': 'hideAllInfo'
    },
    initialize: function () {
      this.constructorId = window.location.pathname.replace('/constructor/', '');

      this.files = [];
      this.userGroups = null;
      this.userGroupsSearch = null;
      this.groupData = null;
      this.userData = null;

      var self = this;
      Backbone.$.ajax({
        async: false,
        url: App.url + '/api/v1/groups',
        success: function (groups) {
          self.userGroups = new Backbone.Collection(groups);
          self.userGroupsSearch = new Backbone.Collection(groups);
        },
        error: function (err) {
          if (err.status == 401) {
            window.location = '/login';
          }
        }
      });

      Backbone.$.ajax({
        async: false,
        url: App.url + '/api/v1/group/' + this.constructorId,
        success: function (groupData) {
          self.groupData = groupData.data;
        },
        error: function (err) {
          Backbone.$.notify("Произошла ошибка", "error");
          if (err.status == 401) {
            window.location = '/login';
          }
        }
      });

      Backbone.$.ajax({
        async: false,
        url: App.url + '/api/v1/current_user',
        success: function (userData) {
          self.userData = userData;
        },
        error: function (err) {
          Backbone.$.notify("Произошла ошибка", "error");
          if (err.status == 401) {
            window.location = '/login';
          }
        }
      });

      this.widgets = new Backbone.Collection();
      Backbone.$.ajax({
        async: false,
        method: "GET",
        dataType: "json",
        url: App.url + '/api/v1/group/' + this.constructorId + '/cover',
        success: function (resp) {
          resp.data.map(function (widget) {
            switch (widget.name) {
              case 'subscriber':
                this.widgets.add(new subscriberModel(widget));
                break;
              case 'winner':
                this.widgets.add(new winnerModel(widget));
                break;
              case 'date':
                this.widgets.add(new dateTimeModel(widget));
                break;
              case 'text':
                this.widgets.add(new textModel(widget));
                break;
              case 'url':
                this.widgets.add(new textUrlModel(widget));
                break;
              case 'timer':
                this.widgets.add(new timerModel(widget));
                break;
              case 'weather':
                this.widgets.add(new weatherModel(widget));
                break;
              case 'currency':
                this.widgets.add(new coursesModel(widget));
                break;
              case 'statistic':
                this.widgets.add(new statisticModel(widget));
                break;
              case 'commentatorLast':
                this.widgets.add(new commentatorLastModel(widget));
                break;
              case 'reposterLast':
                this.widgets.add(new reposterLastModel(widget));
                break;
              case 'commentatorDay':
                this.widgets.add(new commentatorDayModel(widget));
                break;
              case 'reposterDay':
                this.widgets.add(new reposterDayModel(widget));
                break;
              case 'likerDay':
                this.widgets.add(new likerDayModel(widget));
                break;
              case 'commentatorLikes':
                this.widgets.add(new commentatorLikesModel(widget));
                break;
              case 'traffic':
                this.widgets.add(new trafficModel(widget));
                break;
              case 'image':
                this.widgets.add(new imageModel(widget));
                break;
            }
          }.bind(this));
        }.bind(this),
        error: function (err) {
          if (err.status == 401) {
            window.location = '/login';
          }
        }
      });

      this.showHints = window.localStorage.getItem('showHints') || true;

      var enjoyhint_instance = new EnjoyHint({
        onStart: function () {
          window.localStorage.setItem('showHints', false);
        }
      });

      var enjoyhint_script_steps = [
        {
          'click .sidebar-widgetsAdd': 'Нажмите кнопку "Добавить виджет" для добавления первого виджета',
          "nextButton": {text: "Следущее"},
          "skipButton": {text: "Понял!"}
        }
      ];

      enjoyhint_instance.set(enjoyhint_script_steps);

      if (this.showHints === true) {
        enjoyhint_instance.run();
      }
    },

    onShow: function () {
      //this.showChildView('widgetSettings', new subscriberView({model: new subscriberModel()}));
      this.showChildView('activeWidgets', new activeWidgetsView({collection: this.widgets}));
      this.showChildView('widgets', new coverWidgetsView({collection: this.widgets}));

      var options = {collection: this.userGroupsSearch, template: 'constructor'};
      this.showChildView('groups', new groupsView(options));
      Backbone.$('#group-name').html('<strong><a target="_blank" href="http://vk.com/club' + this.groupData.social_id + '">' + this.groupData.title + '</a></strong>');
      Backbone.$('#coverEditorZone').css('background', 'url(' + App.url + '/api/v1/group/' + this.constructorId + '/cover/background)');

      Backbone.$('#file-upload').on('change', function (e) {
        this.uploadFile(e.target.files[0]);
        Backbone.$('#file-upload').val('');
      }.bind(this));


      Backbone.$("#sidebar").niceScroll({
        cursorcolor: '#53619d',
        cursorwidth: 4,
        cursorborder: 'none'
      });

      Backbone.$('#sidebarCollapse').on('click', function () {
        Backbone.$('#sidebar').addClass('active');
        Backbone.$('.overlay').fadeIn();
        Backbone.$('.collapse.in').toggleClass('in');
        Backbone.$('a[aria-expanded=true]').attr('aria-expanded', 'false');
      });

      if (this.groupData.is_closed) {
        Backbone.$.notify("Для закрытых групп недоступны виджеты комментаторов", "warn");
      }

    },
    hideSidebar: function (e) {
      Backbone.$('#sidebar').removeClass('active');
      Backbone.$('.overlay').fadeOut();
    },
    uploadFile: function (file) {
      if (file.size > 3072000) {
        Backbone.$.notify("Размер файла до 3х мб", "warn");
      } else {
        var _URL = window.URL || window.webkitURL;

        var self = this;

        var img = new Image();
        img.onload = function () {
          //if (this.width === 1590 && this.height === 400){
          var formData = new FormData();
          formData.append('file', file);

          Backbone.$.ajax({
            method: "POST",
            processData: false,
            contentType: false,
            data: formData,
            url: App.url + '/api/v1/group/' + self.constructorId + '/cover/background',
            success: function (resp) {
              Backbone.$.notify("Фон загружен", "success");
              Backbone.$('#coverEditorZone').css('background', 'none');
              Backbone.$('#coverEditorZone').css('background', 'url(' + App.url + '/api/v1/group/' + self.constructorId + '/cover/background)');
            },
            error: function (err) {
              Backbone.$.notify("Произошла ошибка", "error");
              if (err.status == 401) {
                window.location = '/login';
              }
            }
          });
          // }else{
          //   Backbone.$.notify("Размер фона должен быть 1590x400", "warn");
          // }
        };
        img.src = _URL.createObjectURL(file);
      }
    },
    onChildviewSettingsShow: function (collection, model) {
      switch (model.model.get('name')) {
        case 'subscriber':
          this.showChildView('widgetSettings', new subscriberView({model: model.model}));
          break;
        case 'winner':
          this.showChildView('widgetSettings', new winnerView({model: model.model}));
          break;
        case 'date':
          this.showChildView('widgetSettings', new dateTimeView({model: model.model}));
          break;
        case 'text':
          this.showChildView('widgetSettings', new textView({model: model.model}));
          break;
        case 'url':
          this.showChildView('widgetSettings', new textUrlView({model: model.model}));
          break;
        case 'timer':
          this.showChildView('widgetSettings', new timerView({model: model.model}));
          break;
        case 'weather':
          this.showChildView('widgetSettings', new weatherView({model: model.model}));
          break;
        case 'currency':
          this.showChildView('widgetSettings', new coursesView({model: model.model}));
          break;
        case 'statistic':
          this.showChildView('widgetSettings', new statisticView({model: model.model}));
          break;
        case 'commentatorLast':
          this.showChildView('widgetSettings', new commentatorLastView({model: model.model}));
          break;
        case 'reposterLast':
          this.showChildView('widgetSettings', new reposterLastView({model: model.model}));
          break;
        case 'commentatorDay':
          this.showChildView('widgetSettings', new commentatorDayView({model: model.model}));
          break;
        case 'reposterDay':
          this.showChildView('widgetSettings', new reposterDayView({model: model.model}));
          break;
        case 'likerDay':
          this.showChildView('widgetSettings', new likerDayView({model: model.model}));
          break;
        case 'commentatorLikes':
          this.showChildView('widgetSettings', new commentatorLikesView({model: model.model}));
          break;
        case 'traffic':
          this.showChildView('widgetSettings', new trafficView({model: model.model}));
          break;
        case 'image':
          this.showChildView('widgetSettings', new imageView({model: model.model}));
          break;
      }
    },
    addSubscriber: function () {
      Backbone.$.notify("Виджет подписчика добавлен", "success");
      this.widgets.add(new subscriberModel());
    },
    addWinner: function () {
      Backbone.$.notify("Виджет победителя добавлен", "success");
      this.widgets.add(new winnerModel());
    },
    addText: function () {
      Backbone.$.notify("Виджет текста добавлен", "success");
      this.widgets.add(new textModel());
    },
    addTextUrl: function () {
      Backbone.$.notify("Виджет текста по ссылке добавлен", "success");
      this.widgets.add(new textUrlModel());
    },
    addTimer: function () {
      Backbone.$.notify("Виджет таймера добавлен", "success");
      this.widgets.add(new timerModel());
    },
    addWeather: function () {
      Backbone.$.notify("Виджет погоды добавлен", "success");
      this.widgets.add(new weatherModel());
    },
    addCourses: function () {
      Backbone.$.notify("Виджет курса валют добавлен", "success");
      this.widgets.add(new coursesModel());
    },
    addStatistic: function () {
      Backbone.$.notify("Виджет статистики добавлен", "success");
      this.widgets.add(new statisticModel());
    },
    addDate: function () {
      Backbone.$.notify("Виджет даты добавлен", "success");
      this.widgets.add(new dateTimeModel());
    },
    addLastCommentator: function () {
      var isLastExist = this.widgets.find(function (model) {
        return model.get('name') === 'commentatorLast';
      });

      if (!isLastExist) {
        Backbone.$.notify("Виджет последний комментатор добавлен", "success");
        this.widgets.add(new commentatorLastModel());
      } else {
        Backbone.$.notify("Виджет последнего комментатора уже добавлен. Максимум 1", "warn");
      }

    },
    addLastReposter: function () {
      var isLastExist = this.widgets.find(function (model) {
        return model.get('name') === 'reposterLast';
      });

      if (!isLastExist) {
        Backbone.$.notify("Виджет последний репостер добавлен", "success");
        this.widgets.add(new reposterLastModel());
      } else {
        Backbone.$.notify("Виджет последнего репостер уже добавлен. Максимум 1", "warn");
      }
    },
    addDayCommentator: function () {

      var isLastExist = this.widgets.find(function (model) {
        return model.get('name') === 'commentatorDay';
      });

      if (!isLastExist) {
        Backbone.$.notify("Виджет комментатор дня добавлен", "success");
        this.widgets.add(new commentatorDayModel());
      } else {
        Backbone.$.notify("Виджет комментатора дня уже добавлен. Максимум 1", "warn");
      }

    },
    addDayReposter: function () {

      var isLastExist = this.widgets.find(function (model) {
        return model.get('name') === 'reposterDay';
      });

      if (!isLastExist) {
        Backbone.$.notify("Виджет репостер дня добавлен", "success");
        this.widgets.add(new reposterDayModel());
      } else {
        Backbone.$.notify("Виджет репостер дня уже добавлен. Максимум 1", "warn");
      }

    },
    addDayLiker: function () {
      var isLastExist = this.widgets.find(function (model) {
        return model.get('name') === 'likerDay';
      });

      if (!isLastExist) {
        Backbone.$.notify("Виджет лайкер дня добавлен", "success");
        this.widgets.add(new likerDayModel());
      } else {
        Backbone.$.notify("Виджет лайкер дня уже добавлен. Максимум 1", "warn");
      }
    },
    addLikesCommentator: function () {
      var isLastExist = this.widgets.find(function (model) {
        return model.get('name') === 'commentatorLikes';
      });

      if (!isLastExist) {
        Backbone.$.notify("Виджет комментатор по лайкам добавлен", "success");
        this.widgets.add(new commentatorLikesModel());
      } else {
        Backbone.$.notify("Виджет комментатора по лайкам уже добавлен. Максимум 1", "warn");
      }
    },
    addTraffic: function () {
      Backbone.$.notify("Виджет пробок добавлен", "success");
      this.widgets.add(new trafficModel());
    },
    addImage: function () {
      Backbone.$.notify("Виджет изображения добавлен", "success");
      this.widgets.add(new imageModel());
    },
    saveWidgets: function () {
      Backbone.$.ajax({
        async: false,
        method: "POST",
        dataType: "json",
        headers: {
          'Content-Type': 'application/json; charset=UTF-8'
        },
        url: App.url + '/api/v1/group/' + this.constructorId + '/cover',
        data: JSON.stringify(this.widgets.toJSON(), null, 4),
        success: function () {
          Backbone.$.notify("Обложка сохранена", "success");
        }
      });
    },
    toggleMarkup: function (e) {
      if (e.target.checked) {
        Backbone.$('#coverEditorZoneMarkup').css('background', 'url(/libs/adminlte/dist/img/markup.png)');
      } else {
        Backbone.$('#coverEditorZoneMarkup').css('background', 'none');
      }
    },
    searchGroup: function (e) {

      var userGroupsSearch = this.userGroups.filter(function (group) {

        if (~group.get('title').toLowerCase().indexOf(e.target.value.toLowerCase()) || ~group.get('social_id').toLowerCase().indexOf(e.target.value.toLowerCase())) {
          return true;
        }

        return false;
      });

      this.userGroupsSearch.reset(userGroupsSearch);
    },
    showPreview: function (e) {
      var img = document.getElementById('preview-image');
      img.src = '';

      Backbone.$('.modalCover_groupImg').loading({circles: 3, overlay: true});
      Backbone.$('.js-loading-indicator').css('display', 'block');
      Backbone.$('.js-loading-overlay').css('display', 'block');

      Backbone.$.ajax({
        async: true,
        method: "POST",
        headers: {
          'Content-Type': 'application/json; charset=UTF-8'
        },
        url: App.url + '/api/v1/group/' + this.constructorId + '/preview',
        data: JSON.stringify(this.widgets.toJSON(), null, 4),
        success: function (res) {
          var img = document.getElementById('preview-image');
          img.src = 'data:image/png;base64,' + res;
          Backbone.$('.modalCover_groupImg').loading({hide: true});
          Backbone.$('.js-loading-indicator').css('display', 'none');
          Backbone.$('.js-loading-overlay').css('display', 'none');
        }
      });
    },
    serializeData: function () {
      var model = this.model.toJSON();

      return _.extend(model, {
        isClosed: this.groupData.is_closed,
        isStatus: this.userData.permissions.has_stats
      });
    },
    showInfoSubscriber: function (e) {
      Backbone.$('#info-subscriber').show();
    },
    showInfoWinner: function (e) {
      Backbone.$('#info-winner').show();
    },
    showInfoCommLast: function (e) {
      Backbone.$('#info-last-comment').show();
    },
    showInfoCommLikes: function (e) {
      Backbone.$('#info-comm-likes').show();
    },
    showInfoCommDay: function (e) {
      Backbone.$('#info-comm-day').show();
    },
    showInfoReposterDay: function (e) {
      Backbone.$('#info-reposter-day').show();
    },
    showInfoLikerDay: function (e) {
      Backbone.$('#info-liker-day').show();
    },
    showInfoReposterLast: function (e) {
      Backbone.$('#info-reposter-last').show();
    },
    showInfoDate: function (e) {
      Backbone.$('#info-date').show();
    },
    showInfoTimer: function (e) {
      Backbone.$('#info-timer').show();
    },
    showInfoWeather: function (e) {
      Backbone.$('#info-weather').show();
    },
    showInfoText: function (e) {
      Backbone.$('#info-text').show();
    },
    showInfoTextUrl: function (e) {
      Backbone.$('#info-textUrl').show();
    },
    showInfoCourses: function (e) {
      Backbone.$('#info-courses').show();
    },
    showInfoStatistic: function (e) {
      Backbone.$('#info-statistic').show();
    },
    showInfoTraffic: function (e) {
      Backbone.$('#info-traffic').show();
    },
    showInfoImage: function (e) {
      Backbone.$('#info-image').show();
    },
    hideAllInfo: function (e) {
      if (e.target.className !== 'fa fa-question') {
        Backbone.$('#info-subscriber').hide();
        Backbone.$('#info-winner').hide();
        Backbone.$('#info-last-comment').hide();
        Backbone.$('#info-comm-likes').hide();
        Backbone.$('#info-comm-day').hide();
        Backbone.$('#info-reposter-day').hide();
        Backbone.$('#info-liker-day').hide();
        Backbone.$('#info-reposter-last').hide();
        Backbone.$('#info-date').hide();
        Backbone.$('#info-timer').hide();
        Backbone.$('#info-weather').hide();
        Backbone.$('#info-text').hide();
        Backbone.$('#info-textUrl').hide();
        Backbone.$('#info-courses').hide();
        Backbone.$('#info-statistic').hide();
        Backbone.$('#info-traffic').hide();
        Backbone.$('#info-image').hide();
      }
    }
  });
});
