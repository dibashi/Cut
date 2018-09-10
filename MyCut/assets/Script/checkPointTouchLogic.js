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
        
    },

    start: function () {

    },

    
    checkIsOver:function() {
        console.log("check is over");

        if(this.currentResultCount>=this.resultCount) {
            //皇冠数量储存 
            let crownCount = 3-(this.currentTouchCount - this.touchCount);
            if(crownCount>3) {
                crownCount = 3;
            } else if(crownCount<1) {
                crownCount = 1;
            }
            //获取当前关卡索引 往json对象数组插入数据
            let checkpointIndex = parseInt(cc.dataMgr.currentCheckPoint) - 1;
            let stringOfJSON = cc.sys.localStorage.getItem("checkPointJsonData");
            let jsonObj = JSON.parse(stringOfJSON);
            if(crownCount> jsonObj[checkpointIndex].crownCount) {
                jsonObj[checkpointIndex].crownCount = crownCount;
                var a = JSON.stringify(jsonObj);
                cc.sys.localStorage.setItem("checkPointJsonData",a);
            }
            console.log(checkpointIndex+1);
            console.log(cc.sys.localStorage.getItem("maxCheckpoint"));
            if(checkpointIndex+1 == parseInt(cc.sys.localStorage.getItem("maxCheckpoint"))) {
                console.log("执行到了");
                cc.sys.localStorage.setItem("maxCheckpoint", checkpointIndex + 2);
            }
           
        }
    },



});
