cc.Class({
    extends: cc.Component,

    properties: {


    },

    // use this for initialization
    onLoad: function () {
        this.checkpointInit();
       // this.touchOpen();
       // this.physicsOpen();
        console.log("game layer on load");
    },

    checkpointInit: function () {
        let self = this;
        let pathOfPrefab = "Prefab/checkpoint" + cc.dataMgr.currentCheckPoint;
        cc.loader.loadRes(pathOfPrefab, function (err, prefab) {
            self.checkPointLoadSuccess(prefab, cc.v2(0,0));
        });

    },

    checkPointLoadSuccess: function (prefab, position) {
        //生成关卡的NODE 将其加入gameLayer
        let currentNode = cc.instantiate(prefab);
        
        this.node.addChild(currentNode);
        currentNode.setPosition(position);

        //递归：给子节点下的所有子节点以刚体速度
      //  this.giveRigidBodyVelocity(currentNode, -this.bgSpeed * 1.2);

       
    },

    touchOpen: function () {
        this.node.on('touchstart', this.dragStart, this);
        this.node.on('touchmove', this.dragMove, this);
        this.node.on('touchend', this.drageEnd, this);
    },

    physicsOpen: function () {
        // cc.director.getPhysicsManager().enabled = true; //开启物理系统，否则在编辑器里做的一切都没有任何效果
        // cc.director.getPhysicsManager().debugDrawFlags = cc.PhysicsManager.DrawBits.e_aabbBit |
        //     cc.PhysicsManager.DrawBits.e_pairBit |
        //     cc.PhysicsManager.DrawBits.e_centerOfMassBit |
        //     cc.PhysicsManager.DrawBits.e_jointBit |
        //     cc.PhysicsManager.DrawBits.e_shapeBit; //开启物理调试信息
        // cc.director.getPhysicsManager().debugDrawFlags = 0; //-设置为0则关闭调试
        // cc.director.getPhysicsManager().gravity = cc.v2(0, -320);//-320像素/秒的平方，这个是默认值，为了以后调试先放在这
    },

    start: function () {
        console.log("game layer on start");
    },

    dragStart: function (event) {

    },

    dragMove: function (event) {

    },

    drageEnd: function (event) {

    },

    // called every frame
    update: function (dt) {




    },


});
