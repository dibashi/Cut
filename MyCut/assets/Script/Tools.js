//(导入以插件的脚本中)this 即是 window, 脚本中的函数 如: openLog等这样的函数 即为 window.openLog。
//cc、CC_WECHATGAME、CC_DEBUG 等,都是 window下的属性和对象。

console.log("-- load Tools --");
console.log(this);

//------ 基础信息相关 ------
canvasW = 720;
canvasH = 1280;

tools = {
    //------ log 输出相关  ------
    canFind: false, //游戏场景加载后 置为true
    isLabel: false, //显示 label 输出
    isConsole: false, //显示 console 输出(控制台输出)
    countLog: 0, //log 计数
    logArr: [], //当前未打印的 log 输出
    beginY: 0, //移动 log 的初始 Y 值

    loadingRange: 0,
};

//------ 日志输出 log 相关 ------

//label显示log,右侧 150像素内为滑动区域(要在 start() 函数中调用 )
function openLog(isConsoleLog, isLabelLog) {
    console.log("-- openLog 开启 labelLog --");
    tools.canFind = true;
    tools.isLabel = isLabelLog;
    tools.isConsole = isConsoleLog;

    // console.log(this);
    // console.log(window);
    // console.log(console);

    canvasW = cc.find("Canvas").width;
    canvasH = cc.find("Canvas").height;

    //把所有的 console.log 都重载了
    console.log = toolsLog;
    toolsLog("-- openLog -- ", tools);
};

function toolsLog() {
    if (tools.logArr.length > 40)
        return;
    if (tools.canFind && tools.isLabel) {
        let root_log = cc.find("Canvas/root_log");
        //如果没有控件 就添加 root_log
        if (!root_log) {
            let canvasN = cc.find("Canvas");
            if (canvasN) {
                //这里存在 canvas 但不存在 root_log 要添加
                let rootN = new cc.Node();
                canvasN.addChild(rootN, 1500, "root_log");
                //设置 rootN 的锚点 和 滑动事件
                rootN.anchorX = 1;
                rootN.anchorY = 1;
                rootN.width = 150;
                rootN.position = cc.v2(canvasW / 2, canvasH / 2);

                rootN.addComponent(cc.Layout);
                rootN.getComponent(cc.Layout).type = cc.Layout.Type.VERTICAL;
                rootN.getComponent(cc.Layout).resizeMode = cc.Layout.ResizeMode.CONTAINER;
                rootN.getComponent(cc.Layout).paddingTop = 20;
                rootN.getComponent(cc.Layout).verticalDirection = cc.Layout.VerticalDirection.TOP_TO_BOTTOM;

                rootN.on(cc.Node.EventType.TOUCH_MOVE, function (touch) {
                    let touchPos = touch.getLocation();
                    if (tools.beginY != 0) {
                        let moveDis = touchPos.y - tools.beginY;
                        if (Math.abs(moveDis) < 20) {
                            //移动 log
                            let heightR = rootN.height;
                            let rootY = rootN.y;
                            rootN.y += moveDis;
                            // if (rootY + moveDis < canvasH / 2)
                            //     rootN.y = canvasH / 2;
                            // if (heightR > canvasH && rootY > heightR - canvasH / 2)
                            //     rootY = heightR - canvasH / 2;
                        }
                    }
                    tools.beginY = touchPos.y;
                }, rootN);

                rootN.addComponent(cc.Button);
                root_log = rootN;
            }
        }
        //之前没有输出的 要输出
        if (root_log && tools.logArr.length > 0) {
            let addNum = tools.logArr.length;
            for (let i = 0; i < addNum; ++i) {
                if (tools.logArr.length > 0) {
                    let desc = tools.logArr.shift();
                    addOneLog(desc + " arr:" + tools.logArr.length);
                }
            }
        }
    }
    if (arguments && arguments.length > 0) {
        //整理数据
        ++tools.countLog;
        let logStr = tools.countLog + ": ";
        for (let i = 0; i < arguments.length; ++i) {
            let desc = arguments[i];
            if (typeof (desc) == "string")
                logStr = logStr + desc + " ";
            else if (typeof (desc) == "object")
                logStr = logStr + JSON.stringify(desc) + " ";
            else
                logStr = logStr + typeof (desc) + " ";
        }

        //添加 log 和 label 显示
        if (tools.isConsole)
            console.info(logStr);
        addOneLog(logStr);
    }
};

function addOneLog(desc) {
    let isAdd = false;
    if (tools.canFind && tools.isLabel) {
        let root_log = cc.find("Canvas/root_log");
        if (root_log) {
            isAdd = true;
            let nodeN = new cc.Node();
            nodeN.addComponent(cc.Label);

            root_log.addChild(nodeN);
            nodeN.x = -canvasW / 2;
            nodeN.getComponent(cc.Label).fontSize = 35;
            nodeN.getComponent(cc.Label).lineHeight = 40;
            nodeN.getComponent(cc.Label).fontFamily = "SimHei";
            nodeN.color = cc.Color.BLACK;

            nodeN.getComponent(cc.Label).string = getAutoChangeLine_str(desc, 30, false);
        }
    }
    if (!isAdd) {
        tools.logArr.push(desc);
    }
};

//------ 常用函数 ------

//字符串自动换行: 目标字符串、间隔多长换行、第一句是否留空格(保持段落缩进)
function getAutoChangeLine_str(aimStr, cutLength, isBlank) {
    let strRet = null;
    if (typeof (aimStr) == "object")
        aimStr = JSON.stringify(aimStr);
    if (typeof (aimStr) == "string") {
        let strLength = aimStr.length;
        for (let i = 0; i < Math.ceil(strLength / cutLength); ++i) {
            let strOne = null;
            if (isBlank) {
                //英文 -4 汉字 -2
                if (i == 0)
                    strOne = "    " + aimStr.substr(i * cutLength, cutLength - 4);
                else
                    strOne = aimStr.substr(i * cutLength - 4, cutLength);
            } else
                strOne = aimStr.substr(i * cutLength, cutLength);
            if (strOne)
                if (!strRet)
                    strRet = strOne;
                else
                    strRet = strRet + "\n" + strOne;
        }
    }
    return strRet;
};

//获取当前秒数
function getTimeSecond_i() {
    return parseInt(Date.now() / 1000);
};

//获取当前所在的 周 0~6 剩余日期
function getTimeWeek_i() {
    let dayNum = parseInt(Date.now() / (1000 * 3600 * 24));
    let weekNum = parseInt((dayNum - 4) / 7);
    return weekNum;
};

//------ jsb 交互相关 ------

function tools_login() {
    console.log("-- tools_login -- ");
    //jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "showAlertDialog", "(Ljava/lang/String;Ljava/lang/String;)V", "title", "hahahahha");

    //java 调用 js
    // public static void login(String desc){
    //     Log.i("-- AppActivity -- ",desc);
    //    // 一定要在 GL 线程中执行
    //    sObj.runOnGLThread(new Runnable() {
    //        @Override
    //        public void run() {
    //            Cocos2dxJavascriptJavaBridge.evalString("tools_respLogin(\"Javascript Java bridge!\")");
    //        }
    //    });
    // }

    if (cc.sys.os == cc.sys.OS_ANDROID) {
        jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "login", "(Ljava/lang/String;)V", " ** ");
    } else if (cc.sys.os == cc.sys.OS_IOS) {

    }
}

function tools_respLogin(data) {
    console.log("-- java 返回 --" + data);
}