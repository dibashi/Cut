const {
    ccclass,
    property
} = cc._decorator;
@ccclass
export default class GameRankingList extends cc.Component {
    @property(cc.Prefab)
    pre_rankItem = null;
    @property(cc.Prefab)
    pre_overRank = null;

    //列表相关
    @property(cc.Node)
    node_list = null;
    @property(cc.Node)
    scrollViewContent = null;
    @property(cc.Node) //列表中自己的数据
    node_myself = null;

    //结束界面
    @property(cc.Node)
    node_over = null;
    @property(cc.Node)
    node_overRank = null;

    //超越好友
    @property(cc.Node)
    node_beyond = null;
    @property(cc.Node)
    headImageNode = null;
    @property(cc.Label)
    nameLabel = null;
    @property(cc.Label)
    scoreLabel = null;

    @property(cc.Node)
    loadingLabel = null; //加载文字

    waitingForBeyondFriends = null;

    onLoad() {
        console.log("---微信子域 onLoad ---");
        this.node_list.active = false;
        this.node_over.active = false;
        this.node_beyond.active = false;
        this.loadingLabel.active = false;

        // console.log("-- 子域数据传输 --");
        // cc.sys.localStorage.setItem("wxSub", " 互通有无 success ");

        // let wxsubStr = cc.sys.localStorage.getItem("wxSub");
        // console.log(wxsubStr);
    }

    start() {
        console.log("--- start ---");

        window.wx.onMessage(data => {
            console.log("-- 接收主域发来消息：--");
            console.log(data);
            if (data.messageType == 0) { //移除排行榜
                this.showPanel(null);
            } else if (data.messageType == 1) { //获取好友排行榜
                this.showPanel("friend");
                this.fetchFriendData(data.MAIN_MENU_NUM);
            } else if (data.messageType == 2) { //提交得分
                this.submitScore(data.MAIN_MENU_NUM, data.myScore, false);
            } else if (data.messageType == 3) { //获取好友排行榜横向排列展示模式
                this.showPanel("end");
                this.submitScore(data.MAIN_MENU_NUM, data.myScore, true);
                //this.gameOverRank(data.MAIN_MENU_NUM);
            } else if (data.messageType == 5) { //获取群排行榜
                this.showPanel("group");
                this.fetchGroupData(data.MAIN_MENU_NUM, data.shareTicket);
            } else if (data.messageType == 6) { //用于游戏内的超越功能的数据源获取
                this.showPanel(null);
                this.fetchFriendDataToBeyond(data.MAIN_MENU_NUM);
            } else if (data.messageType == 7) { //用于查询给的分数是否超过当前数据源中的分数，超过谁就显示谁，然后删除掉
                this.isBeyond(data.myScore);
            } else if (data.messageType == 8) { //显示下个即将超越的好友
                this.showPanel("beyond");
                this.nextBeyond(data.myScore);
            }
        });

    }

    showPanel(panelName) {
        console.log("-- 子域 showPanel --" + panelName);
        if (panelName == "end") {
            this.node_list.active = false;
            this.node_over.active = true;
            this.node_beyond.active = false;
            this.loadingLabel.active = true;

            this.node_overRank.active = false;
        } else if (panelName == "friend") {
            this.node_list.active = true;
            this.node_myself.active = false;
            this.node_over.active = false;
            this.node_beyond.active = false;
            this.loadingLabel.active = true;

            this.scrollViewContent.active = false;
        } else if (panelName == "group") {
            this.node_list.active = true;
            this.node_myself.active = false;
            this.node_over.active = false;
            this.node_beyond.active = false;
            this.loadingLabel.active = true;

            this.scrollViewContent.active = false;
        } else if (panelName == "beyond") {
            this.node_list.active = false;
            this.node_over.active = false;
            this.node_beyond.active = true;
            this.loadingLabel.active = false;
        } else {
            this.node_list.active = false;
            this.node_over.active = false;
            this.node_beyond.active = false;
            this.loadingLabel.active = false;
        }
    }

    //提交得分 isOver(若果是 的话会刷新over 界面)
    submitScore(MAIN_MENU_NUM, score, isOver) {
        if (CC_WECHATGAME) {
            let self = this;
            window.wx.getUserCloudStorage({
                // 以key/value形式存储
                keyList: [MAIN_MENU_NUM],
                success(getres) {
                    console.log("--- 提交分数 getUserCloudStorage success ---");
                    console.log(getres);
                    if (getres.KVDataList.length != 0) {
                        let scoreGet = 0;
                        let weekNum = 0;
                        let strGet = getres.KVDataList[0].value;
                        if (typeof (JSON.parse(strGet)) == "object") {
                            getres.KVDataList[0].value = JSON.parse(strGet);
                            scoreGet = getres.KVDataList[0].value.wxgame.score;
                            weekNum = getres.KVDataList[0].value.week;
                        }
                        console.log("-- socreGet--" + scoreGet + " -- " + score + " -- " + weekNum);
                        //&& weekNum == self.getTimeWeek_i()
                        if (scoreGet > score ) { //这里比较了是否超过了服务器的数据，若没超过则不上传
                            if (isOver)
                                self.gameOverRank(MAIN_MENU_NUM);
                            return;
                        }
                    }
                    // 对用户托管数据进行写数据操作
                    window.wx.setUserCloudStorage({
                        KVDataList: [{
                            key: MAIN_MENU_NUM,
                            value: self.getWxValue_s(score)
                        }],
                        success(res) {
                            console.log(res);
                            console.log('setUserCloudStorage', 'success', res)
                            if (isOver)
                                self.gameOverRank(MAIN_MENU_NUM);
                        },
                        fail(res) {
                            console.log('setUserCloudStorage', 'fail')
                        },
                        complete(res) {
                            console.log('setUserCloudStorage', 'ok')
                        }
                    });
                },
                fail(res) {
                    // console.log('getUserCloudStorage', 'fail')
                },
                complete(res) {
                    // console.log('getUserCloudStorage', 'ok')
                }
            });
        } else {
            //  cc.log("提交得分:" + MAIN_MENU_NUM + " : " + score)
        }
    }

    //游戏结束界面显示最近两人
    gameOverRank(MAIN_MENU_NUM) {
        let self = this;
        if (CC_WECHATGAME) {
            wx.getUserInfo({
                openIdList: ['selfOpenId'],
                success: (userRes) => {
                    //    cc.log('success', userRes.data)
                    let userData = userRes.data[0];
                    //取出所有好友数据
                    wx.getFriendCloudStorage({
                        keyList: [MAIN_MENU_NUM],
                        success: res => {
                            console.log("--- gameOverRank success ---");
                            console.log(res);
                            self.loadingLabel.active = false;
                            self.node_overRank.active = true;

                            let data = res.data;
                            //整合data 数据
                            console.log("-- 开始整合数据 ---");
                            let nowWeek = this.getTimeWeek_i();
                            for (let i = 0; i < data.length; ++i) {
                                console.log("-- i " + i + " -- " + data[i].KVDataList.length);
                                if (data[i].KVDataList.length > 0) {
                                    let strValue = data[i].KVDataList[0].value;
                                    console.log("-- strValue " + strValue);
                                    let valueD = JSON.parse(strValue);
                                    if (typeof (valueD) == "object") {
                                        if (valueD.week != nowWeek)
                                            valueD.wxgame.score = 0;
                                        data[i].KVDataList[0].value = valueD;
                                        console.log(valueD);
                                    }
                                    else
                                        data[i].KVDataList[0].value = 0;
                                }
                            }

                            data.sort((a, b) => {
                                if (a.KVDataList.length == 0 && b.KVDataList.length == 0) {
                                    return 0;
                                }
                                if (a.KVDataList.length == 0) {
                                    return 1;
                                }
                                if (b.KVDataList.length == 0) {
                                    return -1;
                                }
                                let scoreA = a.KVDataList[0].value;
                                let scoreB = b.KVDataList[0].value;
                                if (typeof (scoreA) == "object")
                                    scoreA = a.KVDataList[0].value.wxgame.score;
                                if (typeof (scoreB) == "object")
                                    scoreB = b.KVDataList[0].value.wxgame.score;
                                return scoreB - scoreA;
                                //return b.KVDataList[0].value.wxgame.score - a.KVDataList[0].value.wxgame.score;
                            });

                            let fristShowIdx = 0;
                            let myIdx = "null";
                            for (let i = 0; i < data.length; i++) {
                                if (data[i].avatarUrl == userData.avatarUrl) {
                                    myIdx = i;
                                    if (i - 1 >= 0)
                                        fristShowIdx = i - 1;
                                    else
                                        fristShowIdx = i;
                                    break;
                                }
                            }
                            console.log("-- fristShowIdx : " + fristShowIdx + " -- " + myIdx);

                            for (let i = 0; i < self.node_overRank.children.length; ++i) {
                                let nodeN = self.node_overRank.children[i];
                                if (myIdx != "null" && fristShowIdx + i < data.length) {
                                    nodeN.active = true;
                                    nodeN.getComponent('GameOverRank').init(fristShowIdx + i, data[fristShowIdx + i], fristShowIdx + i == myIdx);
                                } else
                                    nodeN.active = false;
                            }
                            console.log("--- gameOver init over ---");
                        },
                        fail: res => {
                            // console.log("wx.getFriendCloudStorage fail", res);
                            self.loadingLabel.getComponent(cc.Label).string = "数据加载失败，请检测网络，谢谢。";
                        }
                    });
                },
                fail: (res) => {
                    self.loadingLabel.getComponent(cc.Label).string = "数据加载失败，请检测网络，谢谢。";
                }
            });
        }
    }

    
    //好友排行列表
    fetchFriendData(MAIN_MENU_NUM) {
        let self = this;
        if (CC_WECHATGAME) {
            wx.getUserInfo({
                openIdList: ['selfOpenId'],
                success: (userRes) => {
                    let userData = userRes.data[0];
                    //取出所有好友数据
                    wx.getFriendCloudStorage({
                        keyList: [MAIN_MENU_NUM],
                        success: res => {
                            console.log("--- fetchFriendData success ---");
                            console.log(res);
                            self.loadingLabel.active = false;
                            self.node_list.active = true;
                            self.scrollViewContent.active = true;

                            let data = res.data;
                            //整合data 数据
                            console.log("-- 开始整合数据 ---");
                            let nowWeek = this.getTimeWeek_i();
                            for (let i = 0; i < data.length; ++i) {
                                console.log("-- i " + i + " -- " + data[i].KVDataList.length);
                                if (data[i].KVDataList.length > 0) {
                                    let strValue = data[i].KVDataList[0].value;
                                    console.log("-- strValue " + strValue);
                                    let valueD = JSON.parse(strValue);
                                    if (typeof (valueD) == "object") {
                                        // if (valueD.week != nowWeek)
                                        //     valueD.wxgame.score = 0;
                                        data[i].KVDataList[0].value = valueD;
                                        console.log(valueD);
                                    }
                                    else
                                        data[i].KVDataList[0].value = 0;
                                }
                            }
                            data.sort((a, b) => {
                                if (a.KVDataList.length == 0 && b.KVDataList.length == 0) {
                                    return 0;
                                }
                                if (a.KVDataList.length == 0) {
                                    return 1;
                                }
                                if (b.KVDataList.length == 0) {
                                    return -1;
                                }
                                let scoreA = a.KVDataList[0].value;
                                let scoreB = b.KVDataList[0].value;
                                if (typeof (scoreA) == "object")
                                    scoreA = a.KVDataList[0].value.wxgame.score;
                                if (typeof (scoreB) == "object")
                                    scoreB = b.KVDataList[0].value.wxgame.score;
                                return scoreB - scoreA;
                                //return b.KVDataList[0].value.wxgame.score - a.KVDataList[0].value.wxgame.score;
                            });

                            //判断加载最大值
                            let maxNum = data.length;
                            if (maxNum > 30)
                                maxNum = 30;
                            //加空间
                            let addNum = maxNum - self.scrollViewContent.children.length;
                            for (let j = 0; j < addNum; ++j) {
                                let nodeN = cc.instantiate(self.pre_rankItem)
                                self.scrollViewContent.addChild(nodeN);
                            }
                            for (let i = 0; i < self.scrollViewContent.children.length; ++i) {
                                let nodeN = self.scrollViewContent.children[i];
                                if (i < data.length) {
                                    nodeN.active = true;
                                    nodeN.getComponent('RankItem').init(i, data[i]);
                                    if (data[i].avatarUrl == userData.avatarUrl) {
                                        self.node_myself.active = true;
                                        self.node_myself.getComponent('RankItem').init(i, data[i]);
                                    }
                                } else
                                    nodeN.active = false;
                            }
                        },
                        fail: res => {
                            //  console.log("wx.getFriendCloudStorage fail", res);
                            self.loadingLabel.getComponent(cc.Label).string = "数据加载失败，请检测网络，谢谢。";
                        }
                    });
                },
                fail: (res) => {
                    self.loadingLabel.getComponent(cc.Label).string = "数据加载失败，请检测网络，谢谢。";
                }
            });
        }
    }



    //群排行列表
    fetchGroupData(MAIN_MENU_NUM, shareTicket) {
        console.log("--- 子域群排行 ---" + shareTicket);
        let self = this;
        if (CC_WECHATGAME) {
            wx.getUserInfo({
                openIdList: ['selfOpenId'],
                success: (userRes) => {
                    console.log('success', userRes.data)
                    let userData = userRes.data[0];
                    //取出所有好友数据
                    wx.getGroupCloudStorage({
                        shareTicket: shareTicket,
                        keyList: [MAIN_MENU_NUM],
                        success: res => {
                            console.log("--- fetchGroupData success ---");
                            self.loadingLabel.active = false;
                            self.node_list.active = true;
                            self.scrollViewContent.active = true;

                            let data = res.data;
                            //整合data 数据
                            console.log("-- 开始整合数据 ---");
                            let nowWeek = this.getTimeWeek_i();
                            for (let i = 0; i < data.length; ++i) {
                                console.log("-- i " + i + " -- " + data[i].KVDataList.length);
                                if (data[i].KVDataList.length > 0) {
                                    let strValue = data[i].KVDataList[0].value;
                                    console.log("-- strValue " + strValue);
                                    let valueD = JSON.parse(strValue);
                                    if (typeof (valueD) == "object") {
                                        // if (valueD.week != nowWeek)
                                        //     valueD.wxgame.score = 0;
                                        data[i].KVDataList[0].value = valueD;
                                        console.log(valueD);
                                    }
                                    else
                                        data[i].KVDataList[0].value = 0;
                                }
                            }
                            data.sort((a, b) => {
                                if (a.KVDataList.length == 0 && b.KVDataList.length == 0) {
                                    return 0;
                                }
                                if (a.KVDataList.length == 0) {
                                    return 1;
                                }
                                if (b.KVDataList.length == 0) {
                                    return -1;
                                }
                                let scoreA = a.KVDataList[0].value;
                                let scoreB = b.KVDataList[0].value;
                                if (typeof (scoreA) == "object")
                                    scoreA = a.KVDataList[0].value.wxgame.score;
                                if (typeof (scoreB) == "object")
                                    scoreB = b.KVDataList[0].value.wxgame.score;
                                return scoreB - scoreA;
                                //return b.KVDataList[0].value.wxgame.score - a.KVDataList[0].value.wxgame.score;
                            });

                            //判断加载最大值
                            let maxNum = data.length;
                            if (maxNum > 30)
                                maxNum = 30;
                            //加空间
                            let addNum = maxNum - self.scrollViewContent.children.length;
                            for (let j = 0; j < addNum; ++j) {
                                let nodeN = cc.instantiate(self.pre_rankItem)
                                self.scrollViewContent.addChild(nodeN);
                            }
                            console.log("--- 群 ---" + data.length);

                            for (let i = 0; i < self.scrollViewContent.children.length; ++i) {
                                let nodeN = self.scrollViewContent.children[i];
                                if (i < data.length) {
                                    nodeN.active = true;
                                    nodeN.getComponent('RankItem').init(i, data[i]);
                                    if (data[i].avatarUrl == userData.avatarUrl) {
                                        self.node_myself.active = true;
                                        self.node_myself.getComponent('RankItem').init(i, data[i]);
                                    }
                                } else
                                    nodeN.active = false;
                            }
                        },
                        fail: res => {
                            // console.log("wx.getFriendCloudStorage fail", res);
                            self.loadingLabel.getComponent(cc.Label).string = "数据加载失败，请检测网络，谢谢。";
                        }
                    });
                },
                fail: (res) => {
                    self.loadingLabel.getComponent(cc.Label).string = "数据加载失败，请检测网络，谢谢。";
                }
            });
        }
    }

    //获取超越时数据
    fetchFriendDataToBeyond(MAIN_MENU_NUM) {
        let self = this;
        if (CC_WECHATGAME) {
            wx.getUserInfo({
                openIdList: ['selfOpenId'],
                success: (userRes) => {
                    //console.log('超越部分：success', userRes.data)
                    let userData = userRes.data[0];
                    //取出所有好友数据
                    wx.getFriendCloudStorage({
                        keyList: [MAIN_MENU_NUM],
                        success: res => {
                            console.log("--- fetchFriendDataToBeyond success ---");
                            console.log(res);
                            let data = res.data;
                            //整合data 数据
                            console.log("-- 开始整合数据 ---");
                            let nowWeek = this.getTimeWeek_i();
                            for (let i = 0; i < data.length; ++i) {
                                console.log("-- i " + i + " -- " + data[i].KVDataList.length);
                                if (data[i].KVDataList.length > 0) {
                                    let strValue = data[i].KVDataList[0].value;
                                    console.log("-- strValue " + strValue);
                                    let valueD = JSON.parse(strValue);
                                    if (typeof (valueD) == "object") {
                                        if (valueD.week != nowWeek)
                                            valueD.wxgame.score = 0;
                                        data[i].KVDataList[0].value = valueD;
                                        console.log(valueD);
                                    }
                                    else
                                        data[i].KVDataList[0].value = 0;
                                }
                            }
                            data.sort((a, b) => {
                                if (a.KVDataList.length == 0 && b.KVDataList.length == 0) {
                                    return 0;
                                }
                                if (a.KVDataList.length == 0) {
                                    return 1;
                                }
                                if (b.KVDataList.length == 0) {
                                    return -1;
                                }
                                let scoreA = a.KVDataList[0].value;
                                let scoreB = b.KVDataList[0].value;
                                if (typeof (scoreA) == "object")
                                    scoreA = a.KVDataList[0].value.wxgame.score;
                                if (typeof (scoreB) == "object")
                                    scoreB = b.KVDataList[0].value.wxgame.score;
                                return scoreB - scoreA;
                                //return b.KVDataList[0].value.wxgame.score - a.KVDataList[0].value.wxgame.score;
                            });
                            let waitingForDelete = 0;
                            for (let i = 0; i < data.length; i++) {
                                if (data[i].avatarUrl == userData.avatarUrl) { //这是自己，要从待超集合中删除
                                    waitingForDelete = i;
                                }
                            }

                            data.splice(waitingForDelete, 1);
                            self.waitingForBeyondFriends = data;
                            //console.log("这里 这里！");
                            // for (let j = 0; j < self.waitingForBeyondFriends.length; j++) {
                            //     console.log(self.waitingForBeyondFriends[j]);
                            // }

                        },
                        fail: res => {
                            //console.log("wx.getFriendCloudStorage fail", res);
                            self.loadingLabel.getComponent(cc.Label).string = "数据加载失败，请检测网络，谢谢。";
                        }
                    });
                },
                fail: (res) => {
                    self.loadingLabel.getComponent(cc.Label).string = "数据加载失败，请检测网络，谢谢。";
                }
            });
        }
    }

    //是否超越
    isBeyond(currentScore) {
        if (this.waitingForBeyondFriends == null || this.waitingForBeyondFriends.length == 0) {
            return;
        }
        //  console.log(this.waitingForBeyondFriends.length);
        //  console.log("看下待超越的数据组");
        // for (let j = 0; j < this.waitingForBeyondFriends.length; j++) {
        //     console.log(this.waitingForBeyondFriends[j]);
        // }


        let beyondIndex = -1;
        for (let i = this.waitingForBeyondFriends.length - 1; i >= 0; i--) { //这个数据源是已经排好序的，但是是倒序从大到小
            let otherScore = this.waitingForBeyondFriends[i].KVDataList.length != 0 ? (typeof (this.waitingForBeyondFriends[i].KVDataList[0].value) == "object" ? this.waitingForBeyondFriends[i].KVDataList[0].value.wxgame.score : 0) : 0;
            if (currentScore > otherScore) {
                beyondIndex = i;
                break;
            }
        }
        if (beyondIndex != -1) {
            this.node_beyond.active = true;
            //splice 返回的是一个数组。一定要加索引来访问
            let beyondData = this.waitingForBeyondFriends.splice(beyondIndex, 1);
            // console.log("看下超越的玩家数据");
            // console.log(beyondData[0]);

            this.initSprite(beyondData[0]);
        }
    }

    //下一个超越的是那一个
    nextBeyond(currentScore) {
        if (this.waitingForBeyondFriends == null || this.waitingForBeyondFriends.length == 0) {
            this.node_beyond.active = false;
            console.log("-- nextBeyond 无 --");
            return;
        }
        //  console.log(this.waitingForBeyondFriends.length);
        //  console.log("看下待超越的数据组");
        // for (let j = 0; j < this.waitingForBeyondFriends.length; j++) {
        //     console.log(this.waitingForBeyondFriends[j]);
        // }


        let nextBeyondIndex = -1;
        for (let i = this.waitingForBeyondFriends.length - 1; i >= 0; i--) { //这个数据源是已经排好序的，但是是倒序从大到小
            let otherScore = this.waitingForBeyondFriends[i].KVDataList.length != 0 ? (typeof (this.waitingForBeyondFriends[i].KVDataList[0].value) == "object" ? this.waitingForBeyondFriends[i].KVDataList[0].value.wxgame.score : 0) : 0;
            if (currentScore < otherScore) {
                nextBeyondIndex = i;
                break;
            }
        }

        //console.log("看下传到子域的当前得分！--》 " + currentScore);
        if (nextBeyondIndex != -1) {
            this.node_beyond.active = true;
            //splice 返回的是一个数组。一定要加索引来访问
            //let beyondData = this.waitingForBeyondFriends.splice(beyondIndex, 1);
            console.log("看下超越的玩家数据");
            // console.log(beyondData[0]);

            this.initSprite(this.waitingForBeyondFriends[nextBeyondIndex]);
            this.nameLabel.string = this.waitingForBeyondFriends[nextBeyondIndex].nickname;
            this.scoreLabel.string = (typeof (this.waitingForBeyondFriends[nextBeyondIndex].KVDataList[0].value) == "object" ? this.waitingForBeyondFriends[nextBeyondIndex].KVDataList[0].value.wxgame.score : 0);
        } else {
            // console.log("执行到这里，隐藏了下个好友！");
            this.node_beyond.active = false;
        }
        console.log("---- beyondOver ----");
    }

    initSprite(beyondData) {
        let avatarUrl = beyondData.avatarUrl;
        //  console.log("看下 头像 URL");
        //  console.log(avatarUrl);
        //  console.log(this.headImageNode);
        //  console.log(this.headImageNode.getComponent(cc.Animation));
        this.createImage(avatarUrl);
        // let anim = this.headImageNode.getComponent(cc.Animation);
        //anim.play();
        // this.headImageNode.runAction(cc.moveTo(5.0,cc.v2(200,200)));
    }

    createImage(avatarUrl) {
        var self = this;
        try {
            let image = wx.createImage();
            image.onload = () => {
                try {
                    let texture = new cc.Texture2D();
                    texture.initWithElement(image);
                    texture.handleLoadedTexture();
                    self.headImageNode.getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(texture);
                } catch (e) {
                    console.log("--- err 1 ---");
                    cc.log(e);
                    self.headImageNode.active = false;
                }
            };
            image.src = avatarUrl;
        } catch (e) {
            console.log("--- err 2 ---");
            cc.log(e);
            self.headImageNode.active = false;
        }
    }

    //获取当前所在的 周 0~6 剩余日期
    getTimeWeek_i() {
        let dayNum = parseInt(Date.now() / (1000 * 3600 * 24));
        let weekNum = parseInt((dayNum - 4) / 7);
        //console.log("-- week --" + weekNum + " -- " + parseInt((dayNum - 4) % 7));
        return weekNum;
    }

    getWxValue_s(score) {
        let value = {
            "wxgame": {
                "score": score,
                "update_time": Date.now()
            },
            "week": this.getTimeWeek_i()
        }
        return JSON.stringify(value);
    }
}