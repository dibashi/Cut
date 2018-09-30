const {
    ccclass,
    property
} = cc._decorator;
@ccclass
export default class DataMgr extends cc.Component {

    //第三方sdk 用到的东西 这里的广告位还没给！！
    adUserInfo = {
        placeid: "1006",
        appid: "wx0ec0bb47f5b89ac1",
        appwxuserid: 3,
        appwxusername: 'aaa'
    };

    adInfo = null;

    //当前玩家选择的关卡 游戏中的关卡
    currentCheckPoint = -1;
    //一共关卡数
    MAX_CHECKPOINT_COUNT = 52;

    //根据tag设置颜色,还要根据tag来确定哪些可切，哪些不可切， 约定！！可切的tag<100 不可切的 100< tag <200
    //target tag = 102； 
    OBJECT_COLOR = {
        CUTTABLE_BLUE: 1,
        CUTTABLE_AREA_GREEN: 2,
        NAN_SEPARABLE_BLACK: 101,
        NAN_TRIGGER_MASS: 102,//用于检测掉落质量的触发器 

        JOINT: 201,
        INDIRECT_Col: 301,
    };

    //关卡信息，是碰撞 还是面积，以及达到多少  todo：将来还需加入 提示信息
    CHECKPOINT_DATAS = [
        { "class": "collision", "targetCount": 1, "optimalCount": 1 },
        { "class": "area", "target": 0.75 }
    ];

    getRigidBodyColorByTag(tag) {
        if (tag == this.OBJECT_COLOR.CUTTABLE_BLUE) {
            return cc.color(110, 184, 255, 255);
        } else if (tag == this.OBJECT_COLOR.CUTTABLE_AREA_GREEN) {
            return cc.color(139, 209, 63, 255);
        } else if (tag == this.OBJECT_COLOR.NAN_SEPARABLE_BLACK) {
            return cc.color(40, 40, 40, 255);
        }else if (tag == this.OBJECT_COLOR.INDIRECT_Col) {
            return cc.color(255, 221, 32, 255);
        }
    };
    initData() {
        console.log("--- initData ---");
        //标记着当前玩到哪个关卡，意味着 之前的关卡未必都过关了，当前的关卡之后的关卡都没有玩，当前关卡可以玩
        //let mc = cc.sys.localStorage.getItem("maxCheckpoint");//和最上面的变量不一样
        let cj = cc.sys.localStorage.getItem("checkPointJsonData");
        if (!cj) {
            //cc.sys.localStorage.setItem("maxCheckpoint", 52);
            var checkPointJsonData = [];
            var j = {};
            //checkPointJsonData.push({crownCount:"0"});
            for (var i = 0; i < this.MAX_CHECKPOINT_COUNT; i++) {
                j.crownCount = "0";

                checkPointJsonData.push(j);
            }
            var a = JSON.stringify(checkPointJsonData);
            //   console.log(a);
            cc.sys.localStorage.setItem("checkPointJsonData", a);
        }

        let coinCount = cc.sys.localStorage.getItem("coinCount");
        if (!coinCount) {
            cc.sys.localStorage.setItem("coinCount", 0);
        }



        if (CC_WECHATGAME) {
            let rc = cc.sys.localStorage.getItem("recommendedCurrency");
            if (!rc) {
                cc.sys.localStorage.setItem("recommendedCurrency", 0);
            }

           

            let openid = cc.sys.localStorage.getItem("openid");
            if (!openid) {
                cc.sys.localStorage.setItem("openid", "0");
                this.getUerOpenID();
            }



            //版本比较 是否重置数据
            // this.nickName = cc.sys.localStorage.getItem("nickName");
            // if (!this.nickName)
            //     this.nickName = "***";

            console.log("--- DataMgr 获取启动参数 并对参数进行存储 ---");
            let obj = wx.getLaunchOptionsSync();
            console.log(obj);
            let query = obj.query;
            console.log("--- 重要信息 游戏 query --" + query);
            if (!query)
                this.query = query;
            // if (obj.referrerInfo && obj.referrerInfo.appId)
            //     this.scoreAppId = obj.referrerInfo.appId;

            let ic = cc.sys.localStorage.getItem("inviteCountObj");
           
            if (!ic) {

                this._setInviteCount(0);
                cc.sys.localStorage.setItem("isReceiveGift",0);//初始化 没有领取礼物
            }
        }
      
      

    };

    _setInviteCount(count) {
        var icObj = { "inviteCount": count, "currentDay": this.getCurrentDay() };
        var icObjStr = JSON.stringify(icObj);
        cc.sys.localStorage.setItem("inviteCountObj", icObjStr);
    };

    //外部只需要将当前的邀请数 传入，会返回一个当前进度，即今天邀请的玩家数 以及之前邀请多少 ，方便调用者计算奖励金币
    addInviteCount(count) {
        var cd = this.getCurrentDay();
        let ic = cc.sys.localStorage.getItem("inviteCountObj");
        let preObj = JSON.parse(ic);
        var curCount = count;
        var preCount = 0;
        if (preObj.currentDay != cd) {
            preCount = 0;
            this._setInviteCount(curCount);
            cc.sys.localStorage.setItem("isReceiveGift",0);
        } else {
            preCount = parseInt(preObj.inviteCount);
            curCount = count + preCount;
            this._setInviteCount(curCount);
        }

        return {"preCount":preCount,"curCount":curCount};
    };

    getCurrentDay() {
        var date = new Date();
        var r =  date.getFullYear() +"" + date.getMonth() + date.getDate();
        console.log("getCurrentDay 当前天：" + r);
        return r;
    };

    getRandomCheckpoint() {
        let jsons = cc.sys.localStorage.getItem("checkPointJsonData");
        let jsonObj = JSON.parse(jsons);
        // console.log(jsonObj);
        if (parseInt(jsonObj[0].crownCount) == 0) {
            return 1;//如果第一关没有皇冠，则随机第一关
        }

        //放置的是 皇冠少于3个的关卡索引
        var waitingForChoice = [];
        for (let i = 0; i < this.MAX_CHECKPOINT_COUNT; i++) {
            let crownCount = parseInt(jsonObj[i].crownCount);
            if (crownCount < 3) {
                waitingForChoice.push(i);
            }
        }
        if (waitingForChoice.length > 0) {
            let ri = Math.floor(Math.random() * waitingForChoice.length);
            return waitingForChoice[ri] + 1; //那边计数 是从1 2 3 4.这边是 0,1,2，3
        } else {
            //全部通关！
            //return -1;
            return Math.floor(Math.random() * this.this.MAX_CHECKPOINT_COUNT)
        }



    };

    //直接全部遍历 以为以后不是顺序玩关卡了
    currentScore() {
        let jsons = cc.sys.localStorage.getItem("checkPointJsonData");
        let jsonObj = JSON.parse(jsons);

        var resultScore = 0;

        for (let i = 0; i < this.MAX_CHECKPOINT_COUNT; i++) {
            let crownCount = parseInt(jsonObj[i].crownCount);
            resultScore += crownCount;
        }

        return resultScore;
    };

    getCoinCount() {
        return parseInt(cc.sys.localStorage.getItem("coinCount"));
    };

    addCoinCount(coinCount) {

        cc.sys.localStorage.setItem("coinCount", this.getCoinCount() + coinCount);

        return this.getCoinCount();
    };


    submitScore() {
        let self = this;
        if (CC_WECHATGAME) {
            window.wx.postMessage({
                messageType: 2,
                MAIN_MENU_NUM: "score",
                myScore: self.currentScore()
            });
        }
    };



    getShareImgeUri(tag) {


        if (tag && tag == "game") {
            str_imageUrl = "https://bpw.blyule.com/cutRes/game_help.jpg";
        } else {
            str_imageUrl = "https://bpw.blyule.com/cutRes/share.jpg";
        }
        return str_imageUrl;
    };

    getShareTitle(tag) {

        if (tag && tag == "game") {
            str_title = "这题太难了，心态已崩！";
        } else {
            str_title = "你点一下我就能拿红包了，快帮我！";
        }

        return str_title;
    };

      //从服务器获得用户的推荐奖励
      refreshrecommended (callback,selector) {
          return callback.call(selector,3);
        let self = this;
        let openid = cc.sys.localStorage.getItem("openid");
        if (openid == "0") {
            callback.call(selector,0);
        }

        if (cc.myDebugMode) {
            wx.request({
                url: 'https://bpw.blyule.com/game_3/public/index.php/index/index/getprise?userid=' + openid,
                data: {
                    userid: openid,
                },
                success: (obj, statusCode, header) => {
                    console.log("成功获得服务器那边的用户奖励数据！！！！ 服务器返回的数据！！--> ");
                    console.log(obj);
                    if (obj.data.code > 0) {
                        callback.call(selector,obj.data.code);
                    } else {
                        callback.call(selector,0);
                    }
                },
            });
        }
    };



    getUerOpenID() {
        if (CC_WECHATGAME) {
            let self = this;
            self.openid = cc.sys.localStorage.getItem("openid");
            if (self.openid == "0") {//保证用户是第一次进游戏
                // console.log("发送wx.login请求!");
                wx.login({
                    success: (res) => {
                        let codeInfo = res.code;
                        console.log('datamgr，codeInfo：--->', codeInfo);
                        if (res.code) {
                            //发起网络请求
                            wx.request({
                                url: 'https://bpw.blyule.com/game_3/public/index.php/index/index/getopenid?code=' + res.code,
                                data: {
                                    code: res.code,
                                },
                                success: (obj, statusCode, header) => {
                                    console.log("请求openid,服务器返回的数据！！--> " + obj);
                                    console.log(obj);
                                    console.log(obj.data.openid);

                                    self.openid = obj.data.openid;
                                    cc.sys.localStorage.setItem("openid", obj.data.openid);//之所以要存，是在分享的时候放入query中
                                    //微信官方文档那里写的调用函数是getLaunchInfoSync，但是根本搜不到这个API，应该是下面这个。
                                    var launchOption = wx.getLaunchOptionsSync();
                                    //  console.log(launchOption);
                                    //  self.otherOpenIDLabel.string = JSON.stringify(launchOption.query) + "query.otherID-->" + launchOption.query.otherID;

                                    if (launchOption.query.otherID == null || launchOption.query.otherID == undefined) {
                                        launchOption.query.otherID = 0;
                                    }
                                    console.log("看下 自己的openid 和 推荐方的openid");
                                    console.log(self.openid);
                                    console.log(launchOption.query.otherID);
                                    wx.request({
                                        url: 'https://bpw.blyule.com/game_3/public/index.php/index/index/add?userid=' + self.openid + "&" + "cuid=" + launchOption.query.otherID,
                                        data: {
                                            userid: self.openid,
                                            cuid: launchOption.query.otherID,
                                        },
                                        success: (data, statusCode, header) => {
                                            console.log("添加用户成功！ 服务器返回的数据！！--> ");
                                            console.log(data);

                                            console.log("看下自己的openid数据！！--> ");
                                            console.log(self.openid);
                                        },
                                    });
                                    //调用 SDK 登陆成功
                                    // cc.dataMgr.adgivelog();
                                    // cc.dataMgr.adarrivelog();
                                    // cc.dataMgr.createUserInfoButton();
                                },
                            });
                        }
                    }
                });
            }
            else {
                // cc.dataMgr.adarrivelog();
                // cc.dataMgr.createUserInfoButton();
            }
        }
    };








    createAdInfo(createPos) {
        this.openid = cc.sys.localStorage.getItem("openid")
        console.log("-- createAdInfo --" + createPos);
        if (true) {
            console.log("-- 第三方sdk C check --");
            this.adUserInfo.appwxuserid = this.openid;
            this.adUserInfo.appwxusername = this.nickName;
            console.log(cc.dataMgr.adUserInfo);
            adSdk.creatAdInfo(this.adUserInfo, function (adInfo) {
                console.log("--- 第三方 back ---");
                console.log(adInfo);
                cc.dataMgr.adInfo = adInfo;
            });
        }
    }

    adJump() {
        if (!this.adInfo) {
            console.log(this.adInfo);
            //return;

            this.adInfo = {};
        }
        adSdk.adjump(this.adUserInfo, this.adInfo);
    }

    adshowlog() {
        console.log("-- adshowlog --");
        console.log(this.adInfo);
        if (this.adInfo)
            adSdk.adshowlog(this.adUserInfo, this.adInfo);
    }

    adarrivelog() {
        console.log("-- adarrivelog -- " + this.scoreAppId);
        console.log(this.query);
        if (this.query && this.query.adSdkTag)
            adSdk.adarrivelog(this.query, this.openid, this.scoreAppId);
    }

    adgivelog() {
        console.log("-- adgivelog -- " + this.scoreAppId);
        console.log(this.query);
        if (this.query && this.query.adSdkTag)
            adSdk.adgivelog(this.query, this.openid, this.nickName, this.scoreAppId);
    }

    //------ 账号奖励等相关 ------



    // //判断登陆请求是否过期

    //>_< 微信大大该接口了 getUserInfo 不能直接用了
    createUserInfoButton() {
        console.log("-- 微信昵称 --" + cc.dataMgr.nickName + " -- " + this.nickName);
        if (cc.dataMgr.nickName == "aaa" || cc.dataMgr.nickName == "***" || !cc.dataMgr.nickName || cc.dataMgr.nickName == "0") {
            console.log("-- 开始 userInfoButton --");
            if (CC_WECHATGAME) {
                let nodeN = cc.find("Canvas/node_userInfo");
                if (nodeN) {
                    nodeN.active = true;
                    nodeN.zIndex = 10000;
                }

                console.log("-- 开始创建 --");
                let button = wx.createUserInfoButton({
                    type: 'text',
                    text: '获取昵称信息',
                    style: {
                        left: 120,
                        top: 360,//微信和 这像素不一样。。。
                        width: 120,
                        height: 40,
                        lineHeight: 40,
                        backgroundColor: '#ffffff',
                        color: '#000000',
                        textAlign: 'center',
                        fontSize: 16,
                        borderRadius: 4
                    },
                    withCredentials: true
                });
                if (button) {
                    button.onTap((res) => {
                        console.log("-- 点击授权了 --");
                        console.log(res)

                        let nodeN = cc.find("Canvas/node_userInfo");
                        if (nodeN)
                            nodeN.active = false;
                        button.hide();

                        //微信群报错 故此修改
                        wx.getUserInfo({
                            success: function (res) {
                                console.log("-- 获取成功 userInfo --");
                                console.log(res)
                                if (res.userInfo) {
                                    cc.dataMgr.nickName = res.userInfo.nickName;
                                    cc.sys.localStorage.setItem("nickName", cc.dataMgr.nickName);
                                }
                                cc.dataMgr.createAdInfo("button");
                            },
                            fail: function (res) {
                                console.log("--- 获取用户信息失败 ---");
                                console.log(res);
                            }
                        });
                    });
                }
            }
        }
        else
            cc.dataMgr.createAdInfo("getUerOpenID");
    }
}