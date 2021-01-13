define(["app","marionette","backbone","underscore","text!templates/widgets/winner/index.ejs","bootstrapcolorpicker"],function(e,n,i,t,a,o){"use strict";return n.ItemView.extend({template:t.template(a),ui:{winner1:"select[name=winner_form_1]",position:"select[name=winner_namePosition]"},events:{"change select[name=winner_form_1]":"changeForm","change select[name=winner_namePosition]":"changeNamePosition","change select[name=winners_name_font_1]":"changeNameFont","change select[name=winners_lname_font_1]":"changeLNameFont","change input[name=winners_name_show_1]":"toggleName","change input[name=winners_name_register_1]":"toggleNameRegister","change input[name=winners_lname_show_1]":"toggleLName","change input[name=winners_lname_register_1]":"toggleLNameRegister","change input[name=winners_name_bold_1]":"nameFontBold","change input[name=winners_lname_bold_1]":"lNameFontBold","change input[name=winners_name_italic_1]":"nameFontItalic","change input[name=winners_lname_italic_1]":"lNameFontItalic","change input[name=winners_name_tiny_1]":"nameFontTiny","change input[name=winners_lname_tiny_1]":"lNameFontTiny","change input[name=winner_id]":"changeId"},initialize:function(e){},onRender:function(){this.setSliders();var e=this;this.$el.find("#winners_name_color_1").colorpicker().on("changeColor",function(){e.$el.find("#winners_name_color_p_1").css("background",e.$el.find(this).colorpicker("getValue","#ffffff")),e.model.set("nameColor",e.$el.find(this).colorpicker("getValue","#ffffff"))}),this.$el.find("#winners_lname_color_1").colorpicker().on("changeColor",function(){e.$el.find("#winners_lname_color_p_1").css("background",e.$el.find(this).colorpicker("getValue","#ffffff")),e.model.set("lnameColor",e.$el.find(this).colorpicker("getValue","#ffffff"))}),this.$el.find("#winners_image_border_color").colorpicker().on("changeColor",function(){e.$el.find("#winners_image_border_color_p").css("background",e.$el.find(this).colorpicker("getValue","#ffffff")),e.model.set("borderColor",e.$el.find(this).colorpicker("getValue","#ffffff"))})},changeForm:function(){this.model.set("imageFigure",this.ui.winner1.val())},changeNamePosition:function(){this.model.set("namePosition",this.ui.position.val())},changeId:function(e){this.model.set("winnerId",e.target.value)},toggleName:function(e){e.target.checked?this.model.set("nameShow",!1):this.model.set("nameShow",!0)},toggleNameRegister:function(e){e.target.checked?this.model.set("nameUppercase",!0):this.model.set("nameUppercase",!1)},toggleLName:function(e){e.target.checked?this.model.set("lnameShow",!1):this.model.set("lnameShow",!0)},toggleLNameRegister:function(e){e.target.checked?this.model.set("lnameUppercase",!0):this.model.set("lnameUppercase",!1)},changeNameFont:function(e){var n=this.$el.find("[name=winners_name_font_1]").val();i.$("#winner_fname_1").css("font-family",n),this.model.set("nameFont",n)},changeLNameFont:function(e){var n=this.$el.find("[name=winners_lname_font_1]").val();i.$("#winner_lname_1").css("font-family",n),this.model.set("lnameFont",n)},nameFontBold:function(e){e.target.checked?(i.$("#winner_fname_1").css("font-weight","700"),this.$el.find("[name=winners_name_tiny_1]").prop("checked",!1),this.$el.find("[name=winners_name_tiny_1]").parent().removeClass("active"),this.model.set("nameFontWeight","700")):(i.$("#winner_fname_1").css("font-weight","initial"),this.model.set("nameFontWeight","none"))},nameFontItalic:function(e){e.target.checked?(i.$("#winner_fname_1").css("font-style","italic"),this.model.set("nameItalic",!0)):(i.$("#winner_fname_1").css("font-style","normal"),this.model.set("nameItalic",!1))},nameFontTiny:function(e){e.target.checked?(i.$("#winner_fname_1").css("font-weight","300"),this.$el.find("[name=winners_name_bold_1]").prop("checked",!1),this.$el.find("[name=winners_name_bold_1]").parent().removeClass("active"),this.model.set("nameFontWeight","300")):(i.$("#winner_fname_1").css("font-weight","initial"),this.model.set("nameFontWeight","none"))},lNameFontBold:function(e){e.target.checked?(i.$("#winner_lname_1").css("font-weight","700"),this.$el.find("[name=winners_lname_tiny_1]").prop("checked",!1),this.$el.find("[name=winners_lname_tiny_1]").parent().removeClass("active"),this.model.set("lnameFontWeight","700")):(i.$("#winner_lname_1").css("font-weight","initial"),this.model.set("lnameFontWeight","none"))},lNameFontItalic:function(e){e.target.checked?(i.$("#winner_lname_1").css("font-style","italic"),this.model.set("lnameItalic",!0)):(i.$("#winner_lname_1").css("font-style","normal"),this.model.set("lnameItalic",!1))},lNameFontTiny:function(e){e.target.checked?(i.$("#winner_lname_1").css("font-weight","300"),this.$el.find("[name=winners_lname_bold_1]").prop("checked",!1),this.$el.find("[name=winners_lname_bold_1]").parent().removeClass("active"),this.model.set("lnameFontWeight","300")):(i.$("#winner_lname_1").css("font-weight","initial"),this.model.set("lnameFontWeight","none"))},setSliders:function(){var e=this;this.$el.find("#winners_image_size_1").ionRangeSlider({type:"single",min:50,max:150,from:e.model.get("imageSize"),step:1,postfix:" px",onChange:function(n){e.model.set("imageSize",n.from)}}),this.$el.find("#winners_text_size_fname_1").ionRangeSlider({type:"single",min:14,max:80,from:e.model.get("nameSize"),step:1,postfix:" px",onChange:function(n){e.model.set("nameSize",n.from)}}),this.$el.find("#winners_text_size_lname_1").ionRangeSlider({type:"single",min:14,max:80,from:e.model.get("lnameSize"),step:1,postfix:" px",onChange:function(n){e.model.set("lnameSize",n.from)}}),this.$el.find("#winners_image_border").ionRangeSlider({type:"single",min:0,max:20,from:e.model.get("borderSize"),step:1,postfix:" px",onChange:function(n){e.model.set("borderSize",n.from)}})}})});