define([
    'marionette'
], function (Marionette) {
    'use strict';
    return Marionette.AppRouter.extend({
        appRoutes: {
            '': 'showGroupsPage',
            'price':  'showPricePage',
            'notifications':  'showNotificationsPage',
            'rewards':  'showReferalsPage',
            'history':  'showHistoryPage',
            'constructor/:groupId':  'showConstructorPage'
        }
    });
});
