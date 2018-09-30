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

        inviteBtnNodes: {
            default: [],
            type: cc.Node,
        },

        giftBagBtnNode: {
            default: null,
            type: cc.Node,
        }
    },

    onLoad() {
        this.startFadeIn();

        console.log("向服务器发送请求，获得当前邀请数");

        cc.dataMgr.refreshrecommended(this.prizeCallback);

        this.prizeCoinList = [0, , 30, 40, 60, 80, 100];

        this.enableColor = cc.color(255, 245, 0, 255);
        this.disableColor = cc.color(108, 106, 117, 255);

        this.initUI();
    },

    initUI() {
        this.giftBagBtnNode.color = this.disableColor;
        this.giftBagBtnNode.getComponent(cc.Button).interactable = false;
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
        this.refreshUIandGivePrize(inviteCountObj.preCount, inviteCountObj.curCount);
    },

    //preCount,curCount两个参数的差值用于计算奖励，curCount的值用于刷新界面
    refreshUIandGivePrize: function (preCount, curCount) {

        for (let i = 0; i < this.inviteBtnNodes.length; i++) {
            if (i < curCount) {
                this.inviteBtnNodes[i].color = this.disableColor;
                this.inviteBtnNodes[i].getComponent(cc.Button).interactable = false;
                this.inviteBtnNodes[i].getComponent(cc.Sprite).spriteFrame = this.invitedSpriteFrame;
            } else if (i == curCount) {
                this.inviteBtnNodes[i].color = this.enableColor;
                this.inviteBtnNodes[i].getComponent(cc.Button).interactable = true;
                this.inviteBtnNodes[i].getComponent(cc.Sprite).spriteFrame = this.inviteSpriteFrame;
            } else if (i > curCount) {
                this.inviteBtnNodes[i].color = this.disableColor;
                this.inviteBtnNodes[i].getComponent(cc.Button).interactable = false;
                this.inviteBtnNodes[i].getComponent(cc.Sprite).spriteFrame = this.inviteSpriteFrame;
            }
        }
        if (curCount >4) {//>=5
            let isReceiveGift = cc.sys.localStorage.getItem("isReceiveGift");
            if(!isReceiveGift) {//true 领取过了 false 没有领取
                this.giftBagBtnNode.color = this.enableColor;
                this.giftBagBtnNode.getComponent(cc.Button).interactable = true;
                //纹理设置为领取todo
            } else {
                console.log("领取过了");
                this.giftBagBtnNode.color = this.disableColor;
                this.giftBagBtnNode.getComponent(cc.Button).interactable = false;
                //纹理设置为已领取todo
            }
           
        } else {
            this.giftBagBtnNode.color = this.disableColor;
            this.giftBagBtnNode.getComponent(cc.Button).interactable = false;
            //纹理设置为领取 todo
        }

        if(curCount>preCount) {
            let prizeCount = 0;
            for(let i = preCount + 1; i<=curCount;i++) {
                prizeCount+= this.prizeCoinList[i];
            }
            this.givePrize(prizeCount);
        }
    },

    givePrize:function(prizeCount) {
        



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
    },

});



