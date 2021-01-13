define(["app","marionette","backbone","text!templates/widgets/coverWidgetsTemplates/commentatorDay/index.ejs","text!templates/widgets/coverWidgetsTemplates/commentatorLast/index.ejs","text!templates/widgets/coverWidgetsTemplates/commentatorLikes/index.ejs","text!templates/widgets/coverWidgetsTemplates/dateTime/index.ejs","text!templates/widgets/coverWidgetsTemplates/subscriber/index.ejs","text!templates/widgets/coverWidgetsTemplates/winner/index.ejs","text!templates/widgets/coverWidgetsTemplates/text/index.ejs","text!templates/widgets/coverWidgetsTemplates/textUrl/index.ejs","text!templates/widgets/coverWidgetsTemplates/timer/index.ejs","text!templates/widgets/coverWidgetsTemplates/weather/index.ejs","text!templates/widgets/coverWidgetsTemplates/reposterDay/index.ejs","text!templates/widgets/coverWidgetsTemplates/likerDay/index.ejs","text!templates/widgets/coverWidgetsTemplates/reposterLast/index.ejs","text!templates/widgets/coverWidgetsTemplates/courses/index.ejs","text!templates/widgets/coverWidgetsTemplates/statistic/index.ejs","text!templates/widgets/coverWidgetsTemplates/traffic/index.ejs","text!templates/widgets/coverWidgetsTemplates/image/index.ejs","underscore","moment","notify"],function(e,t,o,s,i,l,d,r,m,a,n,h,c,f,p,g,b,v,u,Y,$,X,w){"use strict";return t.ItemView.extend({triggers:{"click [data-action=show-settings]":"select:item"},initialize:function(){switch(this.model.get("name")){case"subscriber":this.template=$.template(r);break;case"winner":this.template=$.template(m);break;case"date":this.template=$.template(d);break;case"text":this.template=$.template(a);break;case"url":this.template=$.template(n);break;case"timer":this.template=$.template(h);break;case"weather":this.template=$.template(c);break;case"currency":this.template=$.template(b);break;case"statistic":this.template=$.template(v);break;case"commentatorLast":this.template=$.template(i);break;case"reposterLast":this.template=$.template(g);break;case"commentatorDay":this.template=$.template(s);break;case"commentatorLikes":this.template=$.template(l);break;case"reposterDay":this.template=$.template(f);break;case"likerDay":this.template=$.template(p);break;case"traffic":this.template=$.template(u);break;case"image":this.template=$.template(Y)}},modelEvents:{change:"render"},serializeData:function(){var e=this.model.toJSON(),t="",o={1:"январь",2:"февраль",3:"март",4:"апрель",5:"май",6:"июнь",7:"июль",8:"август",9:"сентябрь",10:"октябрь",11:"ноябрь",12:"декабрь"},s={1:"янв.",2:"фев.",3:"мар.",4:"апр.",5:"май",6:"июн.",7:"июл.",8:"авг.",9:"сен.",10:"окт.",11:"ноя.",12:"дек."};if("date"===this.model.get("name"))switch(this.model.get("format")){case"DD MMM YYYY":t=X().format("DD ")+s[X().format("M")]+X().format(" YYYY");break;case"DD MMM YYYY HH:mm":t=X().format("DD ")+s[X().format("M")]+X().format(" YYYY HH:mm");break;case"DD MMMM YYYY HH:mm":t=X().format("DD ")+o[X().format("M")]+X().format(" YYYY HH:mm");break;case"DD MMMM YYYY":t=X().format("DD ")+o[X().format("M")]+X().format(" YYYY");break;default:t=X().format(this.model.get("format"))}return"timer"===this.model.get("name")&&(t+=this.model.get("dayShow")?this.model.get("dayZeroShow")?"XX день ":"X день ":"",t+=this.model.get("hourShow")?this.model.get("hourZeroShow")?"XX часов ":"X часов ":"",t+=this.model.get("minutesShow")?this.model.get("minutesZeroShow")?"XX минут":"X минут":""),$.extend(e,{id:this.model.cid,dateNow:t})},onRender:function(){if("subscriber"===this.model.get("name")&&(this.$el.find("#subscriber_"+this.model.cid).draggable({containment:"#coverEditorZone",scroll:!1,stop:function(e,t){var s=o.$("#coverEditorZone").offset(),i=parseInt(o.$("#coverEditorZone").css("border-left-width"),10),l=parseInt(o.$("#coverEditorZone").css("border-top-width"),10),d=t.helper.offset();this.model.set("imageX",d.left-s.left-i),this.model.set("imageY",d.top-s.top-l),this.model.set("nameX",this.model.get("imageX")+this.model.get("absoluteNameX")),this.model.set("lnameX",this.model.get("imageX")+this.model.get("absoluteLNameX")),this.model.set("nameY",this.model.get("imageY")+this.model.get("absoluteNameY")),this.model.set("lnameY",this.model.get("imageY")+this.model.get("absoluteLNameY"))}.bind(this)}),this.$el.find("#subscriber_fname_"+this.model.cid).draggable({containment:"#coverEditorZone",scroll:!1,stop:function(e,t){var s=o.$("#subscriber_"+this.model.cid).offset(),i=parseInt(o.$("#coverEditorZone").css("border-left-width"),10),l=parseInt(o.$("#coverEditorZone").css("border-top-width"),10),d=t.helper.offset();this.model.set("nameX",this.model.get("imageX")+(d.left-s.left-i)+1),this.model.set("nameY",this.model.get("imageY")+(d.top-s.top-l)+1),this.model.set("absoluteNameX",d.left-s.left-i),this.model.set("absoluteNameY",d.top-s.top-l)}.bind(this)}),this.$el.find("#subscriber_lname_"+this.model.cid).draggable({containment:"#coverEditorZone",scroll:!1,stop:function(e,t){var s=o.$("#subscriber_"+this.model.cid).offset(),i=parseInt(o.$("#coverEditorZone").css("border-left-width"),10),l=parseInt(o.$("#coverEditorZone").css("border-top-width"),10),d=t.helper.offset();this.model.set("lnameX",this.model.get("imageX")+(d.left-s.left-i)+1),this.model.set("lnameY",this.model.get("imageY")+(d.top-s.top-l)+1),this.model.set("absoluteLNameX",d.left-s.left-i),this.model.set("absoluteLNameY",d.top-s.top-l)}.bind(this)})),"winner"===this.model.get("name")&&(this.$el.find("#winner_"+this.model.cid).draggable({containment:"#coverEditorZone",scroll:!1,stop:function(e,t){var s=o.$("#coverEditorZone").offset(),i=parseInt(o.$("#coverEditorZone").css("border-left-width"),10),l=parseInt(o.$("#coverEditorZone").css("border-top-width"),10),d=t.helper.offset();this.model.set("imageX",d.left-s.left-i),this.model.set("imageY",d.top-s.top-l),this.model.set("nameX",this.model.get("imageX")+this.model.get("absoluteNameX")),this.model.set("lnameX",this.model.get("imageX")+this.model.get("absoluteLNameX")),this.model.set("nameY",this.model.get("imageY")+this.model.get("absoluteNameY")),this.model.set("lnameY",this.model.get("imageY")+this.model.get("absoluteLNameY"))}.bind(this)}),this.$el.find("#winner_fname_"+this.model.cid).draggable({containment:"#coverEditorZone",scroll:!1,stop:function(e,t){var s=o.$("#winner_"+this.model.cid).offset(),i=parseInt(o.$("#coverEditorZone").css("border-left-width"),10),l=parseInt(o.$("#coverEditorZone").css("border-top-width"),10),d=t.helper.offset();this.model.set("nameX",this.model.get("imageX")+(d.left-s.left-i)+1),this.model.set("nameY",this.model.get("imageY")+(d.top-s.top-l)+1),this.model.set("absoluteNameX",d.left-s.left-i),this.model.set("absoluteNameY",d.top-s.top-l)}.bind(this)}),this.$el.find("#winner_lname_"+this.model.cid).draggable({containment:"#coverEditorZone",scroll:!1,stop:function(e,t){var s=o.$("#winner_"+this.model.cid).offset(),i=parseInt(o.$("#coverEditorZone").css("border-left-width"),10),l=parseInt(o.$("#coverEditorZone").css("border-top-width"),10),d=t.helper.offset();this.model.set("lnameX",this.model.get("imageX")+(d.left-s.left-i)+1),this.model.set("lnameY",this.model.get("imageY")+(d.top-s.top-l)+1),this.model.set("absoluteLNameX",d.left-s.left-i),this.model.set("absoluteLNameY",d.top-s.top-l)}.bind(this)})),"text"===this.model.get("name")&&this.$el.find("#text_"+this.model.cid).draggable({containment:"#coverEditorZone",scroll:!1,stop:function(e,t){var s=o.$("#coverEditorZone").offset(),i=parseInt(o.$("#coverEditorZone").css("border-left-width"),10),l=parseInt(o.$("#coverEditorZone").css("border-top-width"),10),d=t.helper.offset();this.model.set("textX",d.left-s.left-i),this.model.set("textY",d.top-s.top-l)}.bind(this)}),"url"===this.model.get("name")){var e=this;""!=this.model.get("url")&&o.$.ajax({url:this.model.get("url"),success:function(t){e.model.set("text",t)},error:function(e){o.$.notify("Неправильная ссылка в виджете текста","error"),401==e.status&&(window.location="/login")}}),this.$el.find("#textUrl_"+this.model.cid).draggable({containment:"#coverEditorZone",scroll:!1,stop:function(e,t){var s=o.$("#coverEditorZone").offset(),i=parseInt(o.$("#coverEditorZone").css("border-left-width"),10),l=parseInt(o.$("#coverEditorZone").css("border-top-width"),10),d=t.helper.offset();this.model.set("textX",d.left-s.left-i),this.model.set("textY",d.top-s.top-l)}.bind(this)})}"image"===this.model.get("name")&&this.$el.find("#image_"+this.model.cid).draggable({containment:"#coverEditorZone",scroll:!1,stop:function(e,t){var s=o.$("#coverEditorZone").offset(),i=parseInt(o.$("#coverEditorZone").css("border-left-width"),10),l=parseInt(o.$("#coverEditorZone").css("border-top-width"),10),d=t.helper.offset();this.model.set("imageX",d.left-s.left-i),this.model.set("imageY",d.top-s.top-l)}.bind(this)}),"statistic"===this.model.get("name")&&this.$el.find("#statistic_"+this.model.cid).draggable({containment:"#coverEditorZone",scroll:!1,stop:function(e,t){var s=o.$("#coverEditorZone").offset(),i=parseInt(o.$("#coverEditorZone").css("border-left-width"),10),l=parseInt(o.$("#coverEditorZone").css("border-top-width"),10),d=t.helper.offset();this.model.set("textX",d.left-s.left-i),this.model.set("textY",d.top-s.top-l)}.bind(this)}),"date"===this.model.get("name")&&this.$el.find("#date_"+this.model.cid).draggable({containment:"#coverEditorZone",scroll:!1,stop:function(e,t){var s=o.$("#coverEditorZone").offset(),i=parseInt(o.$("#coverEditorZone").css("border-left-width"),10),l=parseInt(o.$("#coverEditorZone").css("border-top-width"),10),d=t.helper.offset();this.model.set("dateX",d.left-s.left-i),this.model.set("dateY",d.top-s.top-l)}.bind(this)}),"timer"===this.model.get("name")&&this.$el.find("#timer_"+this.model.cid).draggable({containment:"#coverEditorZone",scroll:!1,stop:function(e,t){var s=o.$("#coverEditorZone").offset(),i=parseInt(o.$("#coverEditorZone").css("border-left-width"),10),l=parseInt(o.$("#coverEditorZone").css("border-top-width"),10),d=t.helper.offset();this.model.set("timerX",d.left-s.left-i),this.model.set("timerY",d.top-s.top-l)}.bind(this)}),"weather"===this.model.get("name")&&(this.$el.find("#weather_"+this.model.cid).draggable({containment:"#coverEditorZone",scroll:!1,stop:function(e,t){var s=o.$("#coverEditorZone").offset(),i=parseInt(o.$("#coverEditorZone").css("border-left-width"),10),l=parseInt(o.$("#coverEditorZone").css("border-top-width"),10),d=t.helper.offset();this.model.set("weatherX",d.left-s.left-i),this.model.set("weatherY",d.top-s.top-l)}.bind(this)}),this.$el.find("#weather_"+this.model.cid).draggable({containment:"#coverEditorZone",scroll:!1,stop:function(e,t){var s=o.$("#coverEditorZone").offset(),i=parseInt(o.$("#coverEditorZone").css("border-left-width"),10),l=parseInt(o.$("#coverEditorZone").css("border-top-width"),10),d=t.helper.offset();this.model.set("weatherX",d.left-s.left-i),this.model.set("weatherY",d.top-s.top-l),this.model.set("weatherTypeX",this.model.get("weatherX")+this.model.get("absoluteWeatherTypeX")),this.model.set("weatherWindX",this.model.get("weatherX")+this.model.get("absoluteWeatherWindX")),this.model.set("weatherTypeY",this.model.get("weatherY")+this.model.get("absoluteWeatherTypeY")),this.model.set("weatherWindY",this.model.get("weatherY")+this.model.get("absoluteWeatherWindY"))}.bind(this)}),this.$el.find("#weather_type_"+this.model.cid).draggable({containment:"#coverEditorZone",scroll:!1,stop:function(e,t){var s=o.$("#weather_"+this.model.cid).offset(),i=parseInt(o.$("#coverEditorZone").css("border-left-width"),10),l=parseInt(o.$("#coverEditorZone").css("border-top-width"),10),d=t.helper.offset();this.model.set("weatherTypeX",this.model.get("weatherX")+(d.left-s.left-i)+1),this.model.set("weatherTypeY",this.model.get("weatherY")+(d.top-s.top-l)+1),this.model.set("absoluteWeatherTypeX",d.left-s.left-i),this.model.set("absoluteWeatherTypeY",d.top-s.top-l)}.bind(this)}),this.$el.find("#weather_wind_"+this.model.cid).draggable({containment:"#coverEditorZone",scroll:!1,stop:function(e,t){var s=o.$("#weather_"+this.model.cid).offset(),i=parseInt(o.$("#coverEditorZone").css("border-left-width"),10),l=parseInt(o.$("#coverEditorZone").css("border-top-width"),10),d=t.helper.offset();this.model.set("weatherWindX",this.model.get("weatherX")+(d.left-s.left-i)+1),this.model.set("weatherWindY",this.model.get("weatherY")+(d.top-s.top-l)+1),this.model.set("absoluteWeatherWindX",d.left-s.left-i),this.model.set("absoluteWeatherWindY",d.top-s.top-l)}.bind(this)})),"traffic"===this.model.get("name")&&(this.$el.find("#traffic_"+this.model.cid).draggable({containment:"#coverEditorZone",scroll:!1,stop:function(e,t){var s=o.$("#coverEditorZone").offset(),i=parseInt(o.$("#coverEditorZone").css("border-left-width"),10),l=parseInt(o.$("#coverEditorZone").css("border-top-width"),10),d=t.helper.offset();this.model.set("iconX",d.left-s.left-i),this.model.set("iconY",d.top-s.top-l)}.bind(this)}),this.$el.find("#traffic_"+this.model.cid).draggable({containment:"#coverEditorZone",scroll:!1,stop:function(e,t){var s=o.$("#coverEditorZone").offset(),i=parseInt(o.$("#coverEditorZone").css("border-left-width"),10),l=parseInt(o.$("#coverEditorZone").css("border-top-width"),10),d=t.helper.offset();this.model.set("iconX",d.left-s.left-i),this.model.set("iconY",d.top-s.top-l),this.model.set("textX",this.model.get("iconX")+this.model.get("absoluteTextX")),this.model.set("markX",this.model.get("iconX")+this.model.get("absoluteMarkX")),this.model.set("textY",this.model.get("iconY")+this.model.get("absoluteTextY")),this.model.set("markY",this.model.get("iconY")+this.model.get("absoluteMarkY"))}.bind(this)}),this.$el.find("#traffic_type_"+this.model.cid).draggable({containment:"#coverEditorZone",scroll:!1,stop:function(e,t){var s=o.$("#traffic_"+this.model.cid).offset(),i=parseInt(o.$("#coverEditorZone").css("border-left-width"),10),l=parseInt(o.$("#coverEditorZone").css("border-top-width"),10),d=t.helper.offset();this.model.set("textX",this.model.get("iconX")+(d.left-s.left-i)+1),this.model.set("textY",this.model.get("iconY")+(d.top-s.top-l)+1),this.model.set("absoluteTextX",d.left-s.left-i),this.model.set("absoluteTextY",d.top-s.top-l)}.bind(this)}),this.$el.find("#traffic_wind_"+this.model.cid).draggable({containment:"#coverEditorZone",scroll:!1,stop:function(e,t){var s=o.$("#traffic_"+this.model.cid).offset(),i=parseInt(o.$("#coverEditorZone").css("border-left-width"),10),l=parseInt(o.$("#coverEditorZone").css("border-top-width"),10),d=t.helper.offset();this.model.set("markX",this.model.get("iconX")+(d.left-s.left-i)+1),this.model.set("markY",this.model.get("iconY")+(d.top-s.top-l)+1),this.model.set("absoluteMarkX",d.left-s.left-i),this.model.set("absoluteMarkY",d.top-s.top-l)}.bind(this)})),"currency"===this.model.get("name")&&(this.$el.find("#courses_from_"+this.model.cid).draggable({containment:"#coverEditorZone",scroll:!1,stop:function(e,t){var s=o.$("#coverEditorZone").offset(),i=parseInt(o.$("#coverEditorZone").css("border-left-width"),10),l=parseInt(o.$("#coverEditorZone").css("border-top-width"),10),d=t.helper.offset();this.model.set("currencyFromX",d.left-s.left-i),this.model.set("currencyFromY",d.top-s.top-l)}.bind(this)}),this.$el.find("#courses_to_"+this.model.cid).draggable({containment:"#coverEditorZone",scroll:!1,stop:function(e,t){var s=o.$("#coverEditorZone").offset(),i=parseInt(o.$("#coverEditorZone").css("border-left-width"),10),l=parseInt(o.$("#coverEditorZone").css("border-top-width"),10),d=t.helper.offset();this.model.set("currencyToX",d.left-s.left-i),this.model.set("currencyToY",d.top-s.top-l)}.bind(this)})),"commentatorLast"===this.model.get("name")&&(this.$el.find("#commentator_last_"+this.model.cid).draggable({containment:"#coverEditorZone",scroll:!1,stop:function(e,t){var s=o.$("#coverEditorZone").offset(),i=parseInt(o.$("#coverEditorZone").css("border-left-width"),10),l=parseInt(o.$("#coverEditorZone").css("border-top-width"),10),d=t.helper.offset();this.model.set("imageX",d.left-s.left-i),this.model.set("imageY",d.top-s.top-l),this.model.set("nameX",this.model.get("imageX")+this.model.get("absoluteNameX")),this.model.set("lnameX",this.model.get("imageX")+this.model.get("absoluteLNameX")),this.model.set("nameY",this.model.get("imageY")+this.model.get("absoluteNameY")),this.model.set("lnameY",this.model.get("imageY")+this.model.get("absoluteLNameY"))}.bind(this)}),this.$el.find("#commentator_last_fname_"+this.model.cid).draggable({containment:"#coverEditorZone",scroll:!1,stop:function(e,t){var s=o.$("#commentator_last_"+this.model.cid).offset(),i=parseInt(o.$("#coverEditorZone").css("border-left-width"),10),l=parseInt(o.$("#coverEditorZone").css("border-top-width"),10),d=t.helper.offset();this.model.set("nameX",this.model.get("imageX")+(d.left-s.left-i)+1),this.model.set("nameY",this.model.get("imageY")+(d.top-s.top-l)+1),this.model.set("absoluteNameX",d.left-s.left-i),this.model.set("absoluteNameY",d.top-s.top-l)}.bind(this)}),this.$el.find("#commentator_last_lname_"+this.model.cid).draggable({containment:"#coverEditorZone",scroll:!1,stop:function(e,t){var s=o.$("#commentator_last_"+this.model.cid).offset(),i=parseInt(o.$("#coverEditorZone").css("border-left-width"),10),l=parseInt(o.$("#coverEditorZone").css("border-top-width"),10),d=t.helper.offset();this.model.set("lnameX",this.model.get("imageX")+(d.left-s.left-i)+1),this.model.set("lnameY",this.model.get("imageY")+(d.top-s.top-l)+1),this.model.set("absoluteLNameX",d.left-s.left-i),this.model.set("absoluteLNameY",d.top-s.top-l)}.bind(this)})),"commentatorDay"===this.model.get("name")&&(this.$el.find("#commentator_day_"+this.model.cid).draggable({containment:"#coverEditorZone",scroll:!1,stop:function(e,t){var s=o.$("#coverEditorZone").offset(),i=parseInt(o.$("#coverEditorZone").css("border-left-width"),10),l=parseInt(o.$("#coverEditorZone").css("border-top-width"),10),d=t.helper.offset();this.model.set("imageX",d.left-s.left-i),this.model.set("imageY",d.top-s.top-l),this.model.set("nameX",this.model.get("imageX")+this.model.get("absoluteNameX")),this.model.set("lnameX",this.model.get("imageX")+this.model.get("absoluteLNameX")),this.model.set("CommentCountX",this.model.get("imageX")+this.model.get("absoluteCommentCountX")),this.model.set("nameY",this.model.get("imageY")+this.model.get("absoluteNameY")),this.model.set("lnameY",this.model.get("imageY")+this.model.get("absoluteLNameY")),this.model.set("CommentCountY",this.model.get("imageY")+this.model.get("absoluteCommentCountY"))}.bind(this)}),this.$el.find("#commentator_day_fname_"+this.model.cid).draggable({containment:"#coverEditorZone",scroll:!1,stop:function(e,t){var s=o.$("#commentator_day_"+this.model.cid).offset(),i=parseInt(o.$("#coverEditorZone").css("border-left-width"),10),l=parseInt(o.$("#coverEditorZone").css("border-top-width"),10),d=t.helper.offset();this.model.set("nameX",this.model.get("imageX")+(d.left-s.left-i)+1),this.model.set("nameY",this.model.get("imageY")+(d.top-s.top-l)+1),this.model.set("absoluteNameX",d.left-s.left-i),this.model.set("absoluteNameY",d.top-s.top-l)}.bind(this)}),this.$el.find("#commentator_day_lname_"+this.model.cid).draggable({containment:"#coverEditorZone",scroll:!1,stop:function(e,t){var s=o.$("#commentator_day_"+this.model.cid).offset(),i=parseInt(o.$("#coverEditorZone").css("border-left-width"),10),l=parseInt(o.$("#coverEditorZone").css("border-top-width"),10),d=t.helper.offset();this.model.set("lnameX",this.model.get("imageX")+(d.left-s.left-i)+1),this.model.set("lnameY",this.model.get("imageY")+(d.top-s.top-l)+1),this.model.set("absoluteLNameX",d.left-s.left-i),this.model.set("absoluteLNameY",d.top-s.top-l)}.bind(this)}),this.$el.find("#commentator_day_comments_count_"+this.model.cid).draggable({containment:"#coverEditorZone",scroll:!1,stop:function(e,t){var s=o.$("#commentator_day_"+this.model.cid).offset(),i=parseInt(o.$("#coverEditorZone").css("border-left-width"),10),l=parseInt(o.$("#coverEditorZone").css("border-top-width"),10),d=t.helper.offset();this.model.set("CommentCountX",this.model.get("imageX")+(d.left-s.left-i)+1),this.model.set("CommentCountY",this.model.get("imageY")+(d.top-s.top-l)+1),this.model.set("absoluteCommentCountX",d.left-s.left-i),this.model.set("absoluteCommentCountY",d.top-s.top-l)}.bind(this)})),"reposterDay"===this.model.get("name")&&(this.$el.find("#reposter_day_"+this.model.cid).draggable({containment:"#coverEditorZone",scroll:!1,stop:function(e,t){var s=o.$("#coverEditorZone").offset(),i=parseInt(o.$("#coverEditorZone").css("border-left-width"),10),l=parseInt(o.$("#coverEditorZone").css("border-top-width"),10),d=t.helper.offset();this.model.set("imageX",d.left-s.left-i),this.model.set("imageY",d.top-s.top-l),this.model.set("nameX",this.model.get("imageX")+this.model.get("absoluteNameX")),this.model.set("lnameX",this.model.get("imageX")+this.model.get("absoluteLNameX")),this.model.set("repostsCountX",this.model.get("imageX")+this.model.get("absoluteRepostsCountX")),this.model.set("nameY",this.model.get("imageY")+this.model.get("absoluteNameY")),this.model.set("lnameY",this.model.get("imageY")+this.model.get("absoluteLNameY")),this.model.set("repostsCountY",this.model.get("imageY")+this.model.get("absoluteRepostsCountY"))}.bind(this)}),this.$el.find("#reposter_day_fname_"+this.model.cid).draggable({containment:"#coverEditorZone",scroll:!1,stop:function(e,t){var s=o.$("#reposter_day_"+this.model.cid).offset(),i=parseInt(o.$("#coverEditorZone").css("border-left-width"),10),l=parseInt(o.$("#coverEditorZone").css("border-top-width"),10),d=t.helper.offset();this.model.set("nameX",this.model.get("imageX")+(d.left-s.left-i)+1),this.model.set("nameY",this.model.get("imageY")+(d.top-s.top-l)+1),this.model.set("absoluteNameX",d.left-s.left-i),this.model.set("absoluteNameY",d.top-s.top-l)}.bind(this)}),this.$el.find("#reposter_day_lname_"+this.model.cid).draggable({containment:"#coverEditorZone",scroll:!1,stop:function(e,t){var s=o.$("#reposter_day_"+this.model.cid).offset(),i=parseInt(o.$("#coverEditorZone").css("border-left-width"),10),l=parseInt(o.$("#coverEditorZone").css("border-top-width"),10),d=t.helper.offset();this.model.set("lnameX",this.model.get("imageX")+(d.left-s.left-i)+1),this.model.set("lnameY",this.model.get("imageY")+(d.top-s.top-l)+1),this.model.set("absoluteLNameX",d.left-s.left-i),this.model.set("absoluteLNameY",d.top-s.top-l)}.bind(this)}),this.$el.find("#reposter_day_reposts_count_"+this.model.cid).draggable({containment:"#coverEditorZone",scroll:!1,stop:function(e,t){var s=o.$("#reposter_day_"+this.model.cid).offset(),i=parseInt(o.$("#coverEditorZone").css("border-left-width"),10),l=parseInt(o.$("#coverEditorZone").css("border-top-width"),10),d=t.helper.offset();this.model.set("repostsCountX",this.model.get("imageX")+(d.left-s.left-i)+1),this.model.set("repostsCountY",this.model.get("imageY")+(d.top-s.top-l)+1),this.model.set("absoluteRepostsCountX",d.left-s.left-i),this.model.set("absoluteRepostsCountY",d.top-s.top-l)}.bind(this)})),"likerDay"===this.model.get("name")&&(this.$el.find("#liker_day_"+this.model.cid).draggable({containment:"#coverEditorZone",scroll:!1,stop:function(e,t){var s=o.$("#coverEditorZone").offset(),i=parseInt(o.$("#coverEditorZone").css("border-left-width"),10),l=parseInt(o.$("#coverEditorZone").css("border-top-width"),10),d=t.helper.offset();this.model.set("imageX",d.left-s.left-i),this.model.set("imageY",d.top-s.top-l),this.model.set("nameX",this.model.get("imageX")+this.model.get("absoluteNameX")),this.model.set("lnameX",this.model.get("imageX")+this.model.get("absoluteLNameX")),this.model.set("likesCountX",this.model.get("imageX")+this.model.get("absoluteLikesCountX")),this.model.set("nameY",this.model.get("imageY")+this.model.get("absoluteNameY")),this.model.set("lnameY",this.model.get("imageY")+this.model.get("absoluteLNameY")),this.model.set("likesCountY",this.model.get("imageY")+this.model.get("absoluteLikesCountY"))}.bind(this)}),this.$el.find("#liker_day_fname_"+this.model.cid).draggable({containment:"#coverEditorZone",scroll:!1,stop:function(e,t){var s=o.$("#liker_day_"+this.model.cid).offset(),i=parseInt(o.$("#coverEditorZone").css("border-left-width"),10),l=parseInt(o.$("#coverEditorZone").css("border-top-width"),10),d=t.helper.offset();this.model.set("nameX",this.model.get("imageX")+(d.left-s.left-i)+1),this.model.set("nameY",this.model.get("imageY")+(d.top-s.top-l)+1),this.model.set("absoluteNameX",d.left-s.left-i),this.model.set("absoluteNameY",d.top-s.top-l)}.bind(this)}),this.$el.find("#liker_day_lname_"+this.model.cid).draggable({containment:"#coverEditorZone",scroll:!1,stop:function(e,t){var s=o.$("#liker_day_"+this.model.cid).offset(),i=parseInt(o.$("#coverEditorZone").css("border-left-width"),10),l=parseInt(o.$("#coverEditorZone").css("border-top-width"),10),d=t.helper.offset();this.model.set("lnameX",this.model.get("imageX")+(d.left-s.left-i)+1),this.model.set("lnameY",this.model.get("imageY")+(d.top-s.top-l)+1),this.model.set("absoluteLNameX",d.left-s.left-i),this.model.set("absoluteLNameY",d.top-s.top-l)}.bind(this)}),this.$el.find("#liker_day_reposts_count_"+this.model.cid).draggable({containment:"#coverEditorZone",scroll:!1,stop:function(e,t){var s=o.$("#liker_day_"+this.model.cid).offset(),i=parseInt(o.$("#coverEditorZone").css("border-left-width"),10),l=parseInt(o.$("#coverEditorZone").css("border-top-width"),10),d=t.helper.offset();this.model.set("likesCountX",this.model.get("imageX")+(d.left-s.left-i)+1),this.model.set("likesCountY",this.model.get("imageY")+(d.top-s.top-l)+1),this.model.set("absoluteLikesCountX",d.left-s.left-i),this.model.set("absoluteLikesCountY",d.top-s.top-l)}.bind(this)})),"reposterLast"===this.model.get("name")&&(this.$el.find("#reposter_last_"+this.model.cid).draggable({containment:"#coverEditorZone",scroll:!1,stop:function(e,t){var s=o.$("#coverEditorZone").offset(),i=parseInt(o.$("#coverEditorZone").css("border-left-width"),10),l=parseInt(o.$("#coverEditorZone").css("border-top-width"),10),d=t.helper.offset();this.model.set("imageX",d.left-s.left-i),this.model.set("imageY",d.top-s.top-l),this.model.set("nameX",this.model.get("imageX")+this.model.get("absoluteNameX")),this.model.set("lnameX",this.model.get("imageX")+this.model.get("absoluteLNameX")),this.model.set("nameY",this.model.get("imageY")+this.model.get("absoluteNameY")),this.model.set("lnameY",this.model.get("imageY")+this.model.get("absoluteLNameY"))}.bind(this)}),this.$el.find("#reposter_last_fname_"+this.model.cid).draggable({containment:"#coverEditorZone",scroll:!1,stop:function(e,t){var s=o.$("#reposter_last_"+this.model.cid).offset(),i=parseInt(o.$("#coverEditorZone").css("border-left-width"),10),l=parseInt(o.$("#coverEditorZone").css("border-top-width"),10),d=t.helper.offset();this.model.set("nameX",this.model.get("imageX")+(d.left-s.left-i)+1),this.model.set("nameY",this.model.get("imageY")+(d.top-s.top-l)+1),this.model.set("absoluteNameX",d.left-s.left-i),this.model.set("absoluteNameY",d.top-s.top-l)}.bind(this)}),this.$el.find("#reposter_last_lname_"+this.model.cid).draggable({containment:"#coverEditorZone",scroll:!1,stop:function(e,t){var s=o.$("#reposter_last_"+this.model.cid).offset(),i=parseInt(o.$("#coverEditorZone").css("border-left-width"),10),l=parseInt(o.$("#coverEditorZone").css("border-top-width"),10),d=t.helper.offset();this.model.set("lnameX",this.model.get("imageX")+(d.left-s.left-i)+1),this.model.set("lnameY",this.model.get("imageY")+(d.top-s.top-l)+1),this.model.set("absoluteLNameX",d.left-s.left-i),this.model.set("absoluteLNameY",d.top-s.top-l)}.bind(this)})),"commentatorLikes"===this.model.get("name")&&(this.$el.find("#commentator_likes_"+this.model.cid).draggable({containment:"#coverEditorZone",scroll:!1,stop:function(e,t){var s=o.$("#coverEditorZone").offset(),i=parseInt(o.$("#coverEditorZone").css("border-left-width"),10),l=parseInt(o.$("#coverEditorZone").css("border-top-width"),10),d=t.helper.offset();this.model.set("imageX",d.left-s.left-i),this.model.set("imageY",d.top-s.top-l),this.model.set("nameX",this.model.get("imageX")+this.model.get("absoluteNameX")),this.model.set("lnameX",this.model.get("imageX")+this.model.get("absoluteLNameX")),this.model.set("likeX",this.model.get("imageX")+this.model.get("absoluteLikeX")),this.model.set("nameY",this.model.get("imageY")+this.model.get("absoluteNameY")),this.model.set("lnameY",this.model.get("imageY")+this.model.get("absoluteLNameY")),this.model.set("likeY",this.model.get("imageY")+this.model.get("absoluteLikeY"))}.bind(this)}),this.$el.find("#commentator_likes_fname_"+this.model.cid).draggable({containment:"#coverEditorZone",scroll:!1,stop:function(e,t){var s=o.$("#commentator_likes_"+this.model.cid).offset(),i=parseInt(o.$("#coverEditorZone").css("border-left-width"),10),l=parseInt(o.$("#coverEditorZone").css("border-top-width"),10),d=t.helper.offset();this.model.set("nameX",this.model.get("imageX")+(d.left-s.left-i)+1),this.model.set("nameY",this.model.get("imageY")+(d.top-s.top-l)+1),this.model.set("absoluteNameX",d.left-s.left-i),this.model.set("absoluteNameY",d.top-s.top-l)}.bind(this)}),this.$el.find("#commentator_likes_lname_"+this.model.cid).draggable({containment:"#coverEditorZone",scroll:!1,stop:function(e,t){var s=o.$("#commentator_likes_"+this.model.cid).offset(),i=parseInt(o.$("#coverEditorZone").css("border-left-width"),10),l=parseInt(o.$("#coverEditorZone").css("border-top-width"),10),d=t.helper.offset();this.model.set("lnameX",this.model.get("imageX")+(d.left-s.left-i)+1),this.model.set("lnameY",this.model.get("imageY")+(d.top-s.top-l)+1),this.model.set("absoluteLNameX",d.left-s.left-i),this.model.set("absoluteLNameY",d.top-s.top-l)}.bind(this)}),this.$el.find("#commentator_likes_like_"+this.model.cid).draggable({containment:"#coverEditorZone",scroll:!1,stop:function(e,t){var s=o.$("#commentator_likes_"+this.model.cid).offset(),i=parseInt(o.$("#coverEditorZone").css("border-left-width"),10),l=parseInt(o.$("#coverEditorZone").css("border-top-width"),10),d=t.helper.offset();this.model.set("likeX",this.model.get("imageX")+(d.left-s.left-i)+1),this.model.set("likeY",this.model.get("imageY")+(d.top-s.top-l)+1),this.model.set("absoluteLikeX",d.left-s.left-i),this.model.set("absoluteLikeY",d.top-s.top-l)}.bind(this)}))}})});