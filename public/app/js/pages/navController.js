define([
    'app',
    'marionette',
    'backbone',
    'jquery',
    'js/pages/groups/groupsView',
    'js/pages/price/priceView',
    'js/pages/constructor/constructorView',
    'js/pages/history/historyView',
    'js/pages/notifications/notificationsView',
    'js/pages/referals/referalsView'
], function (App, Marionette, Backbone, $, groupsView, priceView, constructorView, historyView, notificationsView, referalsView) {
    'use strict';

    return Marionette.Controller.extend({
        showGroupsPage: function () {
            var pageModel;

            pageModel = App.pages.findWhere({name: 'groups'});
            App.main.show(new groupsView({model: pageModel}));
        },
        showPricePage: function () {
            var pageModel;

            pageModel = App.pages.findWhere({name: 'price'});
            App.main.show(new priceView({model: pageModel}));
        },
        showHistoryPage: function () {
            var pageModel;

            pageModel = App.pages.findWhere({name: 'history'});
            App.main.show(new historyView({model: pageModel}));
        },
        showNotificationsPage: function () {
            var pageModel;

            pageModel = App.pages.findWhere({name: 'notifications'});
            App.main.show(new notificationsView({model: pageModel}));
        },
        showReferalsPage: function () {
            var pageModel;

            pageModel = App.pages.findWhere({name: 'rewards'});
            App.main.show(new referalsView({model: pageModel}));
        },
        showConstructorPage: function (groupId) {
            var pageModel;

            pageModel = App.pages.findWhere({name: 'constructor'});
            pageModel.set('groupId', groupId);
            App.main.show(new constructorView({model: pageModel}));
        }
    });
});