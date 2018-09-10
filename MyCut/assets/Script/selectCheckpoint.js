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
        },

        mainCamera:{
            default:null,
            type:cc.Node,
        },

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
      
        // cc.eventManager.pauseTarget( this.startLayer, true);
        // this.mainCamera.runAction(cc.moveBy(1,cc.v2(0,-1280)).easing(cc.easeOut(3.0)));
        
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

        console.log("game scene on load");

        cc.director.getPhysicsManager().enabled = true; //开启物理系统，否则在编辑器里做的一切都没有任何效果
        //cc.director.getPhysicsManager().debugDrawFlags = //cc.PhysicsManager.DrawBits.e_aabbBit |
        //cc.PhysicsManager.DrawBits.e_pairBit |
        // cc.PhysicsManager.DrawBits.e_centerOfMassBit |
        //  cc.PhysicsManager.DrawBits.e_jointBit |
        //   cc.PhysicsManager.DrawBits.e_shapeBit; //开启物理调试信息
        // cc.director.getPhysicsManager().debugDrawFlags = 0; //-设置为0则关闭调试
        cc.director.getPhysicsManager().gravity = cc.v2(0, -320);//-320像素/秒的平方，这个是默认值，为了以后调试先放在这

        if (!cc.dataMgr) {
          
            cc.dataMgr = new DataMgr();
            cc.dataMgr.initData();

            cc.dataMgr.currentCheckPoint  = 1;
          
            this.gameLayerRunIn();
            
        }
        // this.gameLayer.runAction(cc.moveBy(10,cc.v2(0,400)).easing(cc.easeOut(3.0)));

        // this.scheduleOnce(this.openPhy,3);
    //    this.closeAllLayersActive();
      //  this.openLayerActive(this.gameLayer);

    },

    start:function() {
       // cc.director.getPhysicsManager().enabled = false;
    },

    // openPhy:function() {
    //     console.log("开启物理");
    //     cc.director.getPhysicsManager().enabled = true;
      
    // },

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
