

cc.Class({
    extends: cc.Component,

    properties: {
       
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


      


    },

    goCheckpoint: function (event, eventData) {


        //  console.log(eventData);
        cc.dataMgr.currentCheckPoint = parseInt(eventData);
        cc.director.loadScene('gameScene');
    },

    // use this for initialization
    onLoad: function () {
       

        this.refreshCheckPoint();


       
    },

    

   

    refreshCheckPoint: function () {

        

      
        let jsons = cc.sys.localStorage.getItem("checkPointJsonData");
        let jsonObj = JSON.parse(jsons);
        let checkPoints = this.checkPoints.children;

        for (let i = 0; i < checkPoints.length; i++) {
            
            let crownCount = parseInt(jsonObj[i].crownCount);
            //显示皇冠数量
            this.showCrown(checkPoints[i], crownCount);
            //底层图片是否碎裂
            this.showPanel(checkPoints[i], crownCount);
            //是否枷锁 //是否可玩
            this.showLock(checkPoints[i], crownCount);

           
        }
        
    },


    


    showCrown: function (checkPointNode, showCrownCount) {
        //先关闭所有的皇冠
        let crownCountNode = checkPointNode.getChildByName("crownCount");
        let honors = crownCountNode.children;
        for (let i = 0; i < honors.length; i++) {
            honors[i].active = false;
        }

        if (showCrownCount == 1) {
            honors[0].active = true;
            honors[0].position = cc.v2(0, 0);
        } else if (showCrownCount == 2) {
            honors[0].active = true;
            honors[1].active = true;
            honors[0].position = cc.v2(-20, 0);
            honors[1].position = cc.v2(20, 0);
        } else if (showCrownCount == 3) {
            honors[0].active = true;
            honors[1].active = true;
            honors[2].active = true;
            honors[0].position = cc.v2(0, 0);
            honors[1].position = cc.v2(-30, 0);
            honors[2].position = cc.v2(30, 0);
        }
    },

    showPanel: function (checkPointNode, showCrownCount) {
        if (showCrownCount > 0) {
            checkPointNode.getComponent(cc.Sprite).spriteFrame = this.panelEnd.spriteFrame;
        } else {
            checkPointNode.getComponent(cc.Sprite).spriteFrame = this.panelBegin.spriteFrame;
        }
    },

    showLock: function (checkPointNode, showCrownCount) {
        if (showCrownCount >0) {
            checkPointNode.getComponent(cc.Button).interactable = true;
            checkPointNode.getChildByName("lock").active = false;
        } else {
            
            checkPointNode.getComponent(cc.Button).interactable = false;
            checkPointNode.getChildByName("lock").active = true;
            //调试用
            // checkPointNode.getComponent(cc.Button).interactable = true;
            // checkPointNode.getChildByName("lock").active = false;
        }
    },

    // called every frame
    update: function (dt) {

    },

    goMainLayer: function () {

        cc.director.loadScene('start');
    },

   
   
   

  
    


});
