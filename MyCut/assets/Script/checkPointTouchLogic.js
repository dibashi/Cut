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




        //最优触摸数量
        touchCount: 1,
        //目标任务
        resultCount: 1,
        //当前触摸数量
        currentTouchCount: 0,
        //当前任务进度
        currentResultCount: 0,

        helpTouchBegin: {
            default: null,
            type: cc.Vec2,
        },

        helpTouchEnd: {
            default: null,
            type: cc.Vec2,
        },

        //0，击中目标，1掉落质量,2间接碰撞
        checkpointClass: 0,

        //被切割物体的总质量
        totalMass: 0,
        currentMass: 0.0,

        //旋转关节的节点集合，用于在gameLayer中检测 分配新生成的刚体
        revoluteJointNodeArr: {
            default: [],
            type: cc.Node,
        },

        //用于给ui界面一个目标显示 蓝的不用赋值
        targetSprite: {
            default: null,
            type: cc.Sprite,
        },
    },

    onLoad: function () {

        for (let i = 0; i < this.revoluteJointNodeArr.length; i++) {
            this.revoluteJointNodeArr[i].zIndex = 3;
        }


    },



    start: function () {
        if (this.checkpointClass == 1) {
            console.log("执行到了mass");
            console.log(this.node.children);
            let childs = this.node.children;
            let count = childs.length;
            for (let i = 0; i < count; i++) {
                console.log("执行到了mass1");
                let ppc = childs[i].getComponent(cc.PhysicsPolygonCollider);
                if (ppc && ppc.tag == 2) {
                    console.log("执行到了mass11");
                    console.log(childs[i].getComponent(cc.RigidBody));
                    console.log(childs[i].getComponent(cc.RigidBody).getMass());
                    this.totalMass += childs[i].getComponent(cc.RigidBody).getMass();
                }
            }
        }

        console.log("mass--->  " + this.totalMass);
    },


    checkIsOver: function () {
        console.log("check is over");

        if (this.currentResultCount >= this.resultCount) {
            console.log("发送事件  checkpointSuccess");
            // this.node.emit('checkpointSuccess');

            //皇冠数量储存 
            let crownCount = 3 - (this.currentTouchCount - this.touchCount);
            if (crownCount > 3) {
                crownCount = 3;
            } else if (crownCount < 1) {
                crownCount = 1;
            }
            let ea = new cc.Event.EventCustom('checkpointSuccess', true);
            ea.detail = { "crownCount": crownCount };
           console.log(ea);
            this.node.dispatchEvent(ea);


            //获取当前关卡索引 往json对象数组插入数据
            let checkpointIndex = cc.dataMgr.currentCheckPoint - 1;
            let stringOfJSON = cc.sys.localStorage.getItem("checkPointJsonData");
            let jsonObj = JSON.parse(stringOfJSON);
            if (crownCount > jsonObj[checkpointIndex].crownCount) {
                jsonObj[checkpointIndex].crownCount = crownCount;
                var a = JSON.stringify(jsonObj);
                cc.sys.localStorage.setItem("checkPointJsonData", a);
            }
            console.log(checkpointIndex + 1);
            console.log(cc.sys.localStorage.getItem("maxCheckpoint"));
            if (checkpointIndex + 1 == parseInt(cc.sys.localStorage.getItem("maxCheckpoint"))) {
                console.log("执行到了");
                cc.sys.localStorage.setItem("maxCheckpoint", checkpointIndex + 2);
            }

        }
    },

    hittedMassTrigger: function (mass) {
        this.currentMass += mass;
        console.log(this.currentMass);

        this.currentResultCount = Math.round(this.currentMass / this.totalMass * 100);
    },

    update() {
        //突然想到用质量触发器，来获取刚体质量 然后计算
        // if (this.checkpointClass == 1) {
        //     let childs = this.node.children;
        //     let count = childs.length;
        //     for (let i = 0; i < count; i++) {
        //         let ppc = childs[i].getComponent(cc.PhysicsPolygonCollider);
        //         if (ppc && ppc.tag == 2) {
        //             console.log("执行到了mass11");
        //             console.log(childs[i].getComponent(cc.RigidBody).getWorldPosition().y);
        //             console.log(childs[i].getComponent(cc.RigidBody).getMass());
        //             if(childs[i].getComponent(cc.RigidBody).getWorldPosition().y<-50){

        //             }
        //             this.totalMass += childs[i].getComponent(cc.RigidBody).getMass();
        //         }
        //     }
        // }
    }

});
