define([
  'app',
  'marionette',
  'backbone',
  'underscore',
  'pace',
  'text!templates/referals/index.ejs',
  'helpers',
], function (App, Marionette, Backbone, _, pace, referalsTmpl, helpers) {
  'use strict';

  return Marionette.LayoutView.extend({
    template: _.template(referalsTmpl),
    ui: {},
    events: {},
    onShow: function () {
      var current_user = helpers.getData('/api/v1/current_user');
      Backbone.$('#referalLink').val(`https://app.boomcover.com/ref/${current_user.referral_code}`);

      Backbone.$('#shareButton').html(VK.Share.button({
        url: `https://app.boomcover.com/ref/${current_user.referral_code}`,
        title: 'Регистрируйстя в сервисе динамических обложек и получи 5 дней бесплатно',
        image: 'https://pp.userapi.com/c824410/v824410187/2fe54/jdowVZNnZVM.jpg',
        noparse: true
      },{type: "round_nocount", text: "Поделиться"}));

      var user_statistic = helpers.getData('/api/v1/referral/stats');
      Backbone.$('#refPercent').html(`${user_statistic.percent}%`);
      Backbone.$('#refRegistrations').html(`${user_statistic.registrations}`);
      Backbone.$('#refPayments').html(`${user_statistic.payments}`);
      Backbone.$('#refSum').html(`${user_statistic.sum} &#8381;`);
    }
  });

});
