define([
    'backbone',
], function (Backbone) {
    return Backbone.Model.extend({
        defaults: {
            //id: null,
            name: 'timer',
            title: 'Таймер',
            size: 14,
            uppercase: false,
            fontWeight: 'none',
            italic: false,
            font: 'arial',
            color: '#ffffff',
            endDate: '',
            textBefore: '',
            day1: 'День',
            day2: 'Дня',
            day3: 'Дней',
            dayShow: true, //показывать ли
            dayZeroShow: true, //ведущий ноль
            dayZero: false, //показывать ли 0 значение
            dayPosition: 'right', //позиция текста
            hour1: 'Час',
            hour2: 'Часа',
            hour3: 'Часов',
            hourShow: true, //показывать ли
            hourZeroShow: true, //ведущий ноль
            hourZero: false, //показывать ли 0 значение
            hourPosition: 'right', //позиция текста
            minutes1: 'Минута',
            minutes2: 'Минуты',
            minutes3: 'Минут',
            minutesShow: true, //показывать ли
            minutesZeroShow: true, //ведущий ноль
            minutesZero: false, //показывать ли 0 значение
            minutesPosition: 'right', //позиция текста
            gmt: '3', //часовой пояс
            isShown: true,
            timerX: 110,
            timerY: 80
        }
    });
});