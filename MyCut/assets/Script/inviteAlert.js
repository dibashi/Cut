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

        inviteSpriteFrame: cc.SpriteFrame,
        invitedSpriteFrame: cc.SpriteFrame,

        giftBagTips: cc.SpriteFrame,
        giftBagComplete: cc.SpriteFrame,

        coinTipsAlert:cc.Prefab,
        giftBagTipsAlert:cc.Prefab,

        inviteBtnNodes: {
            default: [],
            type: cc.Node,
        },

        giftBagSpr: {
            default: null,
            type: cc.Sprite,
        }
    },

    onLoad() {
        this.startFadeIn();

        console.log("向服务器发送请求，获得当前邀请数");

        this.prizeCoinList = [0, 30, 40, 60, 80, 100];

        this.enableColor = new cc.Color(255, 245, 0, 255);
        this.disableColor = new cc.Color(108, 106, 117, 255);
        console.log(this.disableColor);

        this.initUI();

        cc.dataMgr.refreshrecommended(this.prizeCallback,this);

        
    },

    initUI() {

        this.giftBagSpr.spriteFrame = this.giftBagTips;
        for (let i = 1; i < this.inviteBtnNodes.length; i++) {
            this.inviteBtnNodes[i].color = this.disableColor;
            this.inviteBtnNodes[i].getComponent(cc.Button).interactable = false;
        }
    },

    giftClick: function () {
        console.log("giftClick!~");
    },

    prizeCallback: function (count) {
        console.log("invite alert count --->" + count);

        let inviteCountObj = cc.dataMgr.addInviteCount(count);
        console.log(inviteCountObj);
        console.log(this);
        this.refreshUIandGivePrize(inviteCountObj.preCount, inviteCountObj.curCount);
    },

    //preCount,curCount两个参数的差值用于计算奖励，curCount的值用于刷新界面
    refreshUIandGivePrize: function (preCount, curCount) {

        for (let i = 0; i < this.inviteBtnNodes.length; i++) {
            if (i < curCount) {
                this.inviteBtnNodes[i].color = this.disableColor;
                this.inviteBtnNodes[i].getComponent(cc.Button).interactable = false;
                this.inviteBtnNodes[i].getChildByName("inviteLabel").getComponent(cc.Sprite).spriteFrame = this.invitedSpriteFrame;
            } else if (i == curCount) {
                this.inviteBtnNodes[i].color = this.enableColor;
                this.inviteBtnNodes[i].getComponent(cc.Button).interactable = true;
                this.inviteBtnNodes[i].getChildByName("inviteLabel").getComponent(cc.Sprite).spriteFrame = this.inviteSpriteFrame;
            } else if (i > curCount) {
                this.inviteBtnNodes[i].color = this.disableColor;
                this.inviteBtnNodes[i].getComponent(cc.Button).interactable = false;
                this.inviteBtnNodes[i].getChildByName("inviteLabel").getComponent(cc.Sprite).spriteFrame = this.inviteSpriteFrame;
            }
        }
        if (curCount > 4) {//>=5
            let isReceiveGift =  cc.sys.localStorage.getItem("isReceiveGift");
            this.giftBagSpr.spriteFrame = this.giftBagComplete;


            if (isReceiveGift == 0) {//1 领取过了 0 没有领取
                cc.sys.localStorage.setItem("isReceiveGift", 1)
                this.giftBagPrize();
            }

        } else {
            this.giftBagSpr.spriteFrame = this.giftBagTips;
        }

        if (curCount > preCount) {
            let prizeCount = 0;
            if(curCount>5) {
                curCount = 5;
            }
            for (let i = preCount + 1; i <= curCount; i++) {
                prizeCount += this.prizeCoinList[i];
                console.log("给用户的金币数计算---》"  + prizeCount);
            }
            if(prizeCount>0) {
                this.givePrize(prizeCount);
            }
            
        }
    },

    giftBagPrize:function() {

        cc.dataMgr.addCoinCount(300);

        console.log("弹出大礼包！");

       
        let ss = cc.instantiate(this.giftBagTipsAlert);
        ss.zIndex = 1002;
        ss.getComponent("tipsAlert").onWho = this.node;
        this.node.addChild(ss);
    },

    givePrize: function (prizeCount) {

        cc.dataMgr.addCoinCount(prizeCount);
        console.log("弹出 奖励金币！");

       
        let ss = cc.instantiate(this.coinTipsAlert);
        ss.zIndex = 1001;
        ss.getComponent("tipsAlert").onWho = this.node;
        ss.getComponent("tipsAlert").setCountLabel(prizeCount);
        this.node.addChild(ss);
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




    onInviteClick: function () {



        //this.onFadeOutFinish();
        //邀请好友
        if (CC_WECHATGAME) {
            let query_string = cc.sys.localStorage.getItem("openid");
            console.log("准备发送请求的 query " + query_string);

            wx.shareAppMessage({
                title: cc.dataMgr.getShareTitle("game"),
                imageUrl: cc.dataMgr.getShareImgeUri("game"), query: "otherID=" + query_string,
            });
        }
    },

    onFadeOutFinish: function () {
        cc.eventManager.resumeTarget(this.onWho, true);
        this.node.destroy();
    },


    onCancelClick: function () {
        let cbFadeOut = cc.callFunc(this.onFadeOutFinish, this);
        let actionFadeOut = cc.sequence(cc.spawn(cc.fadeTo(0.3, 0), cc.scaleTo(0.3, 2.0)), cbFadeOut);
        this.node.runAction(actionFadeOut);

        this.onWho.getComponent("start").refreshCoin();
    },

});



