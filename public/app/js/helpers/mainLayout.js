define([
  'helpers',
  'backbone',
  'moment',
  'notify',
], function (helpers, Backbone, moment, notify) {

  Backbone.$('#logout').on('click', function (e) {
    helpers.getData('/logout');
    window.localStorage.setItem('token', '');
    window.location = 'https://boomcover.com';
  });

  var _updateUserData = function () {
    var current_user = helpers.getData('/api/v1/current_user');

    if (current_user === 'error') {
      window.location = '/login';
    }

    Backbone.$('#user-avatar').attr('src', current_user.img);
    Backbone.$('#user-avatar').css('visibility', 'visible');
    Backbone.$('#user-avatar-main-1').css('visibility', 'visible');
    Backbone.$('#user-avatar-main-1').attr('src', current_user.img);
    Backbone.$('#user-avatar-main-2').attr('src', current_user.img);
    Backbone.$('#user_name_toolbar').text(current_user.full_name);
    Backbone.$('#groups-count').text(current_user.groups_count);
    Backbone.$('#user_name_popup').text(current_user.full_name);
    if (current_user.transactions.length){
      var block = 'Групп: ' + current_user.available_group_count;
      for( var i = 0; i < current_user.transactions.length; i++){
        block += '<br> Действителен до: <br><span class="expiry-date">' + moment(current_user.transactions[i].end_date).format('DD.MM.YYYY') + '</span>'
      }
      Backbone.$('#ballance_menu').html(block);
    } else{
      Backbone.$.notify("У Вас закончилась подписка, купите необходимый тариф", "error");
    }

  };

  return {
    updateUserData: _updateUserData
  }
});