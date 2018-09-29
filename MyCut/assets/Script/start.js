import DataMgr from 'DataMgr';

import AudioMgr from 'AudioMgr';

cc.Class({
    extends: cc.Component,

    properties: {
        crownLabel: cc.Label,
        progressLabel: cc.Label,
        coinLabel: cc.Label,

        inviteAlert:cc.Prefab,


        onMusicSpriteFrame: {
            default: null,
            type: cc.SpriteFrame,
        },

        offMusicSpriteFrame: {
            default: null,
            type: cc.SpriteFrame,
        },
        musicSprite: {
            default: null,
            type: cc.Sprite,
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

        node_content: {
            default: null,
            type: cc.Node,
        },


    },


    // use this for initialization
    onLoad: function () {
        if (!cc.dataMgr) {

            cc.dataMgr = new DataMgr();
            cc.dataMgr.initData();
        }

        if (!cc.audioMgr) {
            //let AudioMgr = require("AudioMgr");
            cc.audioMgr = new AudioMgr();
            cc.audioMgr.init();
        }

        if (cc.audioMgr.isPlay) {
            this.musicSprite.spriteFrame = this.onMusicSpriteFrame;
        } else {
            this.musicSprite.spriteFrame = this.offMusicSpriteFrame;
        }

        this.coinLabel.string = "X" + cc.dataMgr.getCoinCount();

        this.crownLabel.string = "X" + cc.dataMgr.currentScore();

       

        this.rankingView.active = false;
        this.initSubCanvas();
        cc.dataMgr.submitScore();


        
        if (CC_WECHATGAME) {
            let obj = wx.getLaunchOptionsSync();
            console.log(obj);
            if (obj && obj.shareTicket) {
                cc.dataMgr.shareTicket = obj.shareTicket;
                this.showGroup();
            }
            let path = obj.path;
            console.log("--- 游戏 path --" + path);
            if (!path)
                path = "";
        }

        
    },

    initSubCanvas() {
        if (!this.tex)
            this.tex = new cc.Texture2D();
        if (CC_WECHATGAME) {
            //console.log("-- WECHAT Start.js initSubCanvas --");
            window.sharedCanvas.width = 720;
            window.sharedCanvas.height = 1280;
        }
    },



  
     

  

   


    // called every frame
    update: function (dt) {

    },

    goMainLayer: function () {

        cc.director.loadScene('start');
    },

    musicClick: function () {
        if (cc.audioMgr.isPlay) {
            cc.audioMgr.stopAll();
            this.musicSprite.spriteFrame = this.offMusicSpriteFrame;
        } else {
            cc.audioMgr.openAll();
            this.musicSprite.spriteFrame = this.onMusicSpriteFrame;
        }
    },

    onLeaderboardClick: function () {
        console.log("onLeaderboardClick~");
        this.showFriend();
    },

    showFriend: function () {
        if (CC_WECHATGAME) {
            this.rankingView.active = true;
            this.rankingView.getChildByName("spr_friend").active = true;
            this.rankingView.getChildByName("spr_qun").active = false;
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

    groupClick: function () {
        let self = this;

        var str_imageUrl = null;
        var str_index = Math.floor(Math.random() * 2);
        var str_title = null;
        if (str_index == 0) {
            str_imageUrl = "https://bpw.blyule.com/res/raw-assets/Texture/shareImage0.5f075.jpg";
            str_title = "走开，别碰我！萌哭了";
        } else {
            str_imageUrl = "https://bpw.blyule.com/res/raw-assets/Texture/shareImage1.678a4.jpg";
            str_title = "萌翻全场，好想都抱回家!";
        }



        if (CC_WECHATGAME) {
            window.wx.updateShareMenu({
                withShareTicket: true,
                success() {
                    window.wx.shareAppMessage({
                        title: str_title,
                        imageUrl: str_imageUrl,
                        success: (res) => {
                            console.log("-- shareGroup success --");
                            console.log(res);
                            if (res.shareTickets != undefined && res.shareTickets.length > 0) {
                                cc.dataMgr.shareTicket = res.shareTickets[0];
                                self.showGroup();
                            }
                        }
                    });
                }
            });
        }
    },

    showGroup() {
        if (CC_WECHATGAME) {
            this.rankingView.active = true;
            this.rankingView.getChildByName("spr_friend").active = false;
            this.rankingView.getChildByName("spr_qun").active = true;
            console.log("-- 开局显示群排行 --" + cc.dataMgr.shareTicket);
            if (cc.dataMgr.shareTicket) {
                window.wx.postMessage({
                    messageType: 5,
                    MAIN_MENU_NUM: "score",
                    shareTicket: cc.dataMgr.shareTicket
                });
            }

            this.node.runAction(cc.sequence(cc.delayTime(0.1), cc.callFunc(this.updataSubCanvas, this)));
            this.scheduleOnce(this.updataSubCanvas, 2.4);
        }
    },

    updataSubCanvas() {
        if (CC_WECHATGAME && this.rankingView.active) {
            console.log("-- WECHAT Start.js updataSubCanvas --");
            this.tex.initWithElement(window.sharedCanvas);
            this.tex.handleLoadedTexture();
            this.sub_list.getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(this.tex);
            this.sub_my.getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(this.tex);
            this.node_content.height = this.sub_list.height;
        }
    },

    onBackClick: function () {
        this.rankingView.active = false;
    },

    onShareClick: function () {
        console.log("点击分享");

       cc.dataMgr.shareByTag("start");
    },

    inviteClick:function() {
        console.log("invite click!~");
        let ss = cc.instantiate(this.inviteAlert);
        ss.zIndex = 1000;
        ss.getComponent("inviteAlert").onWho = this.node;
        this.node.addChild(ss);
        
    },

    goGame:function() {
        console.log("go game click!~");

        cc.dataMgr.currentCheckPoint = cc.dataMgr.getRandomCheckpoint();
        console.log( cc.dataMgr.currentCheckPoint );
        cc.director.loadScene('gameScene');
    },  
    goSelectCheckpoint:function() {
        console.log("go game click!~");
        
        cc.director.loadScene('selectCheckpoint');
    },  

});
