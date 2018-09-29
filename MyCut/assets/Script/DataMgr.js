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
        if (CC_WECHATGAME) {
            let rc = cc.sys.localStorage.getItem("recommendedCurrency");
            if (!rc) {
                cc.sys.localStorage.setItem("recommendedCurrency", 0);
            }

            let coinCount = cc.sys.localStorage.getItem("coinCount");
            if (!coinCount) {
                cc.sys.localStorage.setItem("coinCount", 0);
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
        }

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



    getShareImgeUri() {
        var str_imageUrl = null;
        var str_index = Math.floor(Math.random() * 2);
        if (str_index == 0) {
            str_imageUrl = "https://bpw.blyule.com/res/raw-assets/Texture/shareImage0.5f075.jpg";
        } else {
            str_imageUrl = "https://bpw.blyule.com/res/raw-assets/Texture/shareImage1.678a4.jpg";
        }
        return str_imageUrl;
    };

    getShareTitle() {
        var str_title = null;
        var str_index = Math.floor(Math.random() * 2);

        if (str_index == 0) {
            str_title = "走开，别碰我！萌哭了";
        } else {
            str_title = "萌翻全场，好想都抱回家!";
        }

        return str_title;
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





    // getRigidBodyColorByTag(tag) {

    // };

    // GlobalFun: [function (t, e, a) {
    //     "use strict";
    //     cc._RF.push(e, "76ab8RpFGlGcLg0xtMlBIOt", "GlobalFun"),
    //     Object.defineProperty(a, "__esModule", {
    //         value: !0
    //     });
    //     var o = t("../enum/GameEnum"),
    //         n = function () {
    //             function t() {}
    //             return t.getRigidBodyColorByTag = function (t) {
    //                 return t == o.colliderTag.cut || t == o.colliderTag.neglectBlue ? cc.color(110, 184, 255, 255) : t == o.colliderTag.neglect ? cc.color(40, 40, 40, 255) : t == o.colliderTag.star ? cc.color(110, 184, 255, 255) : t == o.colliderTag.jointPoint ? cc.color(255, 255, 255, 255) : t == o.colliderTag.neglectYellow || t == o.colliderTag.cutYellow ? cc.color(255, 214, 94, 255) : t == o.colliderTag.neglectblack ? cc.color(0, 0, 0, 255) : t == o.colliderTag.cuttGreen ? cc.color(186, 255, 203, 255) : t == o.colliderTag.nelectRed || t == o.colliderTag.cutRed ? cc.color(255, 107, 107, 255) : cc.color(110, 184, 255, 255)
    //             },
    //             t.getAngle = function (t, e) {
    //                 var a = e.x - t.x,
    //                     o = (t.y - e.y) / a,
    //                     n = 180 / 3.1415926 * Math.atan(o);
    //                 return e.x < t.x && (n -= 180),
    //                 n
    //             },
    //             t.getDistance = function (t, e) {
    //                 return Math.sqrt(Math.pow(t.x - e.x, 2) + Math.pow(t.y - e.y, 2))
    //             },
    //             t
    //         }();
    //     a.GlobalFun = n,
    //     cc._RF.pop()
    // },


    // GameEnum: [function (t, e, a) {
    //     "use strict";
    //     var o, n, i, r;
    //     cc._RF.push(e, "7b2c9A73OZGtLH3MpPoiR63", "GameEnum"),
    //     Object.defineProperty(a, "__esModule", {
    //         value: !0
    //     }),
    //     (o = a.oldObjectRules || (a.oldObjectRules = {}))[o.maxY = 1] = "maxY",
    //     o[o.miniY = 2] = "miniY",
    //     o[o.angleNum = 3] = "angleNum",
    //     (n = a.colliderTag || (a.colliderTag = {}))[n.AntiGravity = 100] = "AntiGravity",
    //     n[n.cutYellow = 10] = "cutYellow",
    //     n[n.neglectYellow = 500] = "neglectYellow",
    //     n[n.nelectRed = 530] = "nelectRed",
    //     n[n.cuttGreen = 1] = "cuttGreen",
    //     n[n.cutRed = 2] = "cutRed",
    //     n[n.cut = 0] = "cut",
    //     n[n.starGreen = 101] = "starGreen",
    //     n[n.yellowStar = 501] = "yellowStar",
    //     n[n.starRed = 531] = "starRed",
    //     n[n.star = 8] = "star",
    //     n[n.jointPoint = 1e3] = "jointPoint",
    //     n[n.neglect = 200] = "neglect",
    //     n[n.botton = 1e4] = "botton",
    //     n[n.moveStar = 9] = "moveStar",
    //     n[n.neglectblack = 510] = "neglectblack",
    //     n[n.blackstar = 511] = "blackstar",
    //     n[n.neglectBlue = 520] = "neglectBlue",
    //     (i = a.passConditionType || (a.passConditionType = {}))[i.star = 1] = "star",
    //     i[i.dropOut = 2] = "dropOut",
    //     (r = a.btnTag || (a.btnTag = {})).demo = "0",
    //     r.skip = "1",
    //     r.reStart = "2",
    //     r.back = "3",
    //     r.next = "4",
    //     r.play = "5",
    //     r.seting = "6",
    //     cc._RF.pop()
    // },


    //玩家最高的关卡 此关卡不过的话 后续的关卡 都不可点击，前面的关卡或许有的没有完成，因为有跳跃关卡的道具


    // //内存池大小
    // largeBoxPoolSize=20; //大型砖块 
    // middleBoxPoolSize = 20; //中型砖块
    // smallBoxPoolSize = 100; //小型砖块

    // //牙的内存池大小
    // toothPoolSize = 20;

    // //生成砖块的间隔
    // intervalGenerateTile = 1;

    // //轮盘上牙的数量
    // toothCount = 3;

    // //轮盘转速，tooth转速
    // rouletteSpeed = 90;



    // //场景资源的图片 名称
    // gameBgName = ["cj01", "cj02", "cj03", "cj04", "cj05"];

    // bgFrame = {};

    // //砖块的图片 名称(顺序和出场顺序是一致的)
    // boxName = ["zz01", "zz02", "zz03", "zz04", "zz05"];

    // playerData = [{
    //         name: "plaeyr1",
    //         price: 100
    //     },
    //     {
    //         name: "plaeyr2",
    //         price: 200
    //     },
    //     {
    //         name: "plaeyr3",
    //         price: 300
    //     },
    //     {
    //         name: "plaeyr4",
    //         price: 400
    //     },
    //     {
    //         name: "plaeyr5",
    //         price: 500
    //     }
    // ];

    // initData() {
    //     console.log("--- initData ---");
    //     let score = cc.sys.localStorage.getItem("bestScore");
    //     if (!score)
    //         cc.sys.localStorage.setItem("bestScore", 0);
    //     else
    //         this.userData.bestScore = score;

    //     let propNum = cc.sys.localStorage.getItem("propGreenNum");
    //     if (!propNum)
    //         cc.sys.localStorage.setItem("propGreenNum", 0);
    //     else
    //         this.userData.propGreenNum = parseInt(propNum);

    //     let addHpMax = cc.sys.localStorage.getItem("addHpMax");
    //     if (!addHpMax)
    //         cc.sys.localStorage.setItem("addHpMax", 5);
    //     else
    //         this.userData.addHpMax = parseInt(addHpMax);

    //     let reliveNum = cc.sys.localStorage.getItem("reliveNum");
    //     if (!reliveNum)
    //         cc.sys.localStorage.setItem("reliveNum", 0);
    //     else
    //         this.userData.reliveNum = parseInt(reliveNum);

    //     let reliveTime = cc.sys.localStorage.getItem("reliveTime")
    //     if (!reliveTime) {
    //         cc.sys.localStorage.setItem("reliveTime", parseInt(Date.now() / 1000));
    //         cc.sys.localStorage.setItem("reliveNum", this.userData.addHpMax);
    //         this.userData.reliveNum = this.userData.addHpMax;
    //     } else {
    //         reliveTime = parseInt(reliveTime);
    //         let timeNow = parseInt(Date.now() / 1000);
    //         let num = parseInt((timeNow - reliveTime) / 1800);
    //         if (num > 0) {
    //             if (num + this.userData.reliveNum > this.userData.addHpMax) {
    //                 this.userData.reliveNum = this.userData.addHpMax;
    //                 cc.sys.localStorage.setItem("reliveTime", parseInt(Date.now() / 1000));
    //             } else {
    //                 this.userData.reliveNum += (num);
    //                 cc.sys.localStorage.setItem("reliveTime", reliveTime + num * 1800);
    //             }
    //             cc.sys.localStorage.setItem("reliveNum", this.userData.reliveNum);
    //         }
    //     }

    //     console.log(this.userData);

    //     //加载图片资源
    //     cc.loader.loadRes("cj01", cc.SpriteFrame, function (err, frame) {
    //         if (!err)
    //             cc.dataMgr.bgFrame["cj01"] = frame;
    //     });
    //     cc.loader.loadRes("cj02", cc.SpriteFrame, function (err, frame) {
    //         if (!err)
    //             cc.dataMgr.bgFrame["cj02"] = frame;
    //     });
    //     cc.loader.loadRes("cj03", cc.SpriteFrame, function (err, frame) {
    //         if (!err)
    //             cc.dataMgr.bgFrame["cj03"] = frame;
    //     });
    //     cc.loader.loadRes("cj04", cc.SpriteFrame, function (err, frame) {
    //         if (!err)
    //             cc.dataMgr.bgFrame["cj04"] = frame;
    //     });
    //     cc.loader.loadRes("cj05", cc.SpriteFrame, function (err, frame) {
    //         if (!err)
    //             cc.dataMgr.bgFrame["cj05"] = frame;
    //     });

    //     this.getUerOpenID();
    // }

    // //重大改变之前 如扣钱口金币等 要保存数据 
    // saveData() {
    //     cc.sys.localStorage.setItem("propGreenNum", this.userData.propGreenNum);
    //     cc.sys.localStorage.setItem("addHpMax", this.userData.addHpMax);
    //     cc.sys.localStorage.setItem("reliveNum", this.userData.reliveNum);
    // }

    // //比较储存历史最高纪录
    // getBestScore_i(nowScore) {
    //     if (nowScore > parseInt(this.userData.bestScore)) {
    //         this.userData.bestScore = nowScore;
    //         cc.sys.localStorage.setItem("bestScore", nowScore);
    //     }
    //     return this.userData.bestScore;
    // }

    // getBgFrame_sf(name) {
    //     if (!name)
    //         name = cc.dataMgr.gameBgName[cc.dataMgr.userData.gameBgIdx];
    //     return this.bgFrame[name];
    // }

    // getUerOpenID() {
    //     if (CC_WECHATGAME) {

    //         let openid = cc.sys.localStorage.getItem("openid");
    //         if (!openid) { //保证用户是第一次进游戏
    //             // console.log("发送wx.login请求!");
    //             wx.login({
    //                 success: (res) => {
    //                     let codeInfo = res.code;
    //                     console.log("-- wx.login --" + codeInfo);
    //                     console.log(res);
    //                     if (true)
    //                         return;
    //                     if (res.code) {
    //                         //发起网络请求
    //                         wx.request({
    //                             url: 'https://bpw.blyule.com/public/index.php/index/index/getopenid?code=' + res.code,
    //                             data: {
    //                                 code: res.code,
    //                             },
    //                             success: (obj, statusCode, header) => {
    //                                 // console.log("请求openid,服务器返回的数据！！--> " + obj);
    //                                 // console.log(obj.data.openid);

    //                                 self.openid = obj.data.openid;
    //                                 cc.sys.localStorage.setItem("openid", obj.data.openid); //之所以要存，是在分享的时候放入query中
    //                                 //微信官方文档那里写的调用函数是getLaunchInfoSync，但是根本搜不到这个API，应该是下面这个。
    //                                 var launchOption = wx.getLaunchOptionsSync();
    //                                 //  console.log(launchOption);
    //                                 //  self.otherOpenIDLabel.string = JSON.stringify(launchOption.query) + "query.otherID-->" + launchOption.query.otherID;

    //                                 if (launchOption.query.otherID == null || launchOption.query.otherID == undefined) {
    //                                     launchOption.query.otherID = 0;
    //                                 }
    //                                 // console.log("看下 自己的openid 和 推荐方的openid");
    //                                 // console.log(self.openid);
    //                                 // console.log(launchOption.query.otherID);
    //                                 wx.request({
    //                                     url: 'https://bpw.blyule.com/public/index.php/index/index/add?userid=' + self.openid + "&" + "cuid=" + launchOption.query.otherID,
    //                                     data: {
    //                                         userid: self.openid,
    //                                         cuid: launchOption.query.otherID,
    //                                     },
    //                                     success: (data, statusCode, header) => {
    //                                         //  console.log("添加用户成功！ 服务器返回的数据！！--> ");
    //                                         //  console.log(data);

    //                                         //  console.log("看下自己的openid数据！！--> ");
    //                                         //  console.log(self.openid);
    //                                     },
    //                                 });


    //                             },
    //                         });
    //                     }
    //                 }
    //             });
    //         }
    //     }
    // }

    // //这是分享成功给玩家的奖励 回满reliveNum 和 下局双倍
    // shareSuccess(){
    //     this.userData.reliveNum = this.userData.addHpMax;
    //     this.userData.shareDouble = 2;
    // }
}