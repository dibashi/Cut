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




        //
        touchCount: 1,
        resultCount: 1,

        currentTouchCount: 0,
        currentResultCount: 0,

        helpTouchBegin: {
            default: null,
            type: cc.Vec2,
        },

        helpTouchEnd: {
            default: null,
            type: cc.Vec2,
        },

        //0，击中目标，1掉落面积
        checkpointClass: 0,
    },

    onLoad: function () {
        console.log("触碰逻辑关卡 onload!");
    },

    start: function () {

    },

    
    checkIsOver:function() {
        console.log("check is over");
    },



});
