define(["backbone"],function(r){return r.Model.extend({defaults:{name:"currency",title:"Курс валют",size:14,uppercase:!1,fontWeight:"none",italic:!1,font:"arial",color:"#ffffff",isShown:!0,currencyFrom:"USD",currencyFromShowType:"sign",currencyFromX:65,currencyFromY:10,currencyTo:"RUB",currencyToShowType:"sign",currencyToX:65,currencyToY:30,currencyFromShow:!0,currencyFromShowTypePosition:"before",currencyToShowTypePosition:"before",currencyToPrecision:2}})});