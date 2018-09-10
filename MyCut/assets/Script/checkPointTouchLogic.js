// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html


//触碰逻辑脚本！！
cc.Class({
    extends: cc.Component,

    properties: {
       


      

       targetCount:1,
       optimalCount:1,
    },

    onLoad:function() {
       // console.log("触碰逻辑关卡 onload!");
    },
    hittedTarget:function() {
        //console.log("触碰到target");
    },
    


});
