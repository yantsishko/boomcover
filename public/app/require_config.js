requirejs.config({
  baseUrl: "../../app/dist/",
  urlArgs: "v=" + (new Date()).getTime(),
  paths: {
    moment: "../../libs/adminlte/plugins/daterangepicker/moment",
    spinner: "../../libs/spinner/jquery-loading",
    momentru: "../../libs/adminlte/locales/moment-with-locales.min",
    jquery: "../../libs/jquery/dist/jquery.min",
    daterangepicker: "../../libs/adminlte/plugins/daterangepicker/daterangepicker",
    rangeslider: "../../libs/adminlte/plugins/ionslider/ion.rangeSlider.min",
    backbone: "../../libs/backbone/backbone-min",
    marionette: "../../libs/backbone.marionette/lib/backbone.marionette.min",
    underscore: "../../libs/underscore/underscore-min",
    bootstrapslider: "../../libs/bootstrap-slider/bootstrap-slider",
    bootstrapcolorpicker: "../../libs/adminlte/plugins/colorpicker/bootstrap-colorpicker",
    datetimepicker: "../../libs/eonasdan-bootstrap-datetimepicker/build/js/bootstrap-datetimepicker.min",
    bootstraplocales: "../../libs/adminlte/locales/bootstrap-datetimepicker.ru",
    bootstrapselect: "../../libs/bootstrap-select/bootstrap-select.min",
    jqueryui: "../../libs/jquery-ui/jquery-ui",
    notify: "../../libs/notify/notify.min",
    nicescroll: "../../libs/sidebar/jquery.nicescroll.min",
    helpers: "js/helpers/helpers",
    mainLayout: "js/helpers/mainLayout",
    ejs: "../../libs/ejs/ejs.min",
    text: "../../libs/text/text",
    pace: "../../libs/PACE/pace",
    enjoyhint: "../../libs/enjoyhint/enjoyhint",
    app: "app",
    //widgets
    subscriber: "js/models/widgets/subscriber/subscriber"
  },

  shim: {
    underscore: {
      exports: "_"
    },
    backbone: {
      deps: ["jquery", "underscore"],
      exports: "Backbone"
    },
    marionette: {
      deps: ["backbone"],
      exports: "Marionette"
    },
    ejs: {
      exports: 'ejs'
    },
    daterangepicker: {
      deps: ["jquery"],
      exports: 'daterangepicker'
    },
    enjoyhint: {
      deps: ["jquery"],
      exports: 'enjoyhint'
    }
    // moment: {
    //   deps: ["momentru"],
    //   exports: 'moment'
    // }
    // datetimepicker: {
    //   deps: ["moment"],
    //   exports: 'datetimepicker'
    // }
  }
});


define(['app', 'js/modules/index', 'pace'], function (App, PagesModule, pace) {
  pace.start({
    restartOnRequestAfter: false,
    eventLag: false,
    restartOnPushState: false,
    ajax: {
      trackMethods: [
        "GET",
        "POST"
      ]
    }
  });
  pace.restart();
  if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|OperaMini/i.test(navigator.userAgent)) {
    document.body.classList.add('mobile-device');
  }
  App.addInitializer(function () {
    PagesModule.start();
  });
  App.start();
});
