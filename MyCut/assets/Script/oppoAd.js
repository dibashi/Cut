
(function () {

    window.oppoAd = function () {


        var videoAd = qg.createRewardedVideoAd({
            posId: "48938"
        });
        videoAd.load();
        videoAd.onLoad(function () {
            videoAd.show();
        });

        videoAd.onVideoStart(function () {

        });

        videoAd.onRewarded(function () {

            let ui = cc.find("Canvas/ui");
            if (ui) {
                ui.getComponent('uiLayer').helpCallback();
            }
        });

        videoAd.onError(function (err) {

        });

    };

    // window.lhLog= function(msg) {
    //     let logLabel = cc.find("Canvas/ui/logLabel");
    //         if (logLabel) {
    //             var preStr = logLabel.getComponent(cc.Label).string;
    //             var resStr = preStr + '\n' + msg;
    //             logLabel.getComponent(cc.Label).string = resStr;
    //         }
    // }

    
})();