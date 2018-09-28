import DataMgr from 'DataMgr';

import AudioMgr from 'AudioMgr';

cc.Class({
    extends: cc.Component,

    properties: {
        crownLabel: cc.Label,
        progressLabel: cc.Label,
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

    goCheckpoint: function (event, eventData) {


        //  console.log(eventData);
        cc.dataMgr.currentCheckPoint = parseInt(eventData);
        cc.director.loadScene('gameScene');
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

        this.refreshCheckPoint();


        this.rankingView.active = false;
        this.initSubCanvas();

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

    //分享给好友
    shareFriend() {
        if (CC_WECHATGAME) {
            let type = "end";
            if (cc.dataMgr.userData.countJump <= 0)
                type = "random";
            window.wx.shareAppMessage({
                title: cc.dataMgr.getShareDesc_s(type),
                imageUrl: cc.dataMgr.imageUrl.relive,
                query: "otherID=" + cc.dataMgr.openid,
                success: (res) => {
                    cc.dataMgr.shareSuccess("end");
                    cc.director.loadScene("game");
                }
            });
        } else {
            //console.log("-- Not is wechatGame --");
            cc.dataMgr.shareSuccess("end");
        }
    },

    refreshCheckPoint: function () {

        // //从1计数 第一关是1
        // let dangQianGuanKa = parseInt(cc.sys.localStorage.getItem("dangQianGuanKa"));
        // //console.log("pre dangQianGuanKa " +dangQianGuanKa);
        // if(dangQianGuanKa == null || typeof(dangQianGuanKa) == undefined || isNaN(dangQianGuanKa)) {
        //     dangQianGuanKa = 1;
        // }
        // //console.log("dangQianGuanKa  " +dangQianGuanKa);
        // let cps = this.checkPoints.children;
        // for (let i = 0; i < cps.length; i++) {
        //     //console.log(cps[i].name);
        //     if (i < (dangQianGuanKa - 1)) {
        //         cps[i].opacity = 255;
        //         cps[i].getComponent(cc.Button).interactable = true;
        //         cps[i].getChildByName("tubiao_wancheng").active = true;
        //     } else if (i == (dangQianGuanKa - 1)) {
        //         cps[i].opacity = 255;
        //         cps[i].getComponent(cc.Button).interactable = true;
        //         cps[i].getChildByName("tubiao_wancheng").active = false;
        //     } else if (i > (dangQianGuanKa - 1)) {
        //         cps[i].opacity = 70;
        //         cps[i].getComponent(cc.Button).interactable = false;
        //         cps[i].getChildByName("tubiao_wancheng").active = false;
        //     }
        // }

        let maxCheckpoint = parseInt(cc.sys.localStorage.getItem("maxCheckpoint"));
        console.log(maxCheckpoint);
        let jsons = cc.sys.localStorage.getItem("checkPointJsonData");
        //console.log(jsons);
        let jsonObj = JSON.parse(jsons);
        //console.log(jsonObj);
        let checkPoints = this.checkPoints.children;

      // this.label_crownCount = 0;
        this.label_progressCount = 0;
       
        for (let i = 0; i < checkPoints.length; i++) {
            
            let crownCount = parseInt(jsonObj[i].crownCount);
            //显示皇冠数量
            this.showCrown(checkPoints[i], crownCount);
            //底层图片是否碎裂
            this.showPanel(checkPoints[i], crownCount);
            //是否枷锁 //是否可玩
            this.showLock(checkPoints[i], i, maxCheckpoint);

           // this.label_crownCount += crownCount;
            if (crownCount > 0) {
                this.label_progressCount += 1;
            }
        }

  this.label_crownCount = cc.dataMgr.currentScore();
        //皇冠总数显示
        this.crownLabel.string = "X" + this.label_crownCount;
        //完成关卡进度显示
        this.progressLabel.string = this.label_progressCount + "/" + checkPoints.length;
        //向服务器上传得分
        this.submitScore();
    },


    //上传皇冠总数
    submitScore: function () {

        if (CC_WECHATGAME) {
            window.wx.postMessage({
                messageType: 2,
                MAIN_MENU_NUM: "score",
                myScore: this.label_crownCount
            });
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

    showLock: function (checkPointNode, index, maxCheckpoint) {
        if (index >= maxCheckpoint) {
            checkPointNode.getComponent(cc.Button).interactable = false;
            checkPointNode.getChildByName("lock").active = true;
        } else {
            checkPointNode.getComponent(cc.Button).interactable = true;
            checkPointNode.getChildByName("lock").active = false;
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

        wx.shareAppMessage({
            title: str_title,
            imageUrl: str_imageUrl
        });
    },


});
