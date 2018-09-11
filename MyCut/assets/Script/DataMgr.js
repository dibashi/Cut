const {
    ccclass,
    property
} = cc._decorator;
@ccclass
export default class DataMgr extends cc.Component {

    //当前玩家选择的关卡 游戏中的关卡
    currentCheckPoint = "-1";

    //根据tag设置颜色,还要根据tag来确定哪些可切，哪些不可切， 约定！！可切的tag<100 不可切的 100< tag <200
    //target tag = 102； 
    OBJECT_COLOR = {
        CUTTABLE_BLUE: 1,
        CUTTABLE_AREA_GREEN:2,
        NAN_SEPARABLE_BLACK: 101,
        NAN_TRIGGER_MASS:102,//用于检测掉落质量的触发器
    };

    //关卡信息，是碰撞 还是面积，以及达到多少  todo：将来还需加入 提示信息
    CHECKPOINT_DATAS = [
        {"class":"collision","targetCount":1,"optimalCount":1},
        {"class":"area","target":0.75}
    ];

    getRigidBodyColorByTag(tag) {
        if(tag == this.OBJECT_COLOR.CUTTABLE_BLUE) {
            return cc.color(110, 184, 255, 255);
        }else if(tag == this.OBJECT_COLOR.CUTTABLE_AREA_GREEN) {
            return cc.color(139, 209, 63, 255);
        } else if(tag == this.OBJECT_COLOR.NAN_SEPARABLE_BLACK) {
            return cc.color(40, 40, 40, 255);
        }
    };
    initData() {
        console.log("--- initData ---");
        //标记着当前玩到哪个关卡，意味着 之前的关卡未必都过关了，当前的关卡之后的关卡都没有玩，当前关卡可以玩
        let mc = cc.sys.localStorage.getItem("maxCheckpoint");
       // if (!mc) {
            cc.sys.localStorage.setItem("maxCheckpoint", 1);
            var checkPointJsonData = [];
            var j = {};
            checkPointJsonData.push({crownCount:"0"});
            for (var i = 1; i < 4; i++) {
                j.crownCount = "0";
                
                checkPointJsonData.push(j);
            }
            var a = JSON.stringify(checkPointJsonData);
            //console.log(a);
            cc.sys.localStorage.setItem("checkPointJsonData",a);
       // }
    };


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