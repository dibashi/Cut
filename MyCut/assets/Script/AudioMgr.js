const {
    ccclass,
    property
} = cc._decorator;

@ccclass
export default class AudioMgr extends cc.Component {

    _audioSource_o = {
        bg: null,
        eatStar:null,
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
        cc.loader.loadRes("sound/bgm", cc.AudioClip, function (err, clip) {
            if (!err) {
                self._audioSource_o.bgm = clip;
                //self.playBg();
                
            }
        });
        cc.loader.loadRes("sound/eatStar", cc.AudioClip, function (err, clip) {
            if (!err)
                self._audioSource_o.eatStar = clip;
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
        this.stopBg();
    }

    openAll() {
        this.isPlay = true;
        this.playBg();
    }

    playBg() {
        let source = this._audioSource_o["bgm"];
        if (source) {
            cc.audioEngine.playMusic(source, true);
            cc.audioEngine.setMusicVolume(0.64);
        }
    }

    stopBg() {
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