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
            type:cc.Node,
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
            this.targetSprite = this.touchImg.spriteFrame;
            
        } else if(this.checkpointClass == 1) {
            this.targetSprite = this.areaImg.spriteFrame;
        }
        this.refreash();
    },

    refreash:function() {
        console.log("看下进度");
        this.cutProgressLabel.string = this.checkPointJS.currentTouchCount + "/" +this.checkPointJS.touchCount;
        console.log(this.checkpointClass);
        if(this.checkpointClass == 0) {
            this.targetProgressLabel.string = this.checkPointJS.currentResultCount + "/" + this.checkPointJS.resultCount
            console.log("看下进度");
            console.log(this.targetProgressLabel.string);
        } else if(this.checkpointClass == 1) {
            this.targetProgressLabel.string = this.checkPointJS.currentResultCount + "/" + this.checkPointJS.resultCount +"%";
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
    },

    helpClick: function () {
        this.gameLayer.getComponent("gameLayer").readerHelpLine();
    },



});
