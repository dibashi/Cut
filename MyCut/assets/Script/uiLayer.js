cc.Class({
    extends: cc.Component,

    properties: {

        gameLayer: {
            default: null,
            type: cc.Node,
        },

        touchImg: {
            default: null,
            type: cc.Sprite,
        },
        areaImg: {
            default: null,
            type: cc.Sprite,
        },

        cutProgressLabel: {
            default: null,
            type: cc.Label,
        },

        targetProgressLabel: {
            default: null,
            type: cc.Label,
        },
        targetSprite: {
            default: null,
            type: cc.Sprite,
        },

        nextNode: {
            default: null,
            type: cc.Node,
        },


        honors: {
            default: null,
            type: cc.Node,
        },

        shareAlert: {
            default: null,
            type: cc.Prefab,
        },

        nextFriend: {
            default: null,
            type: cc.Sprite,
        },

        prizeNode:{
            default:null,
            type:cc.Node,
        },

        coinLabel:{
            default:null,
            type:cc.Label,
        },

        rankingView: {
            default: null,
            type: cc.Node,
        },

        sub_list: {
            default: null,
            type: cc.Node,
        },

        sub_my: {
            default: null,
            type: cc.Node,
        },

      
    },





    // use this for initialization
    onLoad: function () {

          //向子域发送请求，获得所有的好友数据
          this.sendMessageToSubdomainGetFriendDatas();
          this.tex = new cc.Texture2D();

        console.log("UI ONLOAD");

        this.coinLabel.string = "x" + cc.dataMgr.getCoinCount();
        this.refreash();

        this.rankingView.active = false;
        this.initSubCanvas();
    },

    initSubCanvas() {
        if (!this.tex1)
            this.tex1 = new cc.Texture2D();
        if (CC_WECHATGAME) {
            //console.log("-- WECHAT Start.js initSubCanvas --");
            window.sharedCanvas.width = 720;
            window.sharedCanvas.height = 1280;
        }
    },

    refreash: function () {
        console.log("UI refreash");
        // console.log(this.gameLayer.getComponent("gameLayer").currentNode.getComponent("checkPointTouchLogic").targetCount);
        this.checkPointJS = this.gameLayer.getComponent("gameLayer").currentNode.getComponent("checkPointTouchLogic");
        this.checkpointClass = this.checkPointJS.checkpointClass;
        this.targetSprite.node.color = cc.color(255, 255, 255, 255);
        //击中完成关卡
        if (this.checkpointClass == 0) {
            this.targetSprite.spriteFrame = this.touchImg.spriteFrame;

        } else if (this.checkpointClass == 1) {
            // console.log("执行到了 area img");

            let w = this.targetSprite.node.width;
            let h = this.targetSprite.node.height;
            this.targetSprite.spriteFrame = this.areaImg.spriteFrame;

            this.targetSprite.node.width = w;
            this.targetSprite.node.height = h;

            this.targetSprite.node.color = cc.dataMgr.getRigidBodyColorByTag(2);
        } else if (this.checkpointClass == 2) {
            let w = this.targetSprite.node.width;
            let h = this.targetSprite.node.height;
            console.log("aaa");
            console.log(this.checkPointJS.targetSprite);
            this.targetSprite.spriteFrame = this.checkPointJS.targetSprite.spriteFrame;
            this.targetSprite.node.width = w;
            this.targetSprite.node.height = h;
        }


        //  console.log("看下进度");
        this.cutProgressLabel.string = this.checkPointJS.currentTouchCount + "/" + this.checkPointJS.touchCount;
        //console.log(this.checkpointClass);
        if (this.checkpointClass == 0) {
            this.targetProgressLabel.string = this.checkPointJS.currentResultCount + "/" + this.checkPointJS.resultCount;
            // console.log("看下进度");
            // console.log(this.targetProgressLabel.string);
        } else if (this.checkpointClass == 1) {
            this.targetProgressLabel.string = this.checkPointJS.currentResultCount + "/" + this.checkPointJS.resultCount + "%";
        } if (this.checkpointClass == 2) {
            this.targetProgressLabel.string = this.checkPointJS.currentResultCount + "/" + this.checkPointJS.resultCount;
            // console.log("看下进度");
            // console.log(this.targetProgressLabel.string);
        }
    },

    sendMessageToSubdomainGetFriendDatas: function () {
        if (CC_WECHATGAME) {
            window.sharedCanvas.width = 720;
            window.sharedCanvas.height = 1280;
            window.wx.postMessage({
                messageType: 6,
                MAIN_MENU_NUM: "score"
            });
        }
    },

    initUI: function () {

    },

    start: function () {

        this.halfWinHeight = cc.find('Canvas').height * 0.5;

        //标记 是否正在向上或者向下

        this.dirUp = false;
        this.dirDown = false;

        this.showNextFriend();
    },

    showNextFriend:function() {
      
        this.scheduleOnce(this.seeNextBeyondFriend,0.5);
    }, 
    
    seeNextBeyondFriend: function () {
        if (CC_WECHATGAME) {
            let self = this;
            window.wx.postMessage({
                messageType: 8,
                myScore: self.currentScore(),
            });
            self.scheduleOnce(this._updateSubDomainCanvas, 2);
        }
    },

    currentScore:function() {
        return cc.dataMgr.currentScore();
    },


     // 刷新子域的纹理
     _updateSubDomainCanvas() {
        if (window.sharedCanvas != undefined) {
            this.tex.initWithElement(window.sharedCanvas);
            this.tex.handleLoadedTexture();
            this.nextFriend.spriteFrame = new cc.SpriteFrame(this.tex);
        }
    },

    backClick: function () {
        cc.director.loadScene('start');
    },

    reNewClick: function () {
        this.showNextFriend();
        this.gameLayer.getComponent("gameLayer").reNew();
        //this.nextNode.getComponent(cc.Animation).play("nextNodeBackAni");
        //this.nextNode.runAction(cc.moveTo(1.0, cc.v2(0, -1000)));

       this.closeNextNode();
        this.refreash();
    },

    helpClick: function () {


        let ss = cc.instantiate(this.shareAlert);
        ss.zIndex = 1000;
        ss.getComponent("shareAlert").onWho = this.node;
        this.node.addChild(ss);

    },

    helpCallback: function () {
        this.reNewClick();
        this.gameLayer.getComponent("gameLayer").renderHelpLine();
    },

    nextCheckpointClick: function () {
        //todo 这里没有检测是否越界！！！


        cc.dataMgr.currentCheckPoint = cc.dataMgr.getRandomCheckpoint();


        this.reNewClick();
    },

    onCheckpointSuccess: function (event) {

        //  console.log(event);
        for (let i = 0; i < this.honors.children.length; i++) {
            this.honors.children[i].color = cc.color(65, 50, 50, 255);
        }

        for (let i = 0; i < event.detail.crownCount; i++) {
            this.honors.children[i].color = cc.color(255, 255, 255, 255);
        }

        if(event.detail.givePrize == true) {
           this.prizeNode.active = true;
           
           this.coinLabel.string = "x" + cc.dataMgr.addCoinCount(5);
        } else {
            this.prizeNode.active = false;
        }

        //if (cc.dataMgr.currentCheckPoint < cc.dataMgr.MAX_CHECKPOINT_COUNT) {
            //this.nextNode.getComponent(cc.Animation).play("nextNodeAni");
            if (!this.dirUp) {
                this.dirUp = true;
                let ac = cc.moveTo(1.0, cc.v2(0, -this.halfWinHeight + this.nextNode.height * 0.5));
                let fc = cc.callFunc(this.dirUped, this);
                this.nextNode.runAction(cc.sequence(ac, fc));
            }

       // }

    },

    dirUped: function () {
        this.dirUp = false;
    },

    dirDowned: function () {
        this.dirDown = false;
    },

    closeNextNode:function() {
        if (!this.dirDown) {
            this.dirDown = true;
            let ac = cc.moveTo(1.0, cc.v2(0, -1500));
            let fc = cc.callFunc(this.dirDowned, this);
            this.nextNode.runAction(cc.sequence(ac, fc));
        }
    },

    tipsClick:function() {
        //如果金币够 则提示
        if( cc.dataMgr.getCoinCount() >= 50) {
            this.coinLabel.string = "x" + cc.dataMgr.addCoinCount(-50);
            this.helpCallback();
        } else {
            let ss = cc.instantiate(this.shareAlert);
            ss.zIndex = 1000;
            ss.getComponent("shareAlert").onWho = this.node;
            ss.getComponent("shareAlert").showTips();
            this.node.addChild(ss);
    
        }
    },

    onLeaderboardClick:function() {
        if (CC_WECHATGAME) {
            this.rankingView.active = true;
          
            //console.log("-- WECHAT Start.js subPostMessage --");
            window.wx.postMessage({
                messageType: 1,
                MAIN_MENU_NUM: "score"
                //,myScore: cc.dataMgr.userData.countJump
            });
            this.node.runAction(cc.sequence(cc.delayTime(0.1), cc.callFunc(this.updataSubCanvas, this)));
            this.scheduleOnce(this.updataSubCanvas, 2.4);
        }
    },

    updataSubCanvas() {
        if (CC_WECHATGAME && this.rankingView.active) {
            console.log("-- WECHAT Start.js updataSubCanvas --");
            this.tex1.initWithElement(window.sharedCanvas);
            this.tex1.handleLoadedTexture();
            this.sub_list.getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(this.tex1);
            this.sub_my.getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(this.tex1);
        }
    },

    onBackClick: function () {
        this.rankingView.active = false;
    },


});
