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
    isPlay = true;

    _jumpID = null;

    init() {
      //  console.log("--- onLoad AudioMgr ---")
        cc.game.on(cc.game.EVENT_HIDE, function () {
        //    console.log("cc.audioEngine.pauseAll");
            cc.audioEngine.pauseAll();
        });
        cc.game.on(cc.game.EVENT_SHOW, function () {
          //  console.log("cc.audioEngine.resumeAll");
            cc.audioEngine.resumeAll();
        });

        let self = this;

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
       
      

        cc.audioEngine.setMaxAudioInstance(10);
        //this.init();
    }

    //type_s 为这个音乐的名称
    playEffect(type_s) {
        if(this.isPlay) {
            let source = this._audioSource_o[type_s];
            cc.audioEngine.setEffectsVolume(1.0);
            cc.audioEngine.playEffect(source, false);
        }
     
       
    }

    stopEffect() {

    }

    stopAll() {
        this.isPlay = false;
        this.stopBgm();
    }

    openAll() {
        this.isPlay = true;
        this.playBgm();
    }


    playBegin() {
        let source = this._audioSource_o["begin"];
        if (source) {
            cc.audioEngine.playEffect(source, false);
            cc.audioEngine.setMusicVolume(0.64);
        }
    }

    playBgm() {
        let source = this._audioSource_o["bgm"];
        if (source) {
            cc.audioEngine.playMusic(source, true);
            cc.audioEngine.setMusicVolume(0.64);
        }
    }

    playBtn() {
        let source = this._audioSource_o["btn"];
        if (source) {
            cc.audioEngine.playEffect(source, true);
            cc.audioEngine.setMusicVolume(0.64);
        }
    }

    playCut() {
        let source = this._audioSource_o["cut"];
        if (source) {
            cc.audioEngine.playEffect(source, true);
            cc.audioEngine.setMusicVolume(0.64);
        }
    }

    playEatStar() {
        let source = this._audioSource_o["eatStar"];
        if (source) {
            cc.audioEngine.playEffect(source, true);
            cc.audioEngine.setMusicVolume(0.64);
        }
    }

    playOver() {
        let source = this._audioSource_o["over"];
        if (source) {
            cc.audioEngine.playEffect(source, true);
            cc.audioEngine.setMusicVolume(0.64);
        }
    }

    

    stopBgm() {
        cc.audioEngine.stopMusic();
        this.isPlay = false;
    }

    pauseAll() {
        cc.audioEngine.pauseAll();
    }

    resumeAll() {
        cc.audioEngine.resumeAll();
    }
}