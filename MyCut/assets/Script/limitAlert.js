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

        countDownLabel: cc.Label,
    },


    // LIFE-CYCLE CALLBACKS:

    onLoad() {

        this.startFadeIn();

        let slt = cc.sys.localStorage.getItem("starLimitTime");
        if (!slt) {
            cc.sys.localStorage.setItem("starLimitTime", Date.now());
        }

        this.schedule(this.countDown, 1);
    },

    countDown: function () {
        let curTime = (5*60*1000) - parseInt(Date.now()) + parseInt(cc.sys.localStorage.getItem("starLimitTime"));
        if(curTime<0) {
            curTime = 0;
        }
        //console.log("curTime--> " + curTime);
        let ft = this.formatTime(curTime);
        this.countDownLabel.string = ft;
    },

    formatTime: function (inTime) {
        let fenzhong = Math.floor(inTime / (1000 * 60));//分钟
        //console.log("fenzhong--> " + fenzhong);
        let miao = Math.floor((inTime - fenzhong * (1000 * 60))/1000);
        let rf = fenzhong + "";
        if (fenzhong < 10) {
            rf = "0" + fenzhong;
        }
        let rm = miao + "";
        if (miao < 10) {
            rm = "0" + miao;
        }

        return rf + ":" + rm;
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


        wx.shareAppMessage({
            title: cc.dataMgr.getShareTitle(),
            imageUrl: cc.dataMgr.getShareImgeUri(),

            success: (obj) => {
                console.log("星星限制 分享成功回调")
                console.log(obj);

                cc.dataMgr.addStarLimit(3);


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



