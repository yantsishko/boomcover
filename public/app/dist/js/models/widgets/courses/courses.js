define(["app","marionette","backbone","underscore","text!templates/widgets/courses/index.ejs","bootstrapcolorpicker","bootstrapselect"],function(e,t,o,n,s,i,c){"use strict";return t.ItemView.extend({template:n.template(s),events:{"change select[name=courses_text_font]":"changeFont","change select[name=courses_from]":"changeFrom","change select[name=courses_to]":"changeTo","change select[name=courses_from_type]":"changeFromType","change select[name=courses_to_type]":"changeToType","change select[name=courses_from_type_position]":"changeFromTypePosition","change select[name=courses_to_type_position]":"changeToTypePosition","change input[name=courses_text_bold]":"fontBold","change input[name=courses_text_italic]":"fontItalic","change input[name=courses_text_tiny]":"fontTiny","change input[name=courses_from_show]":"showFrom"},initialize:function(t){this.currencies=null;var n=this;o.$.ajax({async:!1,url:e.url+"/api/v1/currencies/codes",success:function(e){n.currencies=e}})},onRender:function(){this.setSliders();var e=this;this.$el.find("#courses_text_color").colorpicker().on("changeColor",function(){e.$el.find("#courses_text_color_p_1").css("background",e.$el.find(this).colorpicker("getValue","#ffffff")),e.model.set("color",e.$el.find(this).colorpicker("getValue","#ffffff"))}),this.$el.find(".selectpicker").selectpicker()},changeFont:function(){var e=this.$el.find("[name=courses_text_font]").val();this.model.set("font",e)},changeFrom:function(){var e=this.$el.find("[name=courses_from]").val();this.model.set("currencyFrom",e)},changeTo:function(){var e=this.$el.find("[name=courses_to]").val();this.model.set("currencyTo",e)},changeToType:function(){var e=this.$el.find("[name=courses_to_type]").val();this.model.set("currencyToShowType",e)},changeFromType:function(){var e=this.$el.find("[name=courses_from_type]").val();this.model.set("currencyFromShowType",e)},changeFromTypePosition:function(){var e=this.$el.find("[name=courses_from_type_position]").val();this.model.set("currencyFromShowTypePosition",e)},changeToTypePosition:function(){var e=this.$el.find("[name=courses_to_type_position]").val();this.model.set("currencyToShowTypePosition",e)},fontBold:function(e){e.target.checked?this.model.set("fontWeight","700"):this.model.set("fontWeight","none")},fontItalic:function(e){e.target.checked?this.model.set("italic",!0):this.model.set("italic",!1)},fontTiny:function(e){e.target.checked?this.model.set("fontWeight","300"):this.model.set("fontWeight","none")},showFrom:function(e){e.target.checked?this.model.set("currencyFromShow",!1):this.model.set("currencyFromShow",!0)},setSliders:function(){var e=this;this.$el.find("#courses_text_size").ionRangeSlider({type:"single",min:14,max:80,from:e.model.get("size"),step:1,postfix:" px",onChange:function(t){e.model.set("size",t.from)}})},serializeData:function(){var e=this.model.toJSON();return n.extend(e,{currencies:this.currencies})}})});