define([
    'app',
    'marionette',
    'text!templates/widgets/activeWidgets/index.ejs',
    'underscore',
], function (App, Marionette, widgetTmpl, _) {

    'use strict';

    return Marionette.ItemView.extend({
        template: _.template(widgetTmpl),
        ui: {
            toggle: 'input[data-action=active-widget]'
        },
        events: {
            'click @ui.toggle': 'toggleWidget'
        },
        triggers: {
            'click [data-action=show-settings]': 'select:item',
            'click [data-action=delete-widget]': 'delete:item'
        },
        modelEvents: {
            'change': 'render'
        },
        toggleWidget: function (e) {
            this.model.set('isShown', e.target.checked);
        },
        serializeData: function () {
            var model = _.defaults(this.model.toJSON());

            return _.extend(model, this.options, {
                id: this.model.cid
            });
        }
    });
});