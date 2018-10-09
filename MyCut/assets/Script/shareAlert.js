// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        onWho: null,//在哪个页面上面，当当前页面消失时使得那个页面可点击
      
        inviteAlert: {
            default: null,
            type: cc.Prefab,
        },

        coinTips: cc.Node,
    },

    showTips:function() {
        console.log("showTips call!");
        this.coinTips.active = true;
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        
        this.startFadeIn();
    },

    startFadeIn: function () {
        cc.eventManager.pauseTarget(this.node, true);
        this.node.setScale(2);
        this.node.opacity = 0;
        let cbFadeIn = cc.callFunc(this.onFadeInFinish, this);
        let actionFadeIn = cc.sequence(cc.spawn(cc.fadeTo(0.3, 255), cc.scaleTo(0.3, 1)), cbFadeIn);
        this.node.runAction(actionFadeIn);
    },

    onFadeInFinish: function () {
        cc.eventManager.resumeTarget(this.node, true);
    },

    //可以点击代表其值为1
    onRecommendedClick: function () {
        // let ss = cc.instantiate(this.inviteAlert);
        // ss.zIndex = 1000;
        // ss.getComponent("inviteAlert").onWho = this.node;
        // this.node.addChild(ss);
    },

    //可以点击代表其值为1
    onGuangGaoClick: function () {
        cc.audioMgr.playBtn();
        // cc.videoAd.show();
        // cc.director.getScheduler().pauseTarget(this);
        cc.eventManager.pauseTarget(this.node, true);
        //this.onWho.getComponent("uiLayer").helpCallback();

        let cbFadeOut = cc.callFunc(this.onFadeOutFinish, this);
        let actionFadeOut = cc.sequence(cc.spawn(cc.fadeTo(0.3, 0), cc.scaleTo(0.3, 2.0)), cbFadeOut);
        this.node.runAction(actionFadeOut);
        console.log("观看广告获得提示按钮被点击");
    },

    //广告成功，分享成功的回调，用于给用户奖励。
    givePrize: function () {
        console.log("给用户奖励！~~");
        cc.eventManager.pauseTarget(this.node, true);
        this.onWho.getComponent("uiLayer").helpCallback();

        let cbFadeOut = cc.callFunc(this.onFadeOutFinish, this);
        let actionFadeOut = cc.sequence(cc.spawn(cc.fadeTo(0.3, 0), cc.scaleTo(0.3, 2.0)), cbFadeOut);
        this.node.runAction(actionFadeOut);
    },


    shareClick: function () {
        cc.audioMgr.playBtn();
        let self = this;
       
        
      
        
       // let query_string = cc.sys.localStorage.getItem("openid");
        //console.log("准备发送请求的 query " + query_string);


        console.log("otherID=" + cc.sys.localStorage.getItem("openid") + "&checkpoint=" + cc.dataMgr.currentCheckPoint);
        wx.shareAppMessage({
            title: cc.dataMgr.getShareTitle("game"),
            imageUrl: cc.dataMgr.getShareImgeUri("game"), 
            query:"otherID=" + cc.sys.localStorage.getItem("openid") + "&checkpoint=" + cc.dataMgr.currentCheckPoint,
            
            success: (obj) => {
                console.log("分享回调成功")
                console.log(obj);

                cc.eventManager.pauseTarget(self.node, true);
                self.onWho.getComponent("uiLayer").helpCallback();


                let cbFadeOut = cc.callFunc(self.onFadeOutFinish, self);
                let actionFadeOut = cc.sequence(cc.spawn(cc.fadeTo(0.3, 0), cc.scaleTo(0.3, 2.0)), cbFadeOut);
                self.node.runAction(actionFadeOut);
            },
            fail: (obj) => {
                console.log("分享回调失败")
                console.log(obj);
            },
            complete: (obj) => {
                console.log("分享回调默认")
                console.log(obj);
            }
        });
    },

    onCancelClick: function () {
        cc.audioMgr.playBtn();
        let cbFadeOut = cc.callFunc(this.onFadeOutFinish, this);
        let actionFadeOut = cc.sequence(cc.spawn(cc.fadeTo(0.3, 0), cc.scaleTo(0.3, 2.0)), cbFadeOut);
        this.node.runAction(actionFadeOut);
    },

    onFadeOutFinish: function () {
        //cc.eventManager.resumeTarget(this.onWho, true);
        this.node.destroy();
    },
    

});



