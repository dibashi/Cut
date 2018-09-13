import DataMgr from 'DataMgr';

import AudioMgr from 'AudioMgr';

cc.Class({
    extends: cc.Component,

    properties: {
        crownLabel: cc.Label,
        progressLabel:cc.Label,
        checkPoints: {
            default: null,
            type: cc.Node,
        },

        panelBegin: {
            default: null,
            type: cc.Sprite,
        },

        panelEnd: {
            default: null,
            type: cc.Sprite,
        },


        onMusicSpriteFrame: {
            default:null,
            type: cc.SpriteFrame,
        },

        offMusicSpriteFrame: {
            default:null,
            type:cc.SpriteFrame,
        },
        musicSprite: {
            default:null,
            type:cc.Sprite,
        }

    },

    goCheckpoint: function (event, eventData) {
       

      //  console.log(eventData);
        cc.dataMgr.currentCheckPoint = parseInt(eventData);
        cc.director.loadScene('gameScene');
    },

    // use this for initialization
    onLoad: function () {
        if (!cc.dataMgr) {
          
            cc.dataMgr = new DataMgr();
            cc.dataMgr.initData();
        }

        if (!cc.audioMgr) {
            //let AudioMgr = require("AudioMgr");
            cc.audioMgr = new AudioMgr();
            cc.audioMgr.init();
        }

        if(cc.audioMgr.isPlay) {
            this.musicSprite.spriteFrame = this.onMusicSpriteFrame;
        } else {
            this.musicSprite.spriteFrame = this.offMusicSpriteFrame;
        }
      
         this.refreshCheckPoint();
        // this.diamondLabel.string = cc.sys.localStorage.getItem("diamondCount");
    },

    refreshCheckPoint: function () {

        // //从1计数 第一关是1
        // let dangQianGuanKa = parseInt(cc.sys.localStorage.getItem("dangQianGuanKa"));
        // //console.log("pre dangQianGuanKa " +dangQianGuanKa);
        // if(dangQianGuanKa == null || typeof(dangQianGuanKa) == undefined || isNaN(dangQianGuanKa)) {
        //     dangQianGuanKa = 1;
        // }
        // //console.log("dangQianGuanKa  " +dangQianGuanKa);
        // let cps = this.checkPoints.children;
        // for (let i = 0; i < cps.length; i++) {
        //     //console.log(cps[i].name);
        //     if (i < (dangQianGuanKa - 1)) {
        //         cps[i].opacity = 255;
        //         cps[i].getComponent(cc.Button).interactable = true;
        //         cps[i].getChildByName("tubiao_wancheng").active = true;
        //     } else if (i == (dangQianGuanKa - 1)) {
        //         cps[i].opacity = 255;
        //         cps[i].getComponent(cc.Button).interactable = true;
        //         cps[i].getChildByName("tubiao_wancheng").active = false;
        //     } else if (i > (dangQianGuanKa - 1)) {
        //         cps[i].opacity = 70;
        //         cps[i].getComponent(cc.Button).interactable = false;
        //         cps[i].getChildByName("tubiao_wancheng").active = false;
        //     }
        // }

        let maxCheckpoint =  parseInt(cc.sys.localStorage.getItem("maxCheckpoint"));
        console.log(maxCheckpoint);
        let jsons = cc.sys.localStorage.getItem("checkPointJsonData");
        //console.log(jsons);
        let jsonObj = JSON.parse(jsons);
        //console.log(jsonObj);
        let checkPoints = this.checkPoints.children;

        this.label_crownCount = 0;
        this.label_progressCount = 0;
        for(let i = 0; i<checkPoints.length;i++) {
            let crownCount = parseInt(jsonObj[i].crownCount);
            //显示皇冠数量
            this.showCrown(checkPoints[i],crownCount);
            //底层图片是否碎裂
            this.showPanel(checkPoints[i],crownCount);
            //是否枷锁 //是否可玩
            this.showLock(checkPoints[i],i,maxCheckpoint);

            this.label_crownCount += crownCount;
            if(crownCount>0) {
                this.label_progressCount += 1;
            }
        }

        this.crownLabel.string = "X" + this.label_crownCount;
        this.progressLabel.string = this.label_progressCount + "/" + checkPoints.length;
        //给所有关卡 添加星数，有星数的 过关，过关的方块碎了，否则完好，max后的关卡 要锁上
    },

    showCrown:function(checkPointNode,showCrownCount) {
        //先关闭所有的皇冠
        let crownCountNode = checkPointNode.getChildByName("crownCount");
        let honors =  crownCountNode.children;
        for(let i = 0; i<honors.length;i++) {
            honors[i].active = false;
        }

        if(showCrownCount == 1) {
            honors[0].active = true;
            honors[0].position = cc.v2(0,0);
        } else if(showCrownCount == 2) {
            honors[0].active = true;
            honors[1].active = true;
            honors[0].position = cc.v2(-20,0);
            honors[1].position = cc.v2(20,0);
        } else if(showCrownCount == 3) {
            honors[0].active = true;
            honors[1].active = true;
            honors[2].active = true;
            honors[0].position = cc.v2(0,0);
            honors[1].position = cc.v2(-30,0);
            honors[2].position = cc.v2(30,0);
        }
    },

    showPanel:function(checkPointNode,showCrownCount) {
        if(showCrownCount>0) {
            checkPointNode.getComponent(cc.Sprite).spriteFrame = this.panelEnd.spriteFrame;
        } else {
            checkPointNode.getComponent(cc.Sprite).spriteFrame = this.panelBegin.spriteFrame;
        }
    },

    showLock:function(checkPointNode,index,maxCheckpoint) {
        if(index>=maxCheckpoint) {
            checkPointNode.getComponent(cc.Button).interactable = false;
            checkPointNode.getChildByName("lock").active = true;
        } else {
            checkPointNode.getComponent(cc.Button).interactable = true;
            checkPointNode.getChildByName("lock").active = false;
        }
    },

    // called every frame
    update: function (dt) {

    },

    goMainLayer: function () {

        cc.director.loadScene('start');
    },

    musicClick:function() {
        if(cc.audioMgr.isPlay) {
            cc.audioMgr.stopAll();
            this.musicSprite.spriteFrame = this.offMusicSpriteFrame;
        } else {
            cc.audioMgr.openAll();
            this.musicSprite.spriteFrame = this.onMusicSpriteFrame;
        }
    },
});
