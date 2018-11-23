import DataMgr from 'DataMgr';

import AudioMgr from 'AudioMgr';

cc.Class({
    extends: cc.Component,

    properties: {
        crownLabel: cc.Label,
        progressLabel: cc.Label,
        coinLabel: cc.Label,

        inviteAlert: cc.Prefab,
        limitAlert: cc.Prefab,

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

        shareNode: {
            default: null,
            type: cc.Node,
        },

        rankItem: {
            default: null,
            type: cc.Prefab,
        },
        scrollViewContent: {
            default: null,
            type: cc.Node,
        }


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

        if (cc.audioMgr.isPlay()) {
            this.musicSprite.spriteFrame = this.onMusicSpriteFrame;
            cc.audioMgr.playBgm();
        } else {
            this.musicSprite.spriteFrame = this.offMusicSpriteFrame;
            cc.audioMgr.stopBgm();
        }

        this.coinLabel.string = "x" + cc.dataMgr.getCoinCount();

        this.crownLabel.string = "x" + cc.dataMgr.currentScore();



        this.rankingView.active = false;
        this.initSubCanvas();
        cc.dataMgr.submitScore();



        if (CC_WECHATGAME) {
            let obj = wx.getLaunchOptionsSync();
            console.log(obj);
            if (obj && obj.shareTicket) {
                cc.dataMgr.shareTicket = obj.shareTicket;
                this.showGroup();
            } else if (obj && obj.query) {
                //如果有关卡信息，直接跳转
                if (obj.query.checkpoint) {
                    console.log("如果有关卡信息，直接跳转" + obj.query.checkpoint);
                    cc.dataMgr.currentCheckPoint = parseInt(obj.query.checkpoint);
                    //置为null 防止回不来的情况 不然会无限调用
                    obj.query.checkpoint = null;
                    cc.director.loadScene('gameScene');
                }
                //没有关卡信息 但是有otherID，视为邀请成功，给他金币
                else if (obj.query.otherID) {
                    console.log("没有关卡信息 但是有otherID，视为邀请成功，给他金币");
                }

            }

            // wx.onShow(function(res) {
            //     console.log("从后台到前台的回调函数！~");
            //     if(res.query.checkpoint) {
            //         console.log("如果有关卡信息，直接跳转" + obj.query.checkpoint);
            //         cc.dataMgr.currentCheckPoint = parseInt(obj.query.checkpoint);
            //         cc.director.loadScene('gameScene');
            //     }
            // });


        }


    },

    initSubCanvas() {
        if (!this.tex)
            this.tex = new cc.Texture2D();
        if (CC_WECHATGAME) {
            window.sharedCanvas.width = 720;
            window.sharedCanvas.height = 1280;
        }
    },


    start() {
        let self = this;
        if (CC_WECHATGAME) {
            wx.showShareMenu();
            wx.onShareAppMessage(function () {
                // 用户点击了“转发”按钮
                return {
                    title: cc.dataMgr.getShareTitle(),
                    imageUrl: cc.dataMgr.getShareImgeUri(),

                }
            });
        }

        if (CC_WECHATGAME) {
            wx.request({
                url: 'https://bpw.blyule.com/cutRes/cutSetting1.json',

                success: (obj, statusCode, header) => {
                    console.log("是否显示分享的数据");
                    console.log(obj);
                    console.log(obj.data);
                    if (obj.data.showShare) {
                        console.log("显示分享");
                        cc.dataMgr.isShowShare = true;
                        self.shareNode.active = true;

                    } else {
                        console.log("不显示分享");
                        cc.dataMgr.isShowShare = false;
                        self.shareNode.active = false;
                    }

                    // if (obj.data.showMoreGame) {
                    //     console.log("显示更多游戏");

                    //     self.moreGameNode.active = true;
                    // }
                }
            });


        }

       // openLog(true, true);
    },



    onShareClick: function () {
        cc.audioMgr.playBtn();

        if (CC_WECHATGAME) {
            wx.shareAppMessage({
                title: cc.dataMgr.getShareTitle(),
                imageUrl: cc.dataMgr.getShareImgeUri()
            });
        } else if (CC_QQPLAY) {
            shareQQ("hongbao");
        }


    },




    // called every frame
    update: function (dt) {

    },



    musicClick: function () {
        cc.audioMgr.playBtn();
        if (cc.audioMgr.isPlay()) {
            cc.audioMgr.stopAll();
            this.musicSprite.spriteFrame = this.offMusicSpriteFrame;
        } else {
            cc.audioMgr.openAll();
            this.musicSprite.spriteFrame = this.onMusicSpriteFrame;
        }
    },

    onLeaderboardClick: function () {

        this.showFriend();

    },

    showFriend: function () {
        let self = this;
        cc.audioMgr.playBtn();
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
        } else {
            // 当前不支持一次同时拉取多个排行榜，需要拉取多次，而且必须等上一个拉取回来后才能拉取另外一个排行榜
            // 先拉 score 排行榜
            var attr = "score";//使用哪一种上报数据做排行，可传入score，a1，a2等
            var order = 1;     //排序的方法：[ 1: 从大到小(单局)，2: 从小到大(单局)，3: 由大到小(累积)]
            var rankType = 0; //要查询的排行榜类型，0: 好友排行榜
            // 必须配置好周期规则后，才能使用数据上报和排行榜功能
            BK.QQ.getRankListWithoutRoom(attr, order, rankType, function (errCode, cmd, data) {
                console.log(1, 1, "getRankListWithoutRoom callback  cmd" + cmd + " errCode:" + errCode + "  data:" + JSON.stringify(data));
                // 返回错误码信息
                if (errCode !== 0) {
                    console.log(1, 1, '获取排行榜数据失败!错误码：' + errCode);
                    return;
                }
                // 解析数据
                if (data) {
                    self.scrollViewContent.removeAllChildren();
                    var dataLen = data.data.ranking_list.length;
                    // for (let j = 0; j < dataLen; ++j) {
                    //     let nodeN = cc.instantiate(self.rankItem)
                    //     self.scrollViewContent.addChild(nodeN);
                    // }
                    console.log(data);
                    for (var i = 0; i < dataLen; ++i) {

                        let nodeN = cc.instantiate(self.rankItem);
                        self.scrollViewContent.addChild(nodeN);

                        nodeN.active = true;
                        nodeN.getComponent('RankItem').init(i, data.data.ranking_list[i]);
                        // if (data[i].avatarUrl == userData.avatarUrl) {
                        //     self.node_myself.active = true;
                        //     self.node_myself.getComponent('RankItem').init(i, data[i]);
                        // }

                        // var rd = data.data.ranking_list[i];
                        // rd 的字段如下:
                        //var rd = {
                        //    url: '',            // 头像的 url
                        //    nick: '',           // 昵称
                        //    score: 1,           // 分数
                        //    selfFlag: false,    // 是否是自己
                        //};


                    }
                }

                // 再拉 a1 的排行榜
                // BK.QQ.getRankListWithoutRoom('a1', 1, rankType, function (errCode, cmd, data) {
                //     console.log("下面是a1数据");
                //     console.log(data);
                // });


            });

            this.rankingView.active = true;
            this.rankingView.getChildByName("spr_friend").active = true;
            this.rankingView.getChildByName("spr_qun").active = false;
            this.rankingView.getChildByName("node_myMask").active = false;
            this.rankingView.getChildByName("node_mask1").active = false;
            this.rankingView.getChildByName("node_mask2").active = false;



        }
    },

    groupClick: function () {
        let self = this;
        cc.audioMgr.playBtn();
        if (CC_WECHATGAME) {
            window.wx.updateShareMenu({
                withShareTicket: true,
                success() {
                    window.wx.shareAppMessage({
                        title: cc.dataMgr.getShareTitle(),
                        imageUrl: cc.dataMgr.getShareImgeUri(),
                        success: (res) => {
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
        cc.audioMgr.playBtn();
        this.rankingView.active = false;
    },


    inviteClick: function () {
        cc.audioMgr.playBtn();
        let ss = cc.instantiate(this.inviteAlert);
        ss.zIndex = 1000;
        ss.getComponent("inviteAlert").onWho = this.node;
        this.node.addChild(ss);

    },

    refreshCoin: function () {
        this.coinLabel.string = "x" + cc.dataMgr.getCoinCount();
    },

    goGame: function () {

        cc.audioMgr.playBtn();
        let isCanPlay = cc.dataMgr.isCanPlay();
        if (isCanPlay) {
            cc.audioMgr.stopBgm();
            cc.dataMgr.currentCheckPoint = cc.dataMgr.getRandomCheckpoint();
            cc.director.loadScene('gameScene');
        } else {
            //弹窗
            let ss = cc.instantiate(this.limitAlert);
            ss.zIndex = 1001;
            ss.getComponent("limitAlert").onWho = this.node;
            this.node.addChild(ss);
        }
    },
    goSelectCheckpoint: function () {
        cc.audioMgr.stopBgm();
        cc.audioMgr.playBtn();

        cc.director.loadScene('selectCheckpoint');
    },

});
