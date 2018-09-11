cc.Class({
    extends: cc.Component,

    properties: {

        gameLayer: {
            default: null,
            type: cc.Node,
        },

        touchImg:{
            default:null,
            type: cc.Sprite,
        },
        areaImg:{
            default:null,
            type: cc.Sprite,
        },

        cutProgressLabel:{
            default:null,
            type:cc.Label,
        },

        targetProgressLabel:{
            default:null,
            type:cc.Label,
        },
        targetSprite:{
            default:null,
            type:cc.Sprite,
        }
    },

    



    // use this for initialization
    onLoad: function () {
        // console.log("UI ONLOAD"); 
        // console.log(this.gameLayer.getComponent("gameLayer").currentNode.getComponent("checkPointTouchLogic").targetCount);
        this.checkPointJS = this.gameLayer.getComponent("gameLayer").currentNode.getComponent("checkPointTouchLogic");
        this.checkpointClass = this.checkPointJS.checkpointClass;
        //击中完成关卡
        if(this.checkpointClass == 0) {
            this.targetSprite.spriteFrame = this.touchImg.spriteFrame;
            
        } else if(this.checkpointClass == 1) {
            console.log("执行到了 area img");
            
            let w = this.targetSprite.node.width;
            let h = this.targetSprite.node.height;
            this.targetSprite.spriteFrame = this.areaImg.spriteFrame;
         
            this.targetSprite.node.width = w;
            this.targetSprite.node.height =h;
           
            this.targetSprite.node.color = cc.dataMgr.getRigidBodyColorByTag(2);
        } else if(this.checkpointClass == 2) {
            let w = this.targetSprite.node.width;
            let h = this.targetSprite.node.height;
            this.targetSprite.spriteFrame = this.checkPointJS.targetSprite.spriteFrame;
            this.targetSprite.node.width = w;
            this.targetSprite.node.height =h;
        }
        this.refreash();
    },

    refreash:function() {
        this.checkPointJS = this.gameLayer.getComponent("gameLayer").currentNode.getComponent("checkPointTouchLogic");
        this.checkpointClass = this.checkPointJS.checkpointClass;
      //  console.log("看下进度");
        this.cutProgressLabel.string = this.checkPointJS.currentTouchCount + "/" +this.checkPointJS.touchCount;
        //console.log(this.checkpointClass);
        if(this.checkpointClass == 0) {
            this.targetProgressLabel.string = this.checkPointJS.currentResultCount + "/" + this.checkPointJS.resultCount;
            // console.log("看下进度");
            // console.log(this.targetProgressLabel.string);
        } else if(this.checkpointClass == 1) {
            this.targetProgressLabel.string = this.checkPointJS.currentResultCount + "/" + this.checkPointJS.resultCount +"%";
        } if(this.checkpointClass == 2) {
            this.targetProgressLabel.string = this.checkPointJS.currentResultCount + "/" + this.checkPointJS.resultCount;
            // console.log("看下进度");
            // console.log(this.targetProgressLabel.string);
        } 
    },

    initUI:function() {

    },

    start: function () {

    },

    backClick: function () {
        cc.director.loadScene('selectCheckpoint');
    },

    reNewClick: function () {
        this.gameLayer.getComponent("gameLayer").reNew();
       
        this.refreash();
    },

    helpClick: function () {
        this.gameLayer.getComponent("gameLayer").readerHelpLine();
    },



});
