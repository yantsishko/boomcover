define(["app","marionette","backbone","underscore","text!templates/widgets/reposterDay/index.ejs","bootstrapcolorpicker","datetimepicker","moment"],function(e,t,n,o,a,i,s,r){"use strict";return t.ItemView.extend({template:o.template(a),ui:{subscriber1:"select[name=reposter_day_form]",position:"select[name=reposter_day_namePosition]"},events:{"change select[name=reposter_day_form]":"changeForm","change select[name=reposter_day_namePosition]":"changeNamePosition","change select[name=reposter_day_name_font]":"changeNameFont","change select[name=reposter_day_lname_font]":"changeLNameFont","change select[name=reposts_color]":"changeRepostsColor","change input[name=reposter_day_name_show]":"toggleName","change input[name=reposter_day_name_register]":"toggleNameRegister","change input[name=reposter_day_lname_show]":"toggleLName","change input[name=reposter_day_lname_register]":"toggleLNameRegister","change input[name=reposter_day_name_bold]":"nameFontBold","change input[name=reposter_day_lname_bold]":"lNameFontBold","change input[name=reposter_day_name_italic]":"nameFontItalic","change input[name=reposter_day_lname_italic]":"lNameFontItalic","change input[name=reposter_day_name_tiny]":"nameFontTiny","change input[name=reposter_day_lname_tiny]":"lNameFontTiny","change input[name=reposter_day_reposts_count_show]":"toggleCount"},initialize:function(e){},onRender:function(){this.setSliders();var e=this;this.$el.find("#reposter_day_name_color").colorpicker().on("changeColor",function(){e.$el.find("#subscribers_name_color_p").css("background",e.$el.find(this).colorpicker("getValue","#ffffff")),e.model.set("nameColor",e.$el.find(this).colorpicker("getValue","#ffffff"))}),this.$el.find("#reposter_day_lname_color").colorpicker().on("changeColor",function(){e.$el.find("#reposter_day_lname_color_p").css("background",e.$el.find(this).colorpicker("getValue","#ffffff")),e.model.set("lnameColor",e.$el.find(this).colorpicker("getValue","#ffffff"))}),this.$el.find("#reposter_day_image_border_color").colorpicker().on("changeColor",function(){e.$el.find("#reposter_day_image_border_color_p").css("background",e.$el.find(this).colorpicker("getValue","#ffffff")),e.model.set("borderColor",e.$el.find(this).colorpicker("getValue","#ffffff"))})},changeNamePosition:function(){this.model.set("namePosition",this.ui.position.val())},changeRepostsColor:function(){var e=this.$el.find("[name=reposts_color]").val();this.model.set("reposterIconColor",e)},changeForm:function(){this.model.set("imageFigure",this.ui.subscriber1.val())},toggleName:function(e){e.target.checked?this.model.set("nameShow",!1):this.model.set("nameShow",!0)},toggleNameRegister:function(e){e.target.checked?this.model.set("nameUppercase",!0):this.model.set("nameUppercase",!1)},toggleLName:function(e){e.target.checked?this.model.set("lnameShow",!1):this.model.set("lnameShow",!0)},toggleCount:function(e){e.target.checked?this.model.set("repostsCountShow",!0):this.model.set("repostsCountShow",!1)},toggleLNameRegister:function(e){e.target.checked?this.model.set("lnameUppercase",!0):this.model.set("lnameUppercase",!1)},changeNameFont:function(e){var t=this.$el.find("[name=reposter_day_name_font]").val();this.model.set("nameFont",t)},changeLNameFont:function(e){var t=this.$el.find("[name=reposter_day_lname_font]").val();this.model.set("lnameFont",t)},nameFontBold:function(e){e.target.checked?(this.$el.find("[name=reposter_day_name_tiny]").prop("checked",!1),this.$el.find("[name=reposter_day_name_tiny]").parent().removeClass("active"),this.model.set("nameFontWeight","700")):this.model.set("nameFontWeight","none")},nameFontItalic:function(e){e.target.checked?this.model.set("nameItalic",!0):this.model.set("nameItalic",!1)},nameFontTiny:function(e){e.target.checked?(this.$el.find("[name=reposter_day_name_bold_1]").prop("checked",!1),this.$el.find("[name=reposter_day_name_bold_1]").parent().removeClass("active"),this.model.set("nameFontWeight","300")):this.model.set("nameFontWeight","none")},lNameFontBold:function(e){e.target.checked?(this.$el.find("[name=reposter_day_lname_tiny_1]").prop("checked",!1),this.$el.find("[name=reposter_day_lname_tiny_1]").parent().removeClass("active"),this.model.set("lnameFontWeight","700")):this.model.set("lnameFontWeight","none")},lNameFontItalic:function(e){e.target.checked?this.model.set("lnameItalic",!0):this.model.set("lnameItalic",!1)},lNameFontTiny:function(e){e.target.checked?(this.$el.find("[name=reposter_day_lname_bold_1]").prop("checked",!1),this.$el.find("[name=reposter_day_lname_bold_1]").parent().removeClass("active"),this.model.set("lnameFontWeight","300")):this.model.set("lnameFontWeight","none")},setSliders:function(){var e=this;this.$el.find("#datetimepicker").datetimepicker({format:"HH:mm"}),this.$el.find("#datetimepicker").on("dp.change",function(t){e.model.set("changeTime",r(t.date).format("HH:mm"))}),this.$el.find("#reposter_day_min_reposts").ionRangeSlider({type:"single",min:0,max:30,from:e.model.get("minReposts"),step:1,postfix:" <div class='fa fa-bullhorn'></div>",onChange:function(t){e.model.set("minReposts",t.from)}}),this.$el.find("#reposter_day_image_size").ionRangeSlider({type:"single",min:50,max:150,from:e.model.get("imageSize"),step:1,postfix:" px",onChange:function(t){e.model.set("imageSize",t.from)}}),this.$el.find("#reposter_day_image_border").ionRangeSlider({type:"single",min:0,max:20,from:e.model.get("borderSize"),step:1,postfix:" px",onChange:function(t){e.model.set("borderSize",t.from)}}),this.$el.find("#reposter_day_text_size_fname").ionRangeSlider({type:"single",min:14,max:80,from:e.model.get("nameSize"),step:1,postfix:" px",onChange:function(t){e.model.set("nameSize",t.from)}}),this.$el.find("#reposter_day_text_size_lname").ionRangeSlider({type:"single",min:14,max:80,from:e.model.get("lnameSize"),step:1,postfix:" px",onChange:function(t){e.model.set("lnameSize",t.from)}})}})});