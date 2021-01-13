define(["app","marionette","backbone","underscore","text!templates/widgets/weather/index.ejs","bootstrapcolorpicker"],function(e,t,n,i,a,h){"use strict";return t.ItemView.extend({template:i.template(a),events:{"change select[name=weather_text_font]":"changeFont","change select[name=weather_template]":"changeWeatherTemplate","change select[name=weather_gmt]":"changeGmt","change select[name=weather_time]":"changeTime","change input[name=weather_city]":"changeCity","change input[name=weather_text_register]":"toggleRegister","change input[name=weather_text_bold]":"fontBold","change input[name=weather_text_italic]":"fontItalic","change input[name=weather_text_tiny]":"fontTiny","change input[name=weather_wind_show]":"showWind","change input[name=weather_type_show]":"showType","change input[name=weather_text_after]":"textAfter","change input[name=weather_text_before]":"textBefore"},initialize:function(e){this.icons=["01d.png","01n.png","02d.png","02n.png","03d.png","04d.png","04n.png","09d.png","09n.png","10d.png","10n.png","11d.png","11n.png","13d.png","13n.png","50d.png"]},onRender:function(){this.setSliders();var e=this;this.$el.find("#weather_text_color").colorpicker().on("changeColor",function(){e.$el.find("#weather_text_color_p_1").css("background",e.$el.find(this).colorpicker("getValue","#ffffff")),e.model.set("color",e.$el.find(this).colorpicker("getValue","#ffffff"))});for(var t="",n=0;n<this.icons.length;n++)t+='<li><img src="/imgs/weather_templates/'+this.model.get("weatherTemplate")+"/"+this.icons[n]+'"></li>';this.$el.find("#weather_icons").html(t)},changeGmt:function(){var e=this.$el.find("[name=weather_gmt]").val();this.model.set("gmt",e)},changeTime:function(){var e=this.$el.find("[name=weather_time]").val();this.model.set("weatherTime",e)},changeFont:function(){var e=this.$el.find("[name=weather_text_font]").val();this.model.set("font",e)},changeWeatherTemplate:function(){var e=this.$el.find("[name=weather_template]").val();this.model.set("weatherTemplate",e);for(var t="",n=0;n<this.icons.length;n++)t+='<li><img src="/imgs/weather_templates/'+this.model.get("weatherTemplate")+"/"+this.icons[n]+'"></li>';this.$el.find("#weather_icons").html(t)},changeCity:function(){var e=this.$el.find("[name=weather_city]").val();this.model.set("city",e)},fontBold:function(e){e.target.checked?this.model.set("fontWeight","700"):this.model.set("fontWeight","none")},fontItalic:function(e){e.target.checked?this.model.set("italic",!0):this.model.set("italic",!1)},fontTiny:function(e){e.target.checked?this.model.set("fontWeight","300"):this.model.set("fontWeight","none")},toggleRegister:function(e){e.target.checked?this.model.set("uppercase",!0):this.model.set("uppercase",!1)},showWind:function(e){e.target.checked?this.model.set("showWind",!1):this.model.set("showWind",!0)},showType:function(e){e.target.checked?this.model.set("showType",!1):this.model.set("showType",!0)},textAfter:function(e){this.model.set("textAfter",e.target.value)},textBefore:function(e){this.model.set("textBefore",e.target.value)},setSliders:function(){var e=this;this.$el.find("#weather_text_size").ionRangeSlider({type:"single",min:14,max:80,from:e.model.get("size"),step:1,postfix:" px",onChange:function(t){e.model.set("size",t.from)}})}})});