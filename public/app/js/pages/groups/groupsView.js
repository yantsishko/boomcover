define([
    'app',
    'marionette',
    'backbone',
    'underscore',
    'pace',
    'text!templates/groups/index.ejs',
    './collectionView',
    'enjoyhint'
], function (App, Marionette, Backbone, _, pace, groupsTmpl, collectionView, enjoyhint) {
    'use strict';

    return Marionette.LayoutView.extend({
        template: _.template(groupsTmpl),
        initialize: function () {
            this.userGroups = null;
            var self = this;
            Backbone.$.ajax({
                async: false,
                url: App.url + '/api/v1/groups',
                success: function (groups) {
                    self.userGroups = new Backbone.Collection(groups);
                },
                error: function (err) {
                  if (err.status == 401) {
                    window.location = '/login';
                  }
                }
            });
        },
        regions: {
            groups: '[data-selector=groups]'
        },
        events: {
            'click [data-action=update-groups]': 'updateGroups'
        },
        onShow: function () {
            var options = {collection: this.userGroups};
            this.showChildView('groups', new collectionView(options));

              this.showHints = window.localStorage.getItem('showHintsNotifications') || true;
              this.showHintsAction = window.localStorage.getItem('showHintsActions') || true;

              // var enjoyhint_instance = new EnjoyHint({
              //   onStart: function(){
              //     window.localStorage.setItem('showHintsNotifications', false);
              //   }
              // });

              var enjoyhint_instanceActions = new EnjoyHint({
                onStart: function(){
                  window.localStorage.setItem('showHintsActions', false);
                }
              });

              // var enjoyhint_script_steps = [
              //   {
              //     'click #notifications' : 'Перейдите на страницу уведомлений, чтоб разрешить отправлять вам сообщения',
              //     "skipButton" : {text: "Понял!"}
              //   }
              // ];

              // var enjoyhint_script_stepsActions = [
              //   {
              //     'next #vk_groups' : 'Хотите получить дополнительно 5 бесплатных дней? Вступите в группу и напишите нам об этом!',
              //     "nextButton": {text: "Хочу еще 10 бесплатных дней!"},
              //     "skipButton" : {text: "Не хочу"}
              //   },
              //   {
              //     'next #vk_allow_messages_from_community' : 'Подпишитесь на уведомления и напишите отзыв в обсуждениях группы!',
              //     "nextButton": {text: "Я сделал, я молодец :)"},
              //     "skipButton" : {text: "Не хочу"}
              //   }
              // ];

              var enjoyhint_script_stepsActions = [
                {
                  'click #vk_buttons' : 'Хотите получить дополнительно 5 бесплатных дней? Вступите в группу и напишите нам об этом! <br> Также подпишитесь на уведомления, чтоб получать от нас новости о новых виджетах',
                  "skipButton" : {text: "Хорошо"}
                }
              ];

              // enjoyhint_instance.set(enjoyhint_script_steps);
              enjoyhint_instanceActions.set(enjoyhint_script_stepsActions);

              // if (this.showHints === true) {
              //   enjoyhint_instance.run();
              // }
              
              if (this.showHintsAction === true) {
                enjoyhint_instanceActions.run();
              }
        },
        updateGroups: function () {
          Backbone.$.ajax({
            async: false,
            url: App.url + '/api/v1/groups',
            success: function () {
              location.reload();
            },
            error: function (err) {
              if (err.status == 401) {
                window.location = '/login';
              }
            }
          });
        }
    });

});
