define([
    'app',
    'marionette',
    'js/routers/index',
    'js/pages/navController'
], function (App, Marionette, Router, Controller) {
    return App.module("Pages", function () {
        this.startWithParent = false;
        this.addInitializer(function () {
            this.router = new Router({controller: new Controller()});
        });
    })
});