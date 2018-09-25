// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        // foo: {
        //     // ATTRIBUTES:
        //     default: null,        // The default value will be used only when the component attaching
        //                           // to a node for the first time
        //     type: cc.SpriteFrame, // optional, default is typeof default
        //     serializable: true,   // optional, default is true
        // },
        // bar: {
        //     get () {
        //         return this._bar;
        //     },
        //     set (value) {
        //         this._bar = value;
        //     }
        // },


       

       

       
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
  
    },

    start() {
       
    },
    onBeginContact: function (contact, selfCollider, otherCollider) {
       
        if (otherCollider.tag == 2 ) {
            let mass = otherCollider.node.getComponent(cc.RigidBody).getMass();
           // console.log("调用！！！");

            console.log("碰到了！" + mass);
            console.log(otherCollider);
            this.node.parent.parent.getComponent("gameLayer").hittedMassTrigger(mass);
          otherCollider.node.removeFromParent(false);
            //this.dead();
            //先用这个，将来用上面那个
            // cc.find("Canvas").getComponent("gameScene").gameOver();
        } 
      
    },

    dead: function () {
        cc.find("Canvas").getComponent("gameScene").slowMotion(0.15);
        this.boomAni();
    },

    boomAni: function () {
        let gameSoundBG = cc.sys.localStorage.getItem('gameSoundBG');
        if (gameSoundBG == 1) {
            cc.audioEngine.playEffect(this.boomAudio, false);
        }
        this.node.group = "default";
        //this.node.active = false;
        this.node.opacity = 0;
        this.unscheduleAllCallbacks();

        let aniBoom = cc.instantiate(this.teXiaoBoom);
        let armatureDisplay = aniBoom.getComponent(dragonBones.ArmatureDisplay);
        armatureDisplay.playAnimation("boom");
        this.node.parent.addChild(aniBoom);
        aniBoom.setPosition(this.node.position);
        armatureDisplay.addEventListener(dragonBones.EventObject.LOOP_COMPLETE, this.baozhaOver, this);
    },

    baozhaOver: function () {
        this.unscheduleAllCallbacks();
        cc.find("Canvas").getComponent("gameScene").gameOver();
        this.node.destroy();
    },

    // 只在两个碰撞体结束接触时被调用一次
    onEndContact: function (contact, selfCollider, otherCollider) {

    },

    // 每次将要处理碰撞体接触逻辑时被调用
    onPreSolve: function (contact, selfCollider, otherCollider) {
        //   cc.log("onPreSolve");
    },

    // 每次处理完碰撞体接触逻辑时被调用
    onPostSolve: function (contact, selfCollider, otherCollider) {

    },

    // update (dt) {},
});
