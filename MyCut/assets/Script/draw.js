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
        cc.view.enableAntiAlias(1),
            this.createGraphics();
    },

    start() {
        this.draw();
    },

    createGraphics() {
        this.ctx = this.node.addComponent(cc.Graphics);
        this.ctx.lineWidth = 2;
    },

    draw() {
        var t = this.node.getComponent(cc.PhysicsPolygonCollider);
        // console.log("~~~~");
        // console.log(t.points);
        this.ctx.fillColor = cc.dataMgr.getRigidBodyColorByTag(t.tag);
      //  this.ctx.fillColor = cc.color(110, 184, 255, 255);
        this.drawPolygon(t.points);
        // if (t) {
        //     this.drawPolygon(t.points);
        // }
        // if (t = this.node.getComponent("cc.PhysicsCircleCollider")) {
        //     if (t.tag == n.colliderTag.jointPoint) t.node.zIndex = 10;
        //     else if (t.tag == n.colliderTag.neglectBlue) return this.ctx.lineWidth = 4,
        //         this.ctx.strokeColor = cc.color(40, 40, 40, 255),
        //         this.ctx.fillColor = o.GlobalFun.getRigidBodyColorByTag(t.tag),
        //         void this.drawCircle(t.radius, cc.v2(0, 0), !0);
        //     this.ctx.fillColor = o.GlobalFun.getRigidBodyColorByTag(t.tag),
        //         this.drawCircle(t.radius, cc.v2(0, 0))
        // }

    },

    // outlinePolygon() {
    //     this.ctx.clear();
    //     this.ctx.moveTo(t[0].x, t[0].y);
    //     for (var e = 1; e < t.length; e++) {
    //         this.ctx.lineTo(t[e].x, t[e].y);
    //     }
    //     this.ctx.lineTo(t[0].x, t[0].y);
    //     this.ctx.fill();
    //     this.ctx.stroke();
    // },

    drawPolygon(points) {
        this.ctx.clear();
        
        this.ctx.moveTo(points[0].x, points[0].y);
        for (var e = 1; e < points.length; e++) {
            this.ctx.lineTo(points[e].x, points[e].y);
        }
        this.ctx.fill();
    },

    // update (dt) {},
});
