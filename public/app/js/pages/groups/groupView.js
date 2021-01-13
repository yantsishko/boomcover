define([
  'app',
  'marionette',
  'backbone',
  'underscore',
  'text!templates/groups/group.ejs',
  'text!templates/groups/groupShort.ejs',
  'notify'
], function (App, Marionette, Backbone, _, groupTmpl, groupShortTmpl, notify) {
  'use strict';

  return Marionette.ItemView.extend({
    events: {
      'click [type=button]': 'showGroupCover',
      'click [data-action=unconnect-group]': 'unconnectGroup'
    },
    modelEvents: {
      'change': 'render'
    },
    className: function () {
      return (this.options.templateName === 'main') ? '' : 'group-avatar redactor-group-active';
    },
    initialize: function () {
      this.template = (this.options.templateName === 'main') ? _.template(groupTmpl) : _.template(groupShortTmpl);
    },
    showGroupCover: function (e) {
      if (this.model.get('connected')) {
        window.location = '/#constructor/' + this.model.id;
      } else {
        Backbone.$.ajax({
          async: false,
          url: App.url + '/api/v1/group/authorize/' + this.model.id,
          success: function (group_login_url) {
            window.location = group_login_url;
          },
          error: function (err) {
            Backbone.$.notify("У Вас подключено максимальное количество групп для данного тарифа.", "error");
          }
        });
      }
    },
    unconnectGroup: function (e) {
      var self = this;
      if (e.target.checked) {
        Backbone.$.ajax({
          async: false,
          method: "POST",
          url: App.url + '/api/v1/group/' + this.model.id + '/unconnect',
          success: function (group_login_url) {
            Backbone.$.notify("Группа отключена успешно", "success");
            self.model.set('connected', false);
          }
        });
      }

    }
  });

});