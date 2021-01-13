define([
  'app',
  'marionette',
  'backbone',
  'underscore',
  'pace',
  'text!templates/price/index.ejs',
  'helpers',
], function (App, Marionette, Backbone, _, pace, priceTmpl, helpers) {
  'use strict';

  return Marionette.LayoutView.extend({
    template: _.template(priceTmpl),
    ui: {},
    events: {},
    onShow: function () {
      var current_user = helpers.getData('/api/v1/current_user');
      var priceData1 = helpers.getData('/api/v1/payment/price/1/1');
      var priceData5 = helpers.getData('/api/v1/payment/price/1/5');
      var priceData10 = helpers.getData('/api/v1/payment/price/1/10');
      var priceData20 = helpers.getData('/api/v1/payment/price/1/20');

      if (priceData1.original_price !== priceData1.price) {
        Backbone.$('#discountTitle').html('Сейчас действует акция, скидка 30%');
      }

      Backbone.$('#one-groups input[name="sum"]').val(priceData1.price);
      if (priceData1.original_price !== priceData1.price) {
        Backbone.$("#priceTotal").html('<p class="discount"><strike style="font-size: 20px;">' + priceData1.original_price + '</strike>' + (priceData1.price) +'<br><i class="fa fa-ruble"></i></p>');
      } else {
        Backbone.$("#priceTotal").html('<p>' + (priceData1.price) +'<i class="fa fa-ruble"></i></p>');
      }


      Backbone.$('#five-groups input[name="sum"]').val(priceData5.price);
      if (priceData5.original_price !== priceData5.price) {
        Backbone.$("#priceTotal5").html('<p class="discount"><strike style="font-size: 20px;">' + priceData5.original_price + '</strike>' + (priceData5.price) +'<br><i class="fa fa-ruble"></i></p>');
      } else {
        Backbone.$("#priceTotal5").html('<p>' + (priceData5.price) +'<i class="fa fa-ruble"></i></p>');
      }

      Backbone.$('#ten-groups input[name="sum"]').val(priceData10.price);
      if (priceData10.original_price !== priceData10.price) {
        Backbone.$("#priceTotal10").html('<p class="discount"><strike style="font-size: 20px;">' + priceData10.original_price + '</strike>' + (priceData10.price) +'<br><i class="fa fa-ruble"></i></p>');
      } else {
        Backbone.$("#priceTotal10").html('<p>' + (priceData10.price) +'<i class="fa fa-ruble"></i></p>');
      }

      Backbone.$('#twenty-groups input[name="sum"]').val(priceData20.price);
      if (priceData20.original_price !== priceData20.price) {
        Backbone.$("#priceTotal20").html('<p class="discount"><strike style="font-size: 20px;">' + priceData20.original_price + '</strike>' + (priceData20.price) +'<br><i class="fa fa-ruble"></i></p>');
      } else {
        Backbone.$("#priceTotal20").html('<p>' + (priceData20.price) +'<i class="fa fa-ruble"></i></p>');
      }

      if (current_user === 'error'){
        window.location = '/login';
      }

      Array.from(document.querySelectorAll('[name=customerNumber]')).map(function (el) {
        el.value = current_user.id;
      });
      var totalGroups = 1;
      var totalMonth = 1;
      var priceTotal = Backbone.$("#priceTotal");
      var totalPrice = 180;
      Backbone.$('.btn-number').click(function(e){
        e.preventDefault();
        var fieldName = Backbone.$(this).attr('data-field');
        var type = Backbone.$(this).attr('data-type');
        var input = Backbone.$("input[name='"+fieldName+"']");
        var inputG = document.querySelector("input[name='groupsCount']");
        var inputM = document.querySelector("input[name='monthsCount']");
        var sum = document.querySelector("input[name='sum']");
        var currentVal = parseInt(input.val());

        if (!isNaN(currentVal)) {
          if(type == 'minus') {
            if(currentVal > input.attr('min')) {

              if (fieldName === 'groupCount'){
                totalGroups = currentVal - 1;
                inputG.value = totalGroups;
                input.val(totalGroups).change();
              }else{
                totalMonth = currentVal - 1;
                inputM.value = totalMonth;
                input.val(totalMonth).change();
              }


            }
            if(parseInt(input.val()) == input.attr('min')) {
              Backbone.$(this).attr('disabled', true);
            }else{
              Backbone.$(this).attr('disabled', false);
            }

          } else if(type == 'plus') {

            if(currentVal < input.attr('max')) {
              if (fieldName === 'groupCount'){
                totalGroups = currentVal + 1;
                inputG.value = totalGroups;
                input.val(totalGroups).change();
              }else{
                totalMonth = currentVal + 1;
                inputM.value = totalMonth;
                input.val(totalMonth).change();
              }

            }
            if(parseInt(input.val()) == input.attr('max')) {
              Backbone.$(this).attr('disabled', true);
            }else{
              Backbone.$("[data-type=\"minus\"]").attr('disabled', false);
            }

          }
        } else {
          input.val(0);
        }

        var currentPrice = helpers.getData('/api/v1/payment/price/' + totalMonth + '/' + totalGroups);

        // if (totalGroups === 1){
        //   totalPrice = 180;
        // }
        // if (totalGroups > 1 && totalGroups < 5){
        //   totalPrice = 170 * totalGroups;
        // }
        // if (totalGroups > 4 && totalGroups < 10){
        //   totalPrice = 150 * totalGroups;
        // }
        // if (totalGroups > 9){
        //   totalPrice = 130 * totalGroups;
        // }
        if (currentPrice.original_price !== currentPrice.price) {
          priceTotal.html('<p class="discount"><strike style="font-size: 20px;">' + currentPrice.original_price + '</strike>' + (currentPrice.price) +'<br><i class="fa fa-ruble"></i></p>');
        } else {
          priceTotal.html('<p>' + (currentPrice.price) +'<i class="fa fa-ruble"></i></p>');
        }

        sum.value = currentPrice.price;

      });
      Backbone.$('.input-number').focusin(function(){
        Backbone.$(this).data('oldValue', Backbone.$(this).val());
      });
      Backbone.$(".input-number").keydown(function (e) {
        // Allow: backspace, delete, tab, escape, enter and .
        if (Backbone.$.inArray(e.keyCode, [46, 8, 9, 27, 13, 190]) !== -1 ||
          // Allow: Ctrl+A
          (e.keyCode == 65 && e.ctrlKey === true) ||
          // Allow: home, end, left, right
          (e.keyCode >= 35 && e.keyCode <= 39)) {
          // let it happen, don't do anything
          return;
        }
        // Ensure that it is a number and stop the keypress
        if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
          e.preventDefault();
        }
      });
    }
  });

});
