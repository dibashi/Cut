const {
    ccclass,
    property
} = cc._decorator;

@ccclass
export default class AudioMgr extends cc.Component {

    _audioSource_o = {
        begin:null,
        bgm: null,
        btn:null,
        cut:null,
        eatStar:null,
        over:null,
    };
   

    _jumpID = null;

    init() {
      //  console.log("--- onLoad AudioMgr ---")
      var self = this;
        cc.game.on(cc.game.EVENT_HIDE, function () {
        //    console.log("cc.audioEngine.pauseAll");
            cc.audioEngine.pauseAll();
        });
        cc.game.on(cc.game.EVENT_SHOW, function () {
          //  console.log("cc.audioEngine.resumeAll");
            cc.audioEngine.resumeAll();
            //若声音开启，并且 是在主菜单界面（下面能找到游戏标题图片），就开启背景声
           // debugger;//.getComponent("start")
            if(cc.audioMgr.isPlay() && cc.find("Canvas/home_tit")) {
                cc.audioMgr.playBgm();
            }
        });

        cc.loader.loadRes("sound/begin", cc.AudioClip, function (err, clip) {
            if (!err) {
                self._audioSource_o.begin = clip;
                
            }
        });


        cc.loader.loadRes("sound/bgm", cc.AudioClip, function (err, clip) {
            if (!err) {
                self._audioSource_o.bgm = clip;
                self.playBgm();
                
            }
        });
        cc.loader.loadRes("sound/btn", cc.AudioClip, function (err, clip) {
            if (!err)
                self._audioSource_o.btn = clip;
        });

       
        cc.loader.loadRes("sound/cut", cc.AudioClip, function (err, clip) {
            if (!err)
                self._audioSource_o.cut = clip;
        });

        cc.loader.loadRes("sound/eatStar", cc.AudioClip, function (err, clip) {
            if (!err)
                self._audioSource_o.eatStar = clip;
        });

        cc.loader.loadRes("sound/over", cc.AudioClip, function (err, clip) {
            if (!err) {
                self._audioSource_o.over = clip;
            }
        });
       
        cc.sys.localStorage.setItem("isPlay",1);

        cc.audioEngine.setMaxAudioInstance(10);
        //this.init();
    }

    isPlay() {
        if(cc.sys.localStorage.getItem("isPlay") == 1) {
            return true;
        } else {
            return false;
        }
    }

    setIsPlay(bVal) {
        if(bVal) {
            cc.sys.localStorage.setItem("isPlay",1);
        } else {
            cc.sys.localStorage.setItem("isPlay",0);
        }
    }

    //type_s 为这个音乐的名称
    playEffect(type_s) {
        if(this.isPlay()) {
            let source = this._audioSource_o[type_s];
            cc.audioEngine.setEffectsVolume(0.4);
            cc.audioEngine.playEffect(source, false);
        }
     
       
    }

    stopEffect() {

    }

    stopAll() {
        this.setIsPlay(false);
        this.stopBgm();
    }

    openAll() {
        this.setIsPlay(true);
        this.playBgm();
    }


    playBegin() {
        // let source = this._audioSource_o["begin"];
        // if (source) {
        //     cc.audioEngine.playEffect(source, false);
        //     cc.audioEngine.setMusicVolume(0.64);
        // }
        this.playEffect("begin");
    }

    playBgm() {
        return;
        let source = this._audioSource_o["bgm"];
        if (source) {
            cc.audioEngine.playMusic(source, true);
            cc.audioEngine.setMusicVolume(0.4);
        }
    }

    playBtn() {
        // let source = this._audioSource_o["btn"];
        // if (source) {
        //     cc.audioEngine.playEffect(source, false);
        //     cc.audioEngine.setMusicVolume(0.64);
        // }
        this.playEffect("btn");
    }

    playCut() {
        // let source = this._audioSource_o["cut"];
        // if (source) {
        //     cc.audioEngine.playEffect(source, false);
        //     cc.audioEngine.setMusicVolume(0.64);
        // }
        this.playEffect("cut");
    }

    playEatStar() {
        // let source = this._audioSource_o["eatStar"];
        // if (source) {
        //     cc.audioEngine.playEffect(source, false);
        //     cc.audioEngine.setMusicVolume(0.64);
        // }
        this.playEffect("eatStar");
    }

    playOver() {
        // let source = this._audioSource_o["over"];
        // if (source) {
        //     cc.audioEngine.playEffect(source, false);
        //     cc.audioEngine.setMusicVolume(0.64);
        // }
        this.playEffect("over");
    }


    pauseBgm() {
        cc.audioEngine.pause();
    }
    

    stopBgm() {
        cc.audioEngine.stopMusic();
    }

    pauseAll() {
        cc.audioEngine.pauseAll();
    }

    resumeAll() {
        cc.audioEngine.resumeAll();
    }
}