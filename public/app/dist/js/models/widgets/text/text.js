define(["app","marionette","backbone","underscore","text!templates/widgets/text/index.ejs","bootstrapcolorpicker","datetimepicker","moment"],function(t,e,n,i,o,s,a,c){"use strict";return e.ItemView.extend({template:i.template(o),events:{"change select[name=text_gmt]":"changeGmt","change select[name=text_font]":"changeFont","change input[name=text_register]":"toggleRegister","change input[name=text_time_show]":"toggleTimeText","change input[name=text_text]":"text","change input[name=text_bold]":"fontBold","change input[name=text_italic]":"fontItalic","change input[name=text_tiny]":"fontTiny"},initialize:function(t){},onRender:function(){this.setSliders();var t=this;this.$el.find("#text_color").colorpicker().on("changeColor",function(){t.$el.find("#text_color_p_1").css("background",t.$el.find(this).colorpicker("getValue","#ffffff")),t.model.set("color",t.$el.find(this).colorpicker("getValue","#ffffff"))})},text:function(t){this.model.set("text",t.target.value)},changeGmt:function(){var t=this.$el.find("[name=text_gmt]").val();this.model.set("gmt",t)},changeFont:function(){var t=this.$el.find("[name=text_font]").val();this.model.set("font",t)},fontBold:function(t){t.target.checked?this.model.set("fontWeight","700"):this.model.set("fontWeight","none")},fontItalic:function(t){t.target.checked?this.model.set("italic",!0):this.model.set("italic",!1)},fontTiny:function(t){t.target.checked?this.model.set("fontWeight","300"):this.model.set("fontWeight","none")},toggleRegister:function(t){t.target.checked?this.model.set("uppercase",!0):this.model.set("uppercase",!1)},toggleTimeText:function(t){t.target.checked?(this.$el.find("#text_time").show(),this.model.set("showTextTime",!0)):(this.$el.find("#text_time").hide(),this.model.set("showTextTime",!1))},setSliders:function(){var t=this;this.$el.find("#text_start").datetimepicker({format:"YYYY-MM-DD HH:mm"}),this.$el.find("#text_start").on("dp.change",function(e){t.model.set("textStart",e.date.format("YYYY-MM-DD HH:mm"))}),this.$el.find("#text_end").datetimepicker({format:"YYYY-MM-DD HH:mm"}),this.$el.find("#text_end").on("dp.change",function(e){t.model.set("textEnd",e.date.format("YYYY-MM-DD HH:mm"))}),this.$el.find("#text_size").ionRangeSlider({type:"single",min:14,max:80,from:t.model.get("size"),step:1,postfix:" px",onChange:function(e){t.model.set("size",e.from)}})}})});