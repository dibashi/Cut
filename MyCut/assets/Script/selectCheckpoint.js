import DataMgr from 'DataMgr';

cc.Class({
    extends: cc.Component,

    properties: {
        diamondLabel: cc.Label,

        checkPoints: {
            default: null,
            type: cc.Node,
        },

        startLayer:{
            default:null,
            type:cc.Node,
        },

        gameLayer:{
            default:null,
            type:cc.Node,
        }

    },

    goCheckpoint: function (event, eventData) {
       

       

        console.log(eventData);
        cc.dataMgr.currentCheckPoint = eventData;
        //cc.director.loadScene('gameScene');
        this.openLayerActive(this.gameLayer);

        this.gameLayerRunIn();
    },

    gameLayerRunIn:function() {
        this.gameLayer.getChildByName("game").getComponent("game").init();
        this.startLayer.runAction(cc.moveBy(1,cc.v2(0,1280)).easing(cc.easeOut(3.0)));
        this.gameLayer.runAction(cc.moveBy(1,cc.v2(0,1280)).easing(cc.easeOut(3.0)));
    },

    closeAllLayersActive:function() {
        this.startLayer.active = false;
        this.gameLayer.active = false;
    },

    openLayerActive:function(layer) {
       
       layer.active = true;
    },

    // use this for initialization
    onLoad: function () {
        if (!cc.dataMgr) {
          
            cc.dataMgr = new DataMgr();
            cc.dataMgr.initData();
        }
        this.closeAllLayersActive();
        this.openLayerActive(this.startLayer);
        //console.log("执行到 onload  selectCheckPoint!~~");
        //cc.sys.localStorage.setItem("dangQianGuanKa",1); //测试用
        // this.refreshCheckPoint();
        // this.diamondLabel.string = cc.sys.localStorage.getItem("diamondCount");
    },

    refreshCheckPoint: function () {

        //从1计数 第一关是1
        let dangQianGuanKa = parseInt(cc.sys.localStorage.getItem("dangQianGuanKa"));
        //console.log("pre dangQianGuanKa " +dangQianGuanKa);
        if(dangQianGuanKa == null || typeof(dangQianGuanKa) == undefined || isNaN(dangQianGuanKa)) {
            dangQianGuanKa = 1;
        }
        //console.log("dangQianGuanKa  " +dangQianGuanKa);
        let cps = this.checkPoints.children;
        for (let i = 0; i < cps.length; i++) {
            //console.log(cps[i].name);
            if (i < (dangQianGuanKa - 1)) {
                cps[i].opacity = 255;
                cps[i].getComponent(cc.Button).interactable = true;
                cps[i].getChildByName("tubiao_wancheng").active = true;
            } else if (i == (dangQianGuanKa - 1)) {
                cps[i].opacity = 255;
                cps[i].getComponent(cc.Button).interactable = true;
                cps[i].getChildByName("tubiao_wancheng").active = false;
            } else if (i > (dangQianGuanKa - 1)) {
                cps[i].opacity = 70;
                cps[i].getComponent(cc.Button).interactable = false;
                cps[i].getChildByName("tubiao_wancheng").active = false;
            }
        }
    },

    // called every frame
    update: function (dt) {

    },

    goMainLayer: function () {

        cc.director.loadScene('start');
    },
});
