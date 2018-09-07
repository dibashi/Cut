


//js 反混交

require = function i(r, c, s) {
    function p(e, t) {
        if (!c[e]) {
            if (!r[e]) {
                var a = "function" == typeof require && require;
                if (!t && a) return a(e, !0);
                if (l) return l(e, !0);
                var o = new Error("Cannot find module '" + e + "'");
                throw o.code = "MODULE_NOT_FOUND",
                o
            }
            var n = c[e] = {
                exports: {}
            };
            r[e][0].call(n.exports, function (t) {
                return p(r[e][1][t] || t)
            }, n, n.exports, i, r, c, s)
        }
        return c[e].exports
    }
    for (var l = "function" == typeof require && require, t = 0;
    t < s.length;
    t++) p(s[t]);
    return p
}({
    Arrow: [function (t, e, a) {
        "use strict";
        cc._RF.push(e, "536fdbAEUxKIqKU+q0v/sfX", "Arrow"),
        Object.defineProperty(a, "__esModule", {
            value: !0
        });
        var o = cc._decorator,
            n = o.ccclass,
            i = o.property,
            r = function (e) {
                function t() {
                    var t = null !== e && e.apply(this, arguments) || this;
                    return t.upNode = null,
                    t
                }
                return __extends(t, e),
                t.prototype.start = function () {
                    this.node.zIndex = 10,
                    this.setAction()
                },
                t.prototype.setAction = function () {
                    var t = cc.scaleTo(.5, 1.2 * this.node.scale),
                        e = cc.scaleTo(.5, 1 * this.node.scale),
                        a = cc.sequence(t, e),
                        o = cc.repeatForever(a);
                    this.node.runAction(o)
                },
                t.prototype.update = function (t) {
                    this.upNode && (this.node.position = this.upNode.position)
                },
                __decorate([i(cc.Node)], t.prototype, "upNode", void 0),
                t = __decorate([n], t)
            }(cc.Component);
        a.
    default = r,
        cc._RF.pop()
    },
    {}],
    Btn: [function (t, e, a) {
        "use strict";
        cc._RF.push(e, "5f11azl9ldML5akrMBA0XID", "Btn"),
        Object.defineProperty(a, "__esModule", {
            value: !0
        });
        var o = t("../../enum/GameEnum"),
            s = t("../../utils/GlobalFun"),
            i = t("../../data/ChapterData"),
            r = t("../../data/GameData"),
            n = t("./Ui"),
            p = t("../../data/SplitData"),
            c = t("../ScrollView"),
            l = t("../../data/RoleData"),
            u = t("./TopUi"),
            h = cc._decorator,
            d = h.ccclass,
            g = h.property,
            f = function (e) {
                function t() {
                    var t = null !== e && e.apply(this, arguments) || this;
                    return t.lineProfab = null,
                    t.uiScript = null,
                    t.scrollViewScrpit = null,
                    t.topUi = null,
                    t
                }
                return __extends(t, e),
                t.prototype.btnCallback = function (t, e) {
                    switch (e) {
                    case o.btnTag.demo:
                        this.demoBtn();
                        break;
                    case o.btnTag.skip:
                        break;
                    case o.btnTag.reStart:
                        this.reStart();
                        break;
                    case o.btnTag.back:
                        this.back();
                        break;
                    case o.btnTag.next:
                        this.next();
                        break;
                    case o.btnTag.play:
                        this.play()
                    }
                },
                t.prototype.play = function () {
                    l.RoleData.getInstance().addUnlockChapterNum(),
                    this.scrollViewScrpit.refresh()
                },
                t.prototype.next = function () {
                    var t = i.ChapterData.getInstance().getNextVo();
                    p.SplitData.getInstance().clearSplitInfo(),
                    p.SplitData.getInstance().removeAllCrumb(),
                    r.GameData.getInstance().setIsRefreshTopUi(!0),
                    r.GameData.getInstance().setCurrentChapterName(t.getName())
                },
                t.prototype.reStart = function () {
                    this.topUi.isAllowNext = !1,
                    p.SplitData.getInstance().clearSplitInfo(),
                    r.GameData.getInstance().setIsRefreshTopUi(!0),
                    p.SplitData.getInstance().removeAllCrumb(),
                    this.uiScript.chanageChapter()
                },
                t.prototype.back = function () {
                    p.SplitData.getInstance().removeHelpLint(),
                    r.GameData.getInstance().setCurrentChapterName("menu"),
                    r.GameData.getInstance().setIsClearCrumb(!0),
                    p.SplitData.getInstance().clearSplitInfo(),
                    this.scrollViewScrpit.refresh()
                },
                t.prototype.demoBtn = function () {
                    var c = this;
                    0 < p.SplitData.getInstance().getSplitNum() && this.reStart();
                    var t = cc.find("Canvas").getChildByName("temp");
                    t && t.destroy();
                    for (var e = r.GameData.getInstance().getCurrentChapterName(), a = i.ChapterData.getInstance().getVoByName(e).getHelperPoints(), o = function (t, e) {
                        var a = s.GlobalFun.getAngle(t, e),
                            o = cc.instantiate(c.lineProfab);
                        p.SplitData.getInstance().addHelpLine(o),
                        o.name = "temp",
                        o.position = t,
                        o.rotation = a,
                        o.parent = c.node.parent.parent,
                        o.width = 0,
                        o.height = 5;
                        var n = s.GlobalFun.getDistance(t, e),
                            i = 0,
                            r = n / 10;
                        i = setInterval(function () {
                                o.width += r,
                                o.width >= n && clearInterval(i)
                            }, 33)
                    }, n = 0;
                    n < a.length;
                    n += 2) o(a[n], a[n + 1])
                },
                __decorate([g(cc.Prefab)], t.prototype, "lineProfab", void 0),
                __decorate([g(n.
            default)], t.prototype, "uiScript", void 0),
                __decorate([g(c.
            default)], t.prototype, "scrollViewScrpit", void 0),
                __decorate([g(u.TopUi)], t.prototype, "topUi", void 0),
                t = __decorate([d], t)
            }(cc.Component);
        a.Btn = f,
        cc._RF.pop()
    },
    {
        "../../data/ChapterData": "ChapterData",
        "../../data/GameData": "GameData",
        "../../data/RoleData": "RoleData",
        "../../data/SplitData": "SplitData",
        "../../enum/GameEnum": "GameEnum",
        "../../utils/GlobalFun": "GlobalFun",
        "../ScrollView": "ScrollView",
        "./TopUi": "TopUi",
        "./Ui": "Ui"
    }],
    ChapterData: [function (t, e, a) {
        "use strict";
        cc._RF.push(e, "9249eXj1u9KYqTvulpu2Vdv", "ChapterData"),
        Object.defineProperty(a, "__esModule", {
            value: !0
        });
        var n = t("../viewObject/ChapterVo"),
            i = t("./GameData"),
            r = t("../utils/XmlUtil"),
            o = function () {
                function t() {
                    var e = this;
                    this.vos = [];
                    var a = 0;
                    a = setInterval(function () {
                        var t = r.XmlUtil.getInstance().getAllXmlInfo("chapter");
                        t && (e.createVos(t), clearInterval(a))
                    }, 200)
                }
                return t.getInstance = function () {
                    return t.instance
                },
                t.prototype.createVos = function (t) {
                    for (var e = r.XmlUtil.getInstance().getLen("chapter"), a = 0;
                    a < e;
                    a++) {
                        var o = new n.ChapterVo(t[a]);
                        this.vos[a] = o
                    }
                    i.GameData.getInstance().setIsLoadJsonFinish(!0)
                },
                t.prototype.getVoNum = function () {
                    return this.vos.length
                },
                t.prototype.getVos = function () {
                    return this.vos
                },
                t.prototype.getVoByName = function (t) {
                    for (var e = 0;
                    e < this.vos.length;
                    e++) if (this.vos[e].getName() == t) return this.vos[e];
                    return null
                },
                t.prototype.getVoByCode = function (t) {
                    for (var e = 0;
                    e < this.vos.length;
                    e++) if (this.vos[e].getCode() == t) return this.vos[e];
                    return null
                },
                t.prototype.getCurrentVo = function () {
                    var t = i.GameData.getInstance().getCurrentChapterName();
                    return this.getVoByName(t)
                },
                t.prototype.getNextVo = function () {
                    var t = this.getCurrentVo();
                    return this.getVoByCode(t.getCode() + 1)
                },
                t.instance = new t,
                t
            }();
        a.ChapterData = o,
        cc._RF.pop()
    },
    {
        "../utils/XmlUtil": "XmlUtil",
        "../viewObject/ChapterVo": "ChapterVo",
        "./GameData": "GameData"
    }],
    ChapterItem: [function (t, e, a) {
        "use strict";
        cc._RF.push(e, "cf64fOtDxdBlqlxW42uPeGy", "ChapterItem"),
        Object.defineProperty(a, "__esModule", {
            value: !0
        });
        var o = t("../data/GameData"),
            n = t("../data/RoleData"),
            i = cc._decorator,
            r = i.ccclass,
            c = i.property,
            s = function (e) {
                function t() {
                    var t = null !== e && e.apply(this, arguments) || this;
                    return t.passedSpriteFrame = null,
                    t.notPassedSpriteFrame = null,
                    t.starPrefab = null,
                    t.lockPrefab = null,
                    t.data = null,
                    t.gameData = null,
                    t
                }
                return __extends(t, e),
                t.prototype.start = function () {
                    this.gameData = o.GameData.getInstance()
                },
                t.prototype.init = function (t) {
                    var e = n.RoleData.getInstance().getChapterObjByName(t.getName()),
                        a = this.node.getComponent(cc.Sprite);
                    this.node.getChildByName("richtext").getComponent(cc.RichText).string = t.getCode().toString(),
                    e ? (a.spriteFrame = this.passedSpriteFrame, this.createStar(e.star)) : (a.spriteFrame = this.notPassedSpriteFrame, this.createLock()),
                    this.data = t
                },
                t.prototype.createStar = function (t) {
                    var e;
                    3 == t ? e = cc.v2(-34, 36) : 2 == t ? e = cc.v2(-18, 36) : 1 == t && (e = cc.v2(0, 36));
                    for (var a = 0;
                    a < t;
                    a++) {
                        var o = cc.instantiate(this.starPrefab);
                        o.position = cc.v2(e.x + 34 * a, e.y),
                        this.node.addChild(o)
                    }
                },
                t.prototype.createLock = function () {
                    var t = cc.v2(0, 36),
                        e = cc.instantiate(this.lockPrefab);
                    e.position = cc.v2(t.x, t.y),
                    this.node.addChild(e)
                },
                t.prototype.click = function () {
                    this.gameData.setCurrentChapterName(this.data.getName())
                },
                __decorate([c(cc.SpriteFrame)], t.prototype, "passedSpriteFrame", void 0),
                __decorate([c(cc.SpriteFrame)], t.prototype, "notPassedSpriteFrame", void 0),
                __decorate([c(cc.Prefab)], t.prototype, "starPrefab", void 0),
                __decorate([c(cc.Prefab)], t.prototype, "lockPrefab", void 0),
                t = __decorate([r], t)
            }(cc.Component);
        a.ChapterItem = s,
        cc._RF.pop()
    },
    {
        "../data/GameData": "GameData",
        "../data/RoleData": "RoleData"
    }],
    ChapterManage: [function (t, e, a) {
        "use strict";
        cc._RF.push(e, "91331B3J6FFnp3igcJoKApE", "ChapterManage"),
        Object.defineProperty(a, "__esModule", {
            value: !0
        });
        var o = cc._decorator,
            n = o.ccclass,
            i = o.property,
            r = function (e) {
                function t() {
                    var t = null !== e && e.apply(this, arguments) || this;
                    return t.chapters = [],
                    t
                }
                return __extends(t, e),
                t.prototype.getChapters = function () {
                    return this.chapters
                },
                t.prototype.getChapterPrefabByName = function (t) {
                    var e = t.substring(7),
                        a = parseInt(e);
                    return this.chapters[a - 1]
                },
                __decorate([i([cc.Prefab])], t.prototype, "chapters", void 0),
                t = __decorate([n], t)
            }(cc.Component);
        a.
    default = r,
        cc._RF.pop()
    },
    {}],
    ChapterVo: [function (t, e, a) {
        "use strict";
        cc._RF.push(e, "7fe46rtDhxO3ZWInEvYrvlh", "ChapterVo"),
        Object.defineProperty(a, "__esModule", {
            value: !0
        });
        var o = function () {
            function t(t) {
                this.helperPoints = [],
                this.code = null,
                this.mass = null,
                this.name = t.name,
                this.code = t.code,
                this.perfectPass = t.perfectPass,
                this.passCondition = t.passCondition,
                this.passConditionType = t.passConditionType,
                t.perfectDorp && (this.perfectDorp = t.perfectDorp),
                this.helperPoints = t.helperPoints
            }
            return t.prototype.getPerfectDorp = function () {
                return this.perfectDorp
            },
            t.prototype.getPerfectPass = function () {
                return this.perfectPass
            },
            t.prototype.getPassCondition = function () {
                return this.passCondition
            },
            t.prototype.getName = function () {
                return this.name
            },
            t.prototype.setHelperPoints = function (t, e) {
                this.helperPoints[0] = t,
                this.helperPoints[1] = e
            },
            t.prototype.getHelperPoints = function () {
                return this.helperPoints
            },
            t.prototype.getCode = function () {
                return this.code
            },
            t.prototype.setCode = function (t) {
                this.code = t
            },
            t.prototype.getPassConditionType = function () {
                return this.passConditionType
            },
            t.prototype.setDropColor = function (t) {
                this.dropColor = t
            },
            t.prototype.getDropColor = function () {
                return this.dropColor
            },
            t.prototype.setMass = function (t) {
                this.mass = t
            },
            t.prototype.addMass = function (t) {
                this.mass += t
            },
            t.prototype.getMass = function () {
                return this.mass
            },
            t.prototype.getType = function () {
                return this.passConditionType
            },
            t
        }();
        a.ChapterVo = o,
        cc._RF.pop()
    },
    {}],
    CrumbManage: [function (t, e, a) {
        "use strict";
        cc._RF.push(e, "0f40eUMja5Bno5B6u1DhO4I", "CrumbManage"),
        Object.defineProperty(a, "__esModule", {
            value: !0
        });
        var o = t("../../data/SplitData"),
            n = t("../../data/GameData"),
            i = cc._decorator,
            r = i.ccclass,
            c = i.property,
            s = function (e) {
                function t() {
                    var t = null !== e && e.apply(this, arguments) || this;
                    return t.jointNode = [],
                    t.splitData = null,
                    t.gravity = null,
                    t.OthenNode = [],
                    t.aa = 0,
                    t
                }
                return __extends(t, e),
                t.prototype.onLoad = function () {
                    this.splitData = o.SplitData.getInstance();
                    var t = cc.director.getPhysicsManager();
                    t.enabled = !0,
                    this.gravity && (t.gravity = this.gravity)
                },
                t.prototype.start = function () {
                    this.gravity || (this.gravity = cc.v2(0, -320))
                },
                t.prototype.update = function (t) {
                    this.splitData.getIsSplitFinish() && (this.splitData.addSplitNum(), this.splitData.setIsSplitFinish(!1), this.handleSplit(), n.GameData.getInstance().setIsRefreshTopUi(!0))
                },
                t.prototype.handleSplit = function () {
                    for (var t = 0, e = this.splitData.getSplitColliders();
                    t < e.length;
                    t++) {
                        var a = e[t];
                        a.body && (a.body.enabledContactListener = !0),
                        a.node.addComponent("Crumb");
                        for (var o = 0, n = this.check(a);
                        o < n.length;
                        o++) {
                            var i = n[o].getComponent(cc.RevoluteJoint);
                            i.connectedBody = a.body;
                            var r = i.getComponent(cc.RigidBody).getWorldPosition(null),
                                c = a.body.getLocalPoint(r, null);
                            i.connectedAnchor = c,
                            i.apply()
                        }
                        a.apply(),
                        a.body.type = cc.RigidBodyType.Dynamic
                    }
                    this.splitData.clearSplit();
                    for (var s = 0, p = this.OthenNode;
                    s < p.length;
                    s++) {
                        p[s].active = !1
                    }
                },
                t.prototype.check = function (t) {
                    for (var e = t.points, a = [], o = 0, n = this.jointNode;
                    o < n.length;
                    o++) {
                        var i = n[o],
                            r = i.getComponent(cc.RigidBody).getWorldPosition(null),
                            c = t.body.getLocalPoint(r, null);
                        cc.Intersection.pointInPolygon(c, e) && (a[a.length] = i)
                    }
                    return a
                },
                __decorate([c([cc.Node])], t.prototype, "jointNode", void 0),
                __decorate([c(cc.Vec2)], t.prototype, "gravity", void 0),
                __decorate([c([cc.Node])], t.prototype, "OthenNode", void 0),
                t = __decorate([r], t)
            }(cc.Component);
        a.CrumbManage = s,
        cc._RF.pop()
    },
    {
        "../../data/GameData": "GameData",
        "../../data/SplitData": "SplitData"
    }],
    Crumb: [function (t, e, a) {
        "use strict";
        cc._RF.push(e, "e425aGxOa1Di5ZOBA6pXKWp", "Crumb"),
        Object.defineProperty(a, "__esModule", {
            value: !0
        });
        var i = t("../../data/GameData"),
            r = t("../../enum/GameEnum"),
            c = t("../../data/SplitData"),
            o = t("../../data/ChapterData"),
            n = cc._decorator,
            s = n.ccclass,
            p = (n.property, function (t) {
                function e() {
                    return null !== t && t.apply(this, arguments) || this
                }
                return __extends(e, t),
                e.prototype.onLoad = function () {
                    this.gameData = i.GameData.getInstance()
                },
                e.prototype.start = function () {
                    this.currentChapterVo = o.ChapterData.getInstance().getCurrentVo()
                },
                e.prototype.update = function () {
                    this.gameData.getIsClearCrumb() && this.node.destroy()
                },
                e.prototype.onBeginContact = function (t, e, a) {
                    if (a.tag == r.colliderTag.jointPoint);
                    else if (a.tag == r.colliderTag.botton && this.currentChapterVo.getPassConditionType() == r.passConditionType.dropOut) {
                        switch (e.tag) {
                        case r.colliderTag.cutYellow:
                        case r.colliderTag.cuttGreen:
                            e.tag = 10001;
                            var o = e.body.getMass();
                            c.SplitData.getInstance().addPassProgress(o),
                            i.GameData.getInstance().setIsRefreshTopUi(!0)
                        }
                        c.SplitData.getInstance().removeCrumb(this.node),
                        this.node.destroy()
                    } else if (a.tag == r.colliderTag.star) {
                        var n = a.node.getComponent("Star");
                        this.eatStar(n)
                    } else if (a.tag == r.colliderTag.yellowStar) switch (e.tag) {
                    case r.colliderTag.neglectYellow:
                    case r.colliderTag.cutYellow:
                        n = a.node.getComponent("Star");
                        this.eatStar(n)
                    } else if (a.tag == r.colliderTag.blackstar && e.tag == r.colliderTag.neglectblack) {
                        n = a.node.getComponent("Star");
                        this.eatStar(n)
                    } else if (a.tag == r.colliderTag.starGreen) switch (e.tag) {
                    case r.colliderTag.cuttGreen:
                        n = a.node.getComponent("Star");
                        this.eatStar(n)
                    } else if (a.tag == r.colliderTag.starRed) switch (e.tag) {
                    case r.colliderTag.nelectRed:
                    case r.colliderTag.cutRed:
                        n = a.node.getComponent("Star");
                        this.eatStar(n)
                    }
                },
                e.prototype.eatStar = function (t) {
                    t.isDeath || (cc.find("Canvas").getComponent("SoundManage").playEatStar(), t.disappearAction(), c.SplitData.getInstance().addPassProgress(1), i.GameData.getInstance().setIsRefreshTopUi(!0))
                },
                e = __decorate([s], e)
            }(cc.Component));
        a.Collider = p,
        cc._RF.pop()
    },
    {
        "../../data/ChapterData": "ChapterData",
        "../../data/GameData": "GameData",
        "../../data/SplitData": "SplitData",
        "../../enum/GameEnum": "GameEnum"
    }],
    Draw: [function (t, e, a) {
        "use strict";
        cc._RF.push(e, "58e87PbvvFFX4uRC6XXcNrs", "Draw"),
        Object.defineProperty(a, "__esModule", {
            value: !0
        });
        var o = t("../../utils/GlobalFun"),
            n = t("../../enum/GameEnum"),
            i = t("../../data/GameData"),
            r = cc._decorator,
            c = r.ccclass,
            s = (r.property, function (e) {
                function t() {
                    var t = null !== e && e.apply(this, arguments) || this;
                    return t.ctx = null,
                    t
                }
                return __extends(t, e),
                t.prototype.onLoad = function () {
                    cc.view.enableAntiAlias(!0),
                    this.createGraphics()
                },
                t.prototype.start = function () {
                    this.draw()
                },
                t.prototype.update = function (t) {},
                t.prototype.createGraphics = function () {
                    this.ctx = this.node.addComponent(cc.Graphics),
                    this.ctx.lineWidth = 2
                },
                t.prototype.draw = function () {
                    this.node.getComponent("cc.PhysicsBoxCollider") && this.drawBox();
                    var t = this.node.getComponent("cc.PhysicsPolygonCollider");
                    if (t) switch (this.ctx.fillColor = o.GlobalFun.getRigidBodyColorByTag(t.tag), t.tag) {
                    case n.colliderTag.neglectYellow:
                    case n.colliderTag.nelectRed:
                        this.ctx.fillColor = o.GlobalFun.getRigidBodyColorByTag(t.tag),
                        this.ctx.strokeColor = cc.color(40, 40, 40, 255),
                        this.ctx.lineWidth = 4,
                        this.outlinePolygon(t.points);
                        break;
                    case n.colliderTag.cutYellow:
                    case n.colliderTag.cuttGreen:
                        i.GameData.getInstance().setIsRefreshTopUi(!0),
                        this.drawPolygon(t.points);
                        break;
                    default:
                        this.drawPolygon(t.points)
                    }
                    if (t = this.node.getComponent("cc.PhysicsCircleCollider")) {
                        if (t.tag == n.colliderTag.jointPoint) t.node.zIndex = 10;
                        else if (t.tag == n.colliderTag.neglectBlue) return this.ctx.lineWidth = 4,
                        this.ctx.strokeColor = cc.color(40, 40, 40, 255),
                        this.ctx.fillColor = o.GlobalFun.getRigidBodyColorByTag(t.tag),
                        void this.drawCircle(t.radius, cc.v2(0, 0), !0);
                        this.ctx.fillColor = o.GlobalFun.getRigidBodyColorByTag(t.tag),
                        this.drawCircle(t.radius, cc.v2(0, 0))
                    }
                },
                t.prototype.drawBox = function () {},
                t.prototype.outlinePolygon = function (t) {
                    this.ctx.clear(),
                    this.ctx.moveTo(t[0].x, t[0].y);
                    for (var e = 1;
                    e < t.length;
                    e++) this.ctx.lineTo(t[e].x, t[e].y);
                    this.ctx.lineTo(t[0].x, t[0].y),
                    this.ctx.fill(),
                    this.ctx.stroke()
                },
                t.prototype.drawPolygon = function (t) {
                    this.ctx.clear(),
                    this.ctx.moveTo(t[0].x, t[0].y);
                    for (var e = 1;
                    e < t.length;
                    e++) this.ctx.lineTo(t[e].x, t[e].y);
                    this.ctx.fill()
                },
                t.prototype.drawCircle = function (t, e, a) {
                    this.ctx.clear(),
                    this.ctx.moveTo(e.x, e.y),
                    this.ctx.circle(e.x, e.y, t),
                    this.ctx.fill(),
                    a && this.ctx.stroke()
                },
                t = __decorate([c], t)
            }(cc.Component));
        a.Draw = s,
        cc._RF.pop()
    },
    {
        "../../data/GameData": "GameData",
        "../../enum/GameEnum": "GameEnum",
        "../../utils/GlobalFun": "GlobalFun"
    }],
    DropCrumb: [function (t, e, a) {
        "use strict";
        cc._RF.push(e, "c0f88a9bfJCmLOgo5/C45hD", "DropCrumb"),
        Object.defineProperty(a, "__esModule", {
            value: !0
        });
        var n = t("../../data/ChapterData"),
            i = t("../../utils/GlobalFun"),
            o = cc._decorator,
            r = o.ccclass,
            c = (o.property, function (t) {
                function e() {
                    return null !== t && t.apply(this, arguments) || this
                }
                return __extends(e, t),
                e.prototype.onLoad = function () {},
                e.prototype.start = function () {
                    var t = n.ChapterData.getInstance().getCurrentVo(),
                        e = this.node.getComponent(cc.RigidBody).getMass(),
                        a = this.node.getComponent("cc.PhysicsCollider"),
                        o = i.GlobalFun.getRigidBodyColorByTag(a.tag);
                    t.setDropColor(o),
                    t && t.addMass(e)
                },
                e = __decorate([r], e)
            }(cc.Component));
        a.DropCrumb = c,
        cc._RF.pop()
    },
    {
        "../../data/ChapterData": "ChapterData",
        "../../utils/GlobalFun": "GlobalFun"
    }],
    GameData: [function (t, e, a) {
        "use strict";
        cc._RF.push(e, "a738enHxiRBYotxjf6UZESs", "GameData"),
        Object.defineProperty(a, "__esModule", {
            value: !0
        });
        var o = function () {
            function t() {
                this.currentChapterName = "",
                this.isRefreshTopUi = !1,
                this.isLoadJsonFinish = !1,
                this.isClearCrumb = !1,
                this.isAllowSplit = !0,
                this.mus_off_on = !0,
                this.openSeting = !1,
                this.setCurrentChapterName("menu")
            }
            return t.getInstance = function () {
                return t.instance
            },
            t.prototype.setCurrentChapterName = function (t) {
                this.currentChapterName = t
            },
            t.prototype.getCurrentChapterName = function () {
                return this.currentChapterName
            },
            t.prototype.setIsRefreshTopUi = function (t) {
                this.isRefreshTopUi = t
            },
            t.prototype.getIsRefreshTopUi = function () {
                return this.isRefreshTopUi
            },
            t.prototype.setIsLoadJsonFinish = function (t) {
                this.isLoadJsonFinish = t
            },
            t.prototype.getIsLoadJsonFinish = function () {
                return this.isLoadJsonFinish
            },
            t.prototype.setIsClearCrumb = function (t) {
                this.isClearCrumb = t
            },
            t.prototype.getIsClearCrumb = function () {
                return this.isClearCrumb
            },
            t.instance = new t,
            t
        }();
        a.GameData = o,
        cc._RF.pop()
    },
    {}],
    GameEnum: [function (t, e, a) {
        "use strict";
        var o, n, i, r;
        cc._RF.push(e, "7b2c9A73OZGtLH3MpPoiR63", "GameEnum"),
        Object.defineProperty(a, "__esModule", {
            value: !0
        }),
        (o = a.oldObjectRules || (a.oldObjectRules = {}))[o.maxY = 1] = "maxY",
        o[o.miniY = 2] = "miniY",
        o[o.angleNum = 3] = "angleNum",
        (n = a.colliderTag || (a.colliderTag = {}))[n.AntiGravity = 100] = "AntiGravity",
        n[n.cutYellow = 10] = "cutYellow",
        n[n.neglectYellow = 500] = "neglectYellow",
        n[n.nelectRed = 530] = "nelectRed",
        n[n.cuttGreen = 1] = "cuttGreen",
        n[n.cutRed = 2] = "cutRed",
        n[n.cut = 0] = "cut",
        n[n.starGreen = 101] = "starGreen",
        n[n.yellowStar = 501] = "yellowStar",
        n[n.starRed = 531] = "starRed",
        n[n.star = 8] = "star",
        n[n.jointPoint = 1e3] = "jointPoint",
        n[n.neglect = 200] = "neglect",
        n[n.botton = 1e4] = "botton",
        n[n.moveStar = 9] = "moveStar",
        n[n.neglectblack = 510] = "neglectblack",
        n[n.blackstar = 511] = "blackstar",
        n[n.neglectBlue = 520] = "neglectBlue",
        (i = a.passConditionType || (a.passConditionType = {}))[i.star = 1] = "star",
        i[i.dropOut = 2] = "dropOut",
        (r = a.btnTag || (a.btnTag = {})).demo = "0",
        r.skip = "1",
        r.reStart = "2",
        r.back = "3",
        r.next = "4",
        r.play = "5",
        r.seting = "6",
        cc._RF.pop()
    },
    {}],
    GlobalFun: [function (t, e, a) {
        "use strict";
        cc._RF.push(e, "76ab8RpFGlGcLg0xtMlBIOt", "GlobalFun"),
        Object.defineProperty(a, "__esModule", {
            value: !0
        });
        var o = t("../enum/GameEnum"),
            n = function () {
                function t() {}
                return t.getRigidBodyColorByTag = function (t) {
                    return t == o.colliderTag.cut || t == o.colliderTag.neglectBlue ? cc.color(110, 184, 255, 255) : t == o.colliderTag.neglect ? cc.color(40, 40, 40, 255) : t == o.colliderTag.star ? cc.color(110, 184, 255, 255) : t == o.colliderTag.jointPoint ? cc.color(255, 255, 255, 255) : t == o.colliderTag.neglectYellow || t == o.colliderTag.cutYellow ? cc.color(255, 214, 94, 255) : t == o.colliderTag.neglectblack ? cc.color(0, 0, 0, 255) : t == o.colliderTag.cuttGreen ? cc.color(186, 255, 203, 255) : t == o.colliderTag.nelectRed || t == o.colliderTag.cutRed ? cc.color(255, 107, 107, 255) : cc.color(110, 184, 255, 255)
                },
                t.getAngle = function (t, e) {
                    var a = e.x - t.x,
                        o = (t.y - e.y) / a,
                        n = 180 / 3.1415926 * Math.atan(o);
                    return e.x < t.x && (n -= 180),
                    n
                },
                t.getDistance = function (t, e) {
                    return Math.sqrt(Math.pow(t.x - e.x, 2) + Math.pow(t.y - e.y, 2))
                },
                t
            }();
        a.GlobalFun = n,
        cc._RF.pop()
    },
    {
        "../enum/GameEnum": "GameEnum"
    }],
    LeftRight: [function (t, e, a) {
        "use strict";
        cc._RF.push(e, "4041dJaJu1NEbL4vdyxEprT", "LeftRight"),
        Object.defineProperty(a, "__esModule", {
            value: !0
        });
        var o = cc._decorator,
            n = o.ccclass,
            i = o.property,
            r = function (e) {
                function t() {
                    var t = null !== e && e.apply(this, arguments) || this;
                    return t.face = 0,
                    t
                }
                return __extends(t, e),
                t.prototype.onLoad = function () {
                    this.body = this.node.getComponent(cc.RigidBody)
                },
                t.prototype.update = function () {},
                t.prototype.start = function () {},
                t.prototype.setFace = function (t) {
                    this.face = t
                },
                t.prototype.getFace = function () {
                    return this.face
                },
                t.prototype.createMoter = function () {
                    var t = new cc.Node;
                    t.name = "motor",
                    t.position = cc.v2(400 * this.face, this.node.position.y),
                    t.parent = this.node.parent,
                    t.addComponent(cc.RigidBody).type = cc.RigidBodyType.Static;
                    var e = t.addComponent(cc.MotorJoint);
                    e.connectedBody = this.body,
                    e.maxForce = 5 * this.body.getMass(),
                    e.linearOffset = cc.v2(1e3 * this.face, 0),
                    e.apply(),
                    this.node.getComponent("cc.PhysicsPolygonCollider").apply()
                },
                __decorate([i(cc.Integer)], t.prototype, "face", void 0),
                t = __decorate([n], t)
            }(cc.Component);
        a.
    default = r,
        cc._RF.pop()
    },
    {}],
    Mask: [function (t, e, a) {
        "use strict";
        cc._RF.push(e, "09042OaijRDc4PWwLoHF+dP", "Mask"),
        Object.defineProperty(a, "__esModule", {
            value: !0
        });
        var o = cc._decorator,
            n = o.ccclass,
            i = (o.property, function (e) {
                function t() {
                    var t = null !== e && e.apply(this, arguments) || this;
                    return t.ctx = null,
                    t
                }
                return __extends(t, e),
                t.prototype.onLoad = function () {
                    cc.view.enableAntiAlias(!0),
                    cc.director.getPhysicsManager().enabled = !0,
                    this.createGraphics()
                },
                t.prototype.start = function () {},
                t.prototype.update = function (t) {},
                t.prototype.createGraphics = function () {
                    this.ctx = this.node.addComponent(cc.Graphics),
                    this.ctx.lineWidth = 2,
                    this.ctx.fillColor = cc.color(250, 250, 250, 255)
                },
                t.prototype.draw = function (t) {
                    this.ctx.clear(),
                    this.ctx.moveTo(t[0].x, t[0].y);
                    for (var e = 1;
                    e < t.length;
                    e++) this.ctx.lineTo(t[e].x, t[e].y);
                    this.ctx.fill()
                },
                t = __decorate([n], t)
            }(cc.Component));
        a.
    default = i,
        cc._RF.pop()
    },
    {}],
    MenuUi: [function (t, e, a) {
        "use strict";
        cc._RF.push(e, "1a603FguKtAkY6h/SLNwkK6", "MenuUi"),
        Object.defineProperty(a, "__esModule", {
            value: !0
        });
        var o = t("../../data/RoleData"),
            n = cc._decorator,
            i = n.ccclass,
            r = (n.property, function (e) {
                function t() {
                    var t = null !== e && e.apply(this, arguments) || this;
                    return t.totalStar_label = null,
                    t.chapterNum_label = null,
                    t
                }
                return __extends(t, e),
                t.prototype.onLoad = function () {
                    this.totalStar_label = this.node.getChildByName("starTotal_lable").getComponent(cc.RichText),
                    this.chapterNum_label = this.node.getChildByName("richtext").getComponent(cc.RichText)
                },
                t.prototype.refresh = function () {
                    var t = o.RoleData.getInstance().getTotalStar(),
                        e = o.RoleData.getInstance().getUnlockChapterNum(),
                        a = o.RoleData.getInstance().getChapterObjs().length;
                    this.totalStar_label.string = "X" + t,
                    this.chapterNum_label.string = a + "/" + e
                },
                t = __decorate([i], t)
            }(cc.Component));
        a.
    default = r,
        cc._RF.pop()
    },
    {
        "../../data/RoleData": "RoleData"
    }],
    Motor: [function (t, e, a) {
        "use strict";
        cc._RF.push(e, "78b5djC0M1MlKN8XIdogPdN", "Motor"),
        Object.defineProperty(a, "__esModule", {
            value: !0
        });
        var o = t("../data/SplitData"),
            n = cc._decorator,
            i = n.ccclass,
            r = (n.property, function (e) {
                function t() {
                    var t = null !== e && e.apply(this, arguments) || this;
                    return t.rigidBody = null,
                    t.motorJoint = null,
                    t.connectedBody = null,
                    t.gameData = null,
                    t
                }
                return __extends(t, e),
                t.prototype.onLoad = function () {
                    this.rigidBody = this.node.getComponent(cc.RigidBody),
                    this.motorJoint = this.node.getComponent(cc.MotorJoint),
                    this.connectedBody = this.motorJoint.connectedBody,
                    this.gameData = o.SplitData.getInstance()
                },
                t.prototype.start = function () {
                    var t = this.connectedBody.getMass();
                    console.log(t)
                },
                t.prototype.update = function (t) {
                    this.gameData.getIsSplitFinish() && (this.gameData.setIsSplitFinish(!0), this.refreshCrumb())
                },
                t.prototype.refreshCrumb = function () {
                    for (var t = 0, e = this.gameData.getSplitColliders();
                    t < e.length;
                    t++) {
                        var a = e[t];
                        a.body.type = cc.RigidBodyType.Dynamic,
                        a.apply()
                    }
                    this.gameData.clearSplit()
                },
                t = __decorate([i], t)
            }(cc.Component));
        a.
    default = r,
        cc._RF.pop()
    },
    {
        "../data/SplitData": "SplitData"
    }],
    MusicControl: [function (t, e, a) {
        "use strict";
        cc._RF.push(e, "8f7b5qIMpVKg7x91tsYCwRD", "MusicControl"),
        Object.defineProperty(a, "__esModule", {
            value: !0
        });
        var o, n = cc._decorator,
            i = n.ccclass,
            r = (n.property, function (e) {
                function t() {
                    var t = null !== e && e.apply(this, arguments) || this;
                    return t._musicSource = null,
                    t
                }
                return __extends(t, e),
                t.prototype.onLoad = function () {
                    this._musicSource = this.node.getComponents(cc.AudioSource)
                },
                t.prototype.musicOn = function () {
                    this._musicSource.forEach(function (t) {
                        t.enabled = !0
                    })
                },
                t.prototype.musicOff = function () {
                    this._musicSource.forEach(function (t) {
                        t.enabled = !1
                    })
                },
                t.prototype.play = function (t) {
                    var e = this._musicSource[t];
                    null != e && e.enabled && e.play()
                },
                t = __decorate([i], t)
            }(cc.Component));
        a.
    default = r,
        (o = a.MusicType || (a.MusicType = {}))[o.play = 0] = "play",
        o[o.type2 = 1] = "type2",
        o[o.type3 = 2] = "type3",
        o[o.type4 = 3] = "type4",
        o[o.type5 = 4] = "type5",
        cc._RF.pop()
    },
    {}],
    RoleData: [function (t, e, a) {
        "use strict";
        cc._RF.push(e, "7b8d5ywaMxFepB2YfItMr+1", "RoleData"),
        Object.defineProperty(a, "__esModule", {
            value: !0
        });
        var o = function () {
            function t() {
                this.unlockChapterNum = 0,
                this.init()
            }
            return t.getInstance = function () {
                return t.instance
            },
            t.prototype.init = function () {
                var t = JSON.stringify({
                    unlockChapterNum: 50,
                    chapter: [{
                        name: "chapter1",
                        star: 1
                    }]
                }),
                    e = JSON.parse(t).chapter;
                this.chapterObjs = e,
                this.unlockChapterNum = JSON.parse(t).unlockChapterNum
            },
            t.prototype.getChapterObjs = function () {
                return this.chapterObjs
            },
            t.prototype.getTotalStar = function () {
                for (var t = 0, e = 0, a = this.chapterObjs;
                e < a.length;
                e++) {
                    t += a[e].star
                }
                return t
            },
            t.prototype.getChapterObjByName = function (t) {
                for (var e = 0, a = this.chapterObjs;
                e < a.length;
                e++) {
                    var o = a[e];
                    if (o.name == t) return o
                }
                return null
            },
            t.prototype.addChapterObj = function (t) {
                for (var e = !1, a = 0;
                a < this.chapterObjs.length;
                a++) if (t.name == this.chapterObjs[a].name && (e = !0, t.star > this.chapterObjs[a].star)) return void(this.chapterObjs[a] = t);
                e || (this.chapterObjs[this.chapterObjs.length] = t)
            },
            t.prototype.setUnlockChapterNum = function (t) {
                this.unlockChapterNum = t
            },
            t.prototype.getUnlockChapterNum = function () {
                return this.unlockChapterNum
            },
            t.prototype.addUnlockChapterNum = function (t) {
                this.unlockChapterNum += t || 4
            },
            t.prototype.toJson = function () {
                var t = {
                    unlockChapterNum: null,
                    chapter: null
                };
                return t.unlockChapterNum = this.unlockChapterNum,
                t.chapter = this.chapterObjs,
                JSON.stringify(t)
            },
            t.instance = new t,
            t
        }();
        a.RoleData = o,
        cc._RF.pop()
    },
    {}],
    ScrollView: [function (t, e, a) {
        "use strict";
        cc._RF.push(e, "12356Y6xkFNFoExgovXOVSk", "ScrollView"),
        Object.defineProperty(a, "__esModule", {
            value: !0
        });
        var o = t("../data/ChapterData"),
            n = t("../data/GameData"),
            i = t("../data/RoleData"),
            r = cc._decorator,
            c = r.ccclass,
            s = r.property,
            p = function (e) {
                function t() {
                    var t = null !== e && e.apply(this, arguments) || this;
                    return t.itemPrefab = null,
                    t.canvas = null,
                    t.itemVos = null,
                    t
                }
                return __extends(t, e),
                t.prototype.onLoad = function () {
                    this.content = this.node.getComponent(cc.ScrollView).content,
                    this.gameData = n.GameData.getInstance(),
                    this.roleData = i.RoleData.getInstance()
                },
                t.prototype.start = function () {
                    this.initData(),
                    this.initView(),
                    this.createItem()
                },
                t.prototype.update = function (t) {
                    this.gameData.getIsLoadJsonFinish() && (this.gameData.setIsLoadJsonFinish(!1), this.initData(), this.initView(), this.createItem())
                },
                t.prototype.initData = function () {
                    this.itemVos = o.ChapterData.getInstance().getVos()
                },
                t.prototype.initView = function () {
                    var t = this.itemVos.length,
                        e = this.roleData.getUnlockChapterNum();
                    e < t && (t = e),
                    this.itemNum = t;
                    var a = 150 * Math.ceil((t + 4) / 4);
                    this.content.height = a
                },
                t.prototype.createItem = function () {
                    for (var t = 0;
                    t < this.itemNum + 4;
                    t++) {
                        if (t >= this.itemVos.length) return;
                        var e = cc.instantiate(this.itemPrefab);
                        t >= this.itemNum && (e.getComponent(cc.Button).interactable = !1),
                        e.getComponent("ChapterItem").init(this.itemVos[t]);
                        var a = 140 * (t % 4) + 70 + 100,
                            o = -(150 * Math.floor(t / 4) + 75);
                        e.position = cc.v2(a, o),
                        this.content.addChild(e)
                    }
                },
                t.prototype.refresh = function () {
                    for (var t = 0, e = this.content.children;
                    t < e.length;
                    t++) {
                        e[t].destroy()
                    }
                    this.initData(),
                    this.initView(),
                    this.createItem()
                },
                __decorate([s(cc.Prefab)], t.prototype, "itemPrefab", void 0),
                __decorate([s(cc.Node)], t.prototype, "canvas", void 0),
                t = __decorate([c], t)
            }(cc.Component);
        a.
    default = p,
        cc._RF.pop()
    },
    {
        "../data/ChapterData": "ChapterData",
        "../data/GameData": "GameData",
        "../data/RoleData": "RoleData"
    }],
    Seting: [function (t, e, a) {
        "use strict";
        cc._RF.push(e, "e63082i2w1MQKW3ikcEXwLo", "Seting"),
        Object.defineProperty(a, "__esModule", {
            value: !0
        });
        var o = t("../../data/GameData"),
            n = t("../manage/SoundManage"),
            i = cc._decorator,
            r = i.ccclass,
            c = i.property,
            s = function (e) {
                function t() {
                    var t = null !== e && e.apply(this, arguments) || this;
                    return t.mus_btnSpriteFrames = [],
                    t.soundManage = null,
                    t.gameData = null,
                    t.setOnOff = !1,
                    t.musOnOff = !0,
                    t
                }
                return __extends(t, e),
                t.prototype.onLoad = function () {
                    this.gameData = o.GameData.getInstance(),
                    this.chanageMusSF(),
                    this.addListener()
                },
                t.prototype.update = function () {
                    this.gameData.openSeting != this.setOnOff && (this.onOffSeting(this.gameData.openSeting), this.setOnOff = this.gameData.openSeting)
                },
                t.prototype.setCallback = function (t) {
                    this.gameData.openSeting = !0
                },
                t.prototype.musCallback = function () {
                    this.chanageMusSF(),
                    this.soundManage.playOnOffNusic()
                },
                t.prototype.onTouchStart = function () {
                    o.GameData.getInstance().openSeting = !1
                },
                t.prototype.addListener = function () {
                    this.node.getChildByName("mus_on").on(cc.Node.EventType.TOUCH_START, this.musCallback, this),
                    cc.find("Canvas").on(cc.Node.EventType.TOUCH_START, this.onTouchStart, this)
                },
                t.prototype.onOffSeting = function (t) {
                    var e = t ? 1 : -1,
                        a = this.node.getChildByName("mus_on");
                    t && (a.active = !0);
                    var o = cc.moveBy(.3, cc.v2(0, -100 * e)),
                        n = cc.callFunc(function () {
                            t || (a.active = !1)
                        }),
                        i = cc.sequence(o, n);
                    a.runAction(i)
                },
                t.prototype.chanageMusSF = function () {
                    var t = this.node.getChildByName("mus_on");
                    this.musOnOff ? (t.getComponent(cc.Sprite).spriteFrame = this.mus_btnSpriteFrames[0], o.GameData.getInstance().mus_off_on = !0, this.musOnOff = !1) : (t.getComponent(cc.Sprite).spriteFrame = this.mus_btnSpriteFrames[1], o.GameData.getInstance().mus_off_on = !1, this.musOnOff = !0)
                },
                __decorate([c([cc.SpriteFrame])], t.prototype, "mus_btnSpriteFrames", void 0),
                __decorate([c(n.
            default)], t.prototype, "soundManage", void 0),
                t = __decorate([r], t)
            }(cc.Component);
        a.
    default = s,
        cc._RF.pop()
    },
    {
        "../../data/GameData": "GameData",
        "../manage/SoundManage": "SoundManage"
    }],
    SoundManage: [function (t, e, a) {
        "use strict";
        cc._RF.push(e, "b42c9u/JrpLqrkxNrHdGGfY", "SoundManage"),
        Object.defineProperty(a, "__esModule", {
            value: !0
        });
        var o = t("../../data/GameData"),
            n = cc._decorator,
            i = n.ccclass,
            r = n.property,
            c = function (e) {
                function t() {
                    var t = null !== e && e.apply(this, arguments) || this;
                    return t.bgm = null,
                    t.eatStar = null,
                    t.onOffMus = null,
                    t.bgmId = null,
                    t.bgmState = !1,
                    t.gameData = null,
                    t
                }
                return __extends(t, e),
                t.prototype.onLoad = function () {
                    this.gameData = o.GameData.getInstance()
                },
                t.prototype.update = function () {
                    this.gameData.mus_off_on != this.bgmState && this.BgmOnOff(this.gameData.mus_off_on)
                },
                t.prototype.BgmOnOff = function (t) {
                    t ? (this.bgmId = cc.audioEngine.play(this.bgm, !0, 1), this.bgmState = !0) : (cc.audioEngine.stop(this.bgmId), this.bgmState = !1)
                },
                t.prototype.playEatStar = function () {
                    this.gameData.mus_off_on && cc.audioEngine.play(this.eatStar, !1, 1)
                },
                t.prototype.playOnOffNusic = function () {
                    this.gameData.mus_off_on && cc.audioEngine.play(this.onOffMus, !1, 1)
                },
                __decorate([r(cc.AudioClip)], t.prototype, "bgm", void 0),
                __decorate([r(cc.AudioClip)], t.prototype, "eatStar", void 0),
                __decorate([r(cc.AudioClip)], t.prototype, "onOffMus", void 0),
                t = __decorate([i], t)
            }(cc.Component);
        a.
    default = c,
        cc._RF.pop()
    },
    {
        "../../data/GameData": "GameData"
    }],
    SplitData: [function (t, e, a) {
        "use strict";
        cc._RF.push(e, "09ae91xbnlL15p/9EoxY5IC", "SplitData"),
        Object.defineProperty(a, "__esModule", {
            value: !0
        });
        var o = function () {
            function t() {
                this.splitColliders = [],
                this.splitPoints = [],
                this.splitNum = 0,
                this.passProgress = 0,
                this.helpLines = [],
                this.allCrumb = []
            }
            return t.getInstance = function () {
                return t.instance
            },
            t.prototype.setIsSplitFinish = function (t) {
                this.isSplitFinish = t
            },
            t.prototype.getIsSplitFinish = function () {
                return this.isSplitFinish
            },
            t.prototype.addSplitCollider = function (t) {
                this.splitColliders[this.splitColliders.length] = t
            },
            t.prototype.getSplitColliders = function () {
                return this.splitColliders
            },
            t.prototype.clearSplitNodes = function () {
                this.splitColliders = []
            },
            t.prototype.addSplitPoint = function (t) {
                this.splitPoints[this.splitPoints.length] = t
            },
            t.prototype.getSplitPoints = function () {
                return this.splitPoints
            },
            t.prototype.clearSplit = function () {
                this.splitColliders = [],
                this.splitPoints = []
            },
            t.prototype.setSplitNum = function (t) {
                this.splitNum = t
            },
            t.prototype.getSplitNum = function () {
                return this.splitNum
            },
            t.prototype.addSplitNum = function () {
                this.splitNum++
            },
            t.prototype.setPassProgress = function (t) {
                this.passProgress = t
            },
            t.prototype.getPassProgress = function () {
                return this.passProgress
            },
            t.prototype.addPassProgress = function (t) {
                this.passProgress += t
            },
            t.prototype.clearSplitInfo = function () {
                this.splitNum = 0,
                this.passProgress = 0
            },
            t.prototype.addHelpLine = function (t) {
                this.helpLines[this.helpLines.length] = t
            },
            t.prototype.removeHelpLint = function () {
                for (var t = 0, e = this.helpLines;
                t < e.length;
                t++) {
                    e[t].destroy()
                }
                this.helpLines = []
            },
            t.prototype.addCrumb = function (t) {
                this.allCrumb[this.allCrumb.length] = t
            },
            t.prototype.removeAllCrumb = function () {
                for (var t = 0, e = this.allCrumb;
                t < e.length;
                t++) {
                    e[t].destroy()
                }
                this.allCrumb = []
            },
            t.prototype.removeCrumb = function (t) {
                for (var e = 0;
                e < this.allCrumb.length;
                e++) this.allCrumb[e] == t && this.allCrumb.splice(e, 1)
            },
            t.instance = new t,
            t
        }();
        a.SplitData = o,
        cc._RF.pop()
    },
    {}],
    Split: [function (t, e, a) {
        "use strict";
        cc._RF.push(e, "fe435wOqnpO4ohjMWlau/CV", "Split"),
        Object.defineProperty(a, "__esModule", {
            value: !0
        });
        var o = t("../../data/SplitData"),
            b = t("../../enum/GameEnum"),
            n = t("../ui/TopUi"),
            i = t("../../data/ChapterData"),
            r = t("../../data/GameData"),
            c = cc._decorator,
            s = c.ccclass,
            p = c.property,
            l = .1;

        function x(t, e) {
                return t.fraction > e.fraction ? 1 : t.fraction < e.fraction ? -1 : 0
            }

        function u(t, e, a) {
                return a = void 0 === a ? l : a,
                Math.abs(t - e) < a
            }

        function R(t) {
                for (var e = 0, a = 0, o = t;
                a < o.length;
                a++) {
                    var n = o[a];
                    n.y > e && (e = n.y)
                }
                return e
            }

        function P(t) {
                for (var e = 0, a = 0, o = t;
                a < o.length;
                a++) {
                    var n = o[a];
                    n.y < e && (e = n.y)
                }
                return e
            }
        var h = function (e) {
                function t() {
                    var t = null !== e && e.apply(this, arguments) || this;
                    return t.touching = !1,
                    t.topUiScript = null,
                    t.isShowHideUi = !1,
                    t.oldObjectRule = 0,
                    t.splitData = null,
                    t
                }
                return __extends(t, e),
                t.prototype.onLoad = function () {
                    this.ctx = this.getComponent(cc.Graphics),
                    this.addEventListener(),
                    this.splitData = o.SplitData.getInstance()
                },
                t.prototype.update = function () {},
                t.prototype.addEventListener = function () {
                    var t = cc.find("Canvas");
                    t.on(cc.Node.EventType.TOUCH_START, this.onTouchStart, this),
                    t.on(cc.Node.EventType.TOUCH_END, this.onTouchEnd, this),
                    t.on(cc.Node.EventType.TOUCH_MOVE, this.onTouchMove, this),
                    t.on(cc.Node.EventType.TOUCH_CANCEL, this.onCancell, this)
                },
                t.prototype.onTouchStart = function (t) {
                    (i.ChapterData.getInstance().getCurrentVo().getType() == b.passConditionType.dropOut && 0 == this.isShowHideUi && (this.isShowHideUi = !0), this.touchStartPoint = cc.v2(t.getLocation()), r.GameData.getInstance().isAllowSplit) && (10 <= o.SplitData.getInstance().getSplitNum() || (this.touching = !0, o.SplitData.getInstance().removeHelpLint()))
                },
                t.prototype.onTouchMove = function (t) {
                    if (this.touching && (this.touchPoint = cc.v2(t.getLocation()), this.recalcResults()), this.isShowHideUi && !this.topUiScript.isShowHideUi) {
                        var e = t.getLocation();
                        (e.x > this.touchStartPoint.x + 10 || e.x < this.touchStartPoint.x - 10 || e.y > this.touchStartPoint.y + 10 || e.y < this.touchStartPoint.y - 10) && (this.isShowHideUi = !1)
                    }
                },
                t.prototype.onTouchEnd = function (t) {
                    if (this.isShowHideUi && !this.topUiScript.isShowHideUi && this.topUiScript.showHideUi(this), this.touching) {
                        if (this.touchPoint = cc.v2(t.getLocation()), this.recalcResults(), this.touching = !1, this.r1) {
                            var e = cc.v2(t.touch.getLocation());
                            if (u(this.touchStartPoint.sub(e).magSqr(), 0)) return;
                            this.splitRigidBody()
                        }
                        this.ctx.clear()
                    }
                },
                t.prototype.onCancell = function (t) {
                    if (this.isShowHideUi && !this.topUiScript.isShowHideUi && this.topUiScript.showHideUi(this), this.touching) {
                        if (this.touchPoint = cc.v2(t.getLocation()), this.recalcResults(), this.touching = !1, this.r1) {
                            var e = cc.v2(t.touch.getLocation());
                            if (u(this.touchStartPoint.sub(e).magSqr(), 0)) return;
                            this.splitRigidBody()
                        }
                        this.ctx.clear()
                    }
                },
                t.prototype.recalcResults = function () {
                    if (this.touching) {
                        this.ctx.clear(),
                        this.ctx.moveTo(this.touchStartPoint.x, this.touchStartPoint.y),
                        this.ctx.lineTo(this.touchPoint.x, this.touchPoint.y),
                        this.ctx.stroke();
                        for (var t = cc.director.getPhysicsManager(), e = t.rayCast(this.touchStartPoint, this.touchPoint, cc.RayCastType.All), 
                        a = t.rayCast(this.touchPoint, this.touchStartPoint, cc.RayCastType.All), o = e.concat(a), n = 0, i = e;
                        n < i.length;
                        n++) {
                            if (i[n].collider.tag == b.colliderTag.jointPoint) return this.r1 = null,
                            this.r2 = null,
                            void(this.results = null)
                        }
                        for (var r = 0;
                        r < o.length;
                        r++) {
                            var c = o[r].point;
                            this.ctx.circle(c.x, c.y, 5)
                        }
                        this.ctx.fill(),
                        this.r1 = e,
                        this.r2 = a,
                        this.results = o
                    }
                },
                t.prototype.splitRigidBody = function () {
                    for (var t = 0;
                    t < this.r1.length;) 200 <= this.r1[t].collider.tag ? this.r1.splice(t, 1) : t++;
                    for (t = 0;
                    t < this.r2.length;) 200 <= this.r2[t].collider.tag ? this.r2.splice(t, 1) : t++;
                    for (t = 0;
                    t < this.results.length;) 200 <= this.results[t].collider.tag ? this.results.splice(t, 1) : t++;
                    var e = 0;
                    this.r2.forEach(function (t) {
                        t.fraction = 1 - t.fraction
                    });
                    for (var r = this.results, c = [], a = function (t) {
                        for (var e = !1, a = r[t], o = 0;
                        o < c.length;
                        o++) {
                            var n = c[o];
                            if (n[0] && a.collider === n[0].collider) {
                                e = !0;
                                var i = n.find(function (t) {
                                    return t.point.sub(a.point).magSqr() <= 5
                                });
                                i ? n.splice(n.indexOf(i), 1) : n.push(a);
                                break
                            }
                        }
                        e || c.push([a])
                    }, o = 0;
                    o < r.length;
                    o++) a(o);
                    for (var n = 0;
                    n < c.length;
                    n++) {
                        var i = c[n];
                        if (!(i.length < 2)) {
                            i = i.sort(x);
                            for (var s = [], p = 0;
                            p < i.length - 1;
                            p += 2) {
                                var l = i[p],
                                    u = i[p + 1];
                                l && u && this.split(l.collider, l.point, u.point, s)
                            }
                            if (!(s.length <= 0)) {
                                for (var h = i[0].collider, d = void 0, g = 0;
                                g < s.length;
                                g++) {
                                    for (var f = s[g], m = 0;
                                    m < f.length;
                                    m++)"number" == typeof f[m] && (f[m] = h.points[f[m]]);
                                    this.oldObjectRule && this.oldObjectRule != b.oldObjectRules.angleNum ? this.oldObjectRule == b.oldObjectRules.maxY ? (!d || R(f) > R(d)) && (d && console.log(R(f) + ":" + R(d)), d = f) : this.oldObjectRule == b.oldObjectRules.miniY && (!d || P(f) < P(d)) && (d = f) : (!d || f.length > d.length) && (d = f)
                                }
                                if (!(d.length < 3)) {
                                    h.points = d,
                                    h.node.getComponent("Draw").draw(),
                                    this.splitData.addSplitCollider(h),
                                    this.splitData.addSplitPoint(d),
                                    e++;
                                    var y = h.body;
                                    for (p = 0;
                                    p < s.length;
                                    p++) {
                                        if (!((f = s[p]).length < 3) && f != d) {
                                            var C = y.node.parent,
                                                v = new cc.Node;
                                            v.group = y.node.group,
                                            v.position = C.convertToNodeSpaceAR(y.getWorldPosition(null)),
                                            v.rotation = y.getWorldRotation(),
                                            v.parent = C,
                                            v.zIndex = 0,
                                            v.addComponent("Draw");
                                            var _ = v.addComponent(cc.RigidBody);
                                            _.gravityScale = y.gravityScale,
                                            _.linearVelocity = y.linearVelocity,
                                            _.linearDamping = y.linearDamping;
                                            var D = v.addComponent("cc.PhysicsPolygonCollider");
                                            D.points = f,
                                            D.tag = h.tag,
                                            D.density = h.density,
                                            D.friction = h.friction;
                                            var S = h.getComponent("LeftRight");
                                            if (S) D.node.addComponent("LeftRight").setFace(S.getFace());
                                            this.splitData.addCrumb(v),
                                            this.splitData.addSplitCollider(D),
                                            this.splitData.addSplitPoint(f),
                                            e++
                                        }
                                    }
                                }
                            }
                        }
                    }
                    2 <= e && this.splitData.setIsSplitFinish(!0)
                },
                t.prototype.split = function (t, e, a, o) {
                    var n, i, r = t.body,
                        c = t.points,
                        s = [e = r.getLocalPoint(e, null), a = r.getLocalPoint(a, null)],
                        p = [a, e];
                    if (c) {
                            for (var l = c.length, u = 0;
                            u < l;
                            u++) {
                                var h = c[u],
                                    d = u === l - 1 ? c[0] : c[u + 1];
                                if (!n && this.pointInLine(e, h, d) && (n = u), !i && this.pointInLine(a, h, d) && (i = u), n && i) break
                            }
                            if (null != n && null != i) {
                                var g, f = n,
                                    m = i,
                                    y = o.length;
                                if (0 < y) for (u = 0;
                                    u < y;
                                    u++) {
                                        var C = o[u];
                                        if (f = C.indexOf(n), m = C.indexOf(i), -1 !== f && -1 !== m) {
                                            g = o.splice(u, 1)[0];
                                            break
                                        }
                                    }
                                g || (g = c.map(function (t, e) {
                                        return e
                                    }));
                                for (u = f + 1;
                                    u !== m + 1;
                                    u++) {
                                        u >= g.length && (u = 0),
                                        (v = "number" == typeof(v = g[u]) ? c[v] : v).sub(e).magSqr() < 5 || v.sub(a).magSqr() < 5 || p.push(g[u])
                                    }
                                for (u = m + 1;
                                    u !== f + 1;
                                    u++) {
                                        var v;
                                        u >= g.length && (u = 0),
                                        (v = "number" == typeof(v = g[u]) ? c[v] : v).sub(e).magSqr() < 5 || v.sub(a).magSqr() < 5 || s.push(g[u])
                                    }
                                o.push(s),
                                o.push(p)
                            }
                        } else console.log("目标不是多边形!")
                },
                t.prototype.pointInLine = function (t, e, a) {
                    return cc.Intersection.pointLineDistance(t, e, a, !0) < 1
                },
                t.prototype.setOldObjectRule = function (t) {
                    this.oldObjectRule = t
                },
                __decorate([p(n.TopUi)], t.prototype, "topUiScript", void 0),
                __decorate([p(cc.Integer)], t.prototype, "oldObjectRule", void 0),
                t = __decorate([s], t)
            }(cc.Component);
        a.Split = h,
        cc._RF.pop()
    },
    {
        "../../data/ChapterData": "ChapterData",
        "../../data/GameData": "GameData",
        "../../data/SplitData": "SplitData",
        "../../enum/GameEnum": "GameEnum",
        "../ui/TopUi": "TopUi"
    }],
    Star: [function (t, e, a) {
        "use strict";
        cc._RF.push(e, "23f1575OGtJ1oOo9eokAN3T", "Star"),
        Object.defineProperty(a, "__esModule", {
            value: !0
        });
        var o = cc._decorator,
            n = o.ccclass,
            i = (o.property, function (e) {
                function t() {
                    var t = null !== e && e.apply(this, arguments) || this;
                    return t.angle = 0,
                    t.rotationSpeed = .5,
                    t.isDeath = !1,
                    t
                }
                return __extends(t, e),
                t.prototype.start = function () {},
                t.prototype.update = function (t) {
                    360 < this.angle && (this.angle = 1),
                    this.angle += this.rotationSpeed,
                    this.node.rotation = this.angle
                },
                t.prototype.disappearAction = function () {
                    var t = this;
                    this.isDeath = !0,
                    this.rotationSpeed = 4;
                    var e = cc.scaleTo(.3, 2),
                        a = cc.scaleTo(.5, .2),
                        o = cc.callFunc(function () {
                            t.node.destroy()
                        }),
                        n = cc.sequence(e, a, o);
                    this.node.runAction(n)
                },
                t = __decorate([n], t)
            }(cc.Component));
        a.Star = i,
        cc._RF.pop()
    },
    {}],
    TopUi: [function (t, e, a) {
        "use strict";
        cc._RF.push(e, "269b02+SXFFiI94d94yu86E", "TopUi"),
        Object.defineProperty(a, "__esModule", {
            value: !0
        });
        var h = t("../../data/ChapterData"),
            d = t("../../data/SplitData"),
            g = t("../../data/GameData"),
            f = t("../../data/RoleData"),
            o = t("../../enum/GameEnum"),
            n = cc._decorator,
            i = n.ccclass,
            r = (n.property, function (e) {
                function t() {
                    var t = null !== e && e.apply(this, arguments) || this;
                    return t.menuUiNames = [],
                    t.chapterUiNames = [],
                    t.curretSceneName = "",
                    t.gameData = null,
                    t.isNext = !1,
                    t.hideUi = null,
                    t.isShowHideUi = !1,
                    t.isAllowNext = !1,
                    t
                }
                return __extends(t, e),
                t.prototype.onLoad = function () {
                    this.initUi(),
                    this.chapterUiNames = ["count_lable", "star_lable", "honor_02", "level_icon_02", "back", "reStart", "btn_next", "btn_help"]
                },
                t.prototype.start = function () {
                    this.gameData = g.GameData.getInstance(),
                    this.ctx || this.createGraphics()
                },
                t.prototype.update = function (t) {
                    this.gameData.getIsRefreshTopUi() && (this.gameData.setIsRefreshTopUi(!1), this.refresh())
                },
                t.prototype.createGraphics = function () {
                    this.ctx = this.node.addComponent(cc.Graphics),
                    this.ctx.lineWidth = 2
                },
                t.prototype.initUi = function () {
                    this.count_lable = this.node.getChildByName("count_lable").getComponent(cc.RichText),
                    this.star_label = this.node.getChildByName("star_lable").getComponent(cc.RichText),
                    this.count_icon = this.node.getChildByName("honor_02"),
                    this.star_icon = this.node.getChildByName("level_icon_02"),
                    this.btn_nextNode = this.node.getChildByName("btn_next"),
                    this.hideUi = this.node.getChildByName("hideUi")
                },
                t.prototype.appearMenuUi = function () {
                    this.node.active = !1
                },
                t.prototype.appearChapterUi = function () {
                    this.node.active = !0,
                    this.refresh()
                },
                t.prototype.refresh = function () {
                    this.ctx && this.ctx.clear();
                    var t = h.ChapterData.getInstance().getCurrentVo();
                    t.getPassConditionType() == o.passConditionType.dropOut ? this.dropOut(t) : t.getPassConditionType() == o.passConditionType.star && this.eatStar(t)
                },
                t.prototype.dropOut = function (t) {
                    this.drawPassIcon(this.star_icon.position),
                    this.star_icon.active && (this.star_icon.active = !1, this.count_icon.active = !1);
                    var e = t.getPerfectPass(),
                        a = d.SplitData.getInstance().getSplitNum();
                    e <= a && (this.gameData.isAllowSplit = !1),
                    this.count_lable.string = a + "/" + e;
                    var o = t.getPassCondition(),
                        n = d.SplitData.getInstance().getPassProgress(),
                        i = h.ChapterData.getInstance().getCurrentVo(),
                        r = i.getMass(),
                        c = Math.ceil(n / r * 100);
                    if (c || (c = 0), 100 < c && (c = 100), this.star_label.string = c + "/" + o + "%", o <= c) {
                            var s = 0;
                            if (o == i.getPerfectDorp() || c >= i.getPerfectDorp()) s = 3;
                            else s = (i.getPerfectDorp() - o) / 2 <= c ? 2 : 1;
                            var p = {
                                name: g.GameData.getInstance().getCurrentChapterName(),
                                star: s
                            };
                            f.RoleData.getInstance().addChapterObj(p);
                            var l = f.RoleData.getInstance().getUnlockChapterNum(),
                                u = h.ChapterData.getInstance().getVoNum();
                            t.getCode() < l && t.getCode() < u && this.next()
                        } else this.btn_nextNode.active = !1
                },
                t.prototype.eatStar = function (t) {
                    this.star_icon.active || (this.ctx.clear(), this.star_icon.active = !0, this.count_icon.active = !0);
                    var e = t.getPerfectPass(),
                        a = d.SplitData.getInstance().getSplitNum();
                    this.count_lable.string = a + "/" + e;
                    var o = t.getPassCondition(),
                        n = d.SplitData.getInstance().getPassProgress();
                    if (this.star_label.string = n + "/" + o, o <= n) {
                            var i = 3 - (a - e);
                            3 < i ? i = 3 : i < 1 && (i = 1);
                            var r = {
                                name: g.GameData.getInstance().getCurrentChapterName(),
                                star: i
                            };
                            f.RoleData.getInstance().addChapterObj(r);
                            var c = f.RoleData.getInstance().getUnlockChapterNum(),
                                s = h.ChapterData.getInstance().getVoNum();
                            t.getCode() < c && t.getCode() < s && this.next()
                        } else this.btn_nextNode.active = !1
                },
                t.prototype.drawPassIcon = function (t) {
                    this.ctx || this.createGraphics();
                    var e = h.ChapterData.getInstance().getCurrentVo().getDropColor();
                    e && (this.ctx.fillColor = e),
                    this.ctx.clear(),
                    this.ctx.moveTo(t.x - 25, t.y + 25),
                    this.ctx.lineTo(t.x + 25, t.y + 25),
                    this.ctx.lineTo(t.x + 25, t.y - 25),
                    this.ctx.lineTo(t.x - 25, t.y - 25),
                    this.ctx.fill()
                },
                t.prototype.next = function () {
                    var e = this;
                    this.isNext || (this.isAllowNext = !0, this.isNext = !0, setTimeout(function () {
                        if (e.isNext = !1, "menu" != e.gameData.getCurrentChapterName() && e.isAllowNext) {
                            e.isAllowNext = !1;
                            var t = h.ChapterData.getInstance().getNextVo();
                            d.SplitData.getInstance().clearSplitInfo(),
                            d.SplitData.getInstance().removeAllCrumb(),
                            g.GameData.getInstance().setIsRefreshTopUi(!0),
                            g.GameData.getInstance().setCurrentChapterName(t.getName())
                        }
                    }, 2e3))
                },
                t.prototype.showHideUi = function (o) {
                    var n = this,
                        t = this.hideUi.getChildByName("drawNode").getComponent(cc.Graphics),
                        e = h.ChapterData.getInstance().getCurrentVo().getDropColor();
                    e && (t.fillColor = e),
                    t.clear(),
                    t.moveTo(-25, 25),
                    t.lineTo(25, 25),
                    t.lineTo(25, -25),
                    t.lineTo(-25, -25),
                    t.fill();
                    var a = this.hideUi.getChildByName("star_lable").getComponent(cc.RichText),
                        i = h.ChapterData.getInstance().getCurrentVo().getPerfectDorp();
                    i ? a.string = i + "%" : console.log("没有获取到文本");
                    this.isShowHideUi = !0;
                    var r = cc.moveBy(.5, cc.v2(0, -80)),
                        c = cc.delayTime(1),
                        s = cc.callFunc(function () {
                            var t, e, a;
                            t = cc.moveBy(.5, cc.v2(0, 80)),
                            e = cc.callFunc(function () {
                                o.isHideui = !1,
                                n.isShowHideUi = !1
                            }),
                            a = cc.sequence(t, e),
                            n.hideUi.runAction(a)
                        }),
                        p = cc.sequence(r, c, s);
                    this.hideUi.runAction(p)
                },
                t = __decorate([i], t)
            }(cc.Component));
        a.TopUi = r,
        cc._RF.pop()
    },
    {
        "../../data/ChapterData": "ChapterData",
        "../../data/GameData": "GameData",
        "../../data/RoleData": "RoleData",
        "../../data/SplitData": "SplitData",
        "../../enum/GameEnum": "GameEnum"
    }],
    Ui: [function (t, e, a) {
        "use strict";
        cc._RF.push(e, "e6b47QesPBOJ59SRvuUFQom", "Ui"),
        Object.defineProperty(a, "__esModule", {
            value: !0
        });
        var o = t("../../data/GameData"),
            n = t("../../utils/XmlUtil"),
            i = t("../../data/ChapterData"),
            r = t("../../data/SplitData"),
            c = cc._decorator,
            s = c.ccclass,
            p = c.property,
            l = function (e) {
                function t() {
                    var t = null !== e && e.apply(this, arguments) || this;
                    return t.topUi = null,
                    t.menuUi = null,
                    t.split = null,
                    t.topUiScript = null,
                    t.menuUiScript = null,
                    t.gameData = null,
                    t.currentChapterName = "",
                    t.currentChapter = null,
                    t.chapterManage = null,
                    t
                }
                return __extends(t, e),
                t.prototype.onLoad = function () {
                    n.XmlUtil.getInstance(),
                    cc.director.getPhysicsManager().enabled = !0
                },
                t.prototype.start = function () {
                    this.topUiScript = this.topUi.getComponent("TopUi"),
                    this.gameData = o.GameData.getInstance();
                    var t = this.node.getChildByName("chapter");
                    this.chapterManage = t.getComponent("ChapterManage"),
                    this.menuUiScript = this.menuUi.getComponent("MenuUi")
                },
                t.prototype.update = function (t) {
                    this.chanageUi()
                },
                t.prototype.chanageUi = function () {
                    var t = this.gameData.getCurrentChapterName();
                    t != this.currentChapterName && ("menu" == t ? (this.topUiScript.appearMenuUi(), this.menuUi.active = !0, this.split.active = !1, this.menuUiScript.refresh(), "" != this.currentChapterName && this.removeCurrentChapter()) : (o.GameData.getInstance().setIsClearCrumb(!1), this.topUiScript.appearChapterUi(), this.menuUi.active = !1, this.split.active = !0, this.chanageChapter(t)), this.currentChapterName = t, this.gameData.setCurrentChapterName(t))
                },
                t.prototype.chanageChapter = function (t) {
                    this.gameData.isAllowSplit = !0,
                    r.SplitData.getInstance().clearSplit(),
                    i.ChapterData.getInstance().getCurrentVo().setMass(0),
                    this.removeCurrentChapter(),
                    t || (t = this.currentChapterName);
                    var e = this.node.getChildByName("chapter"),
                        a = this.chapterManage.getChapterPrefabByName(t);
                    this.gameData.setCurrentChapterName(t);
                    var o = cc.instantiate(a);
                    this.currentChapter = o,
                    e.addChild(o)
                },
                t.prototype.removeCurrentChapter = function () {
                    this.currentChapter && (this.currentChapter.active = !1, this.currentChapter.destroy(), this.currentChapter = null)
                },
                __decorate([p(cc.Node)], t.prototype, "topUi", void 0),
                __decorate([p(cc.Node)], t.prototype, "menuUi", void 0),
                __decorate([p(cc.Node)], t.prototype, "split", void 0),
                t = __decorate([s], t)
            }(cc.Component);
        a.
    default = l,
        cc._RF.pop()
    },
    {
        "../../data/ChapterData": "ChapterData",
        "../../data/GameData": "GameData",
        "../../data/SplitData": "SplitData",
        "../../utils/XmlUtil": "XmlUtil"
    }],
    XmlUtil: [function (t, e, a) {
        "use strict";
        cc._RF.push(e, "de447KX2z9PsYFZzrIFz2qN", "XmlUtil"),
        Object.defineProperty(a, "__esModule", {
            value: !0
        });
        var o = function () {
            function r() {
                this.initXmlData()
            }
            return r.getInstance = function () {
                return null == r.instance && (r.instance = new r),
                r.instance
            },
            r.prototype.initXmlData = function () {
                var a = r.xmlNames,
                    o = 0,
                    e = a.length,
                    n = [],
                    i = function () {
                        if (o < e) {
                            var t = cc.url.raw("resources/Json/" + a[o] + ".json");
                            cc.loader.load(t, function (t, e) {
                                t ? cc.log("Error" + t) : n[a[o]] = e,
                                o++,
                                i()
                            })
                        }
                        o == e && cc.log("xml init success!")
                    };
                i(),
                r.allXmlData = n
            },
            r.prototype.getXmlInfo = function (t, e) {
                var a = r.allXmlData[t];
                return null == a ? (cc.log("there is no xml named " + t), null) : null == a[e] ? (cc.log("there is no xmlinfo by id " + e + "in " + t), null) : a[e]
            },
            r.prototype.getLen = function (t) {
                var e = 0;
                for (var a in r.allXmlData[t]) e++;
                return e
            },
            r.prototype.getAllXmlInfo = function (t) {
                var e = r.allXmlData[t];
                return null == e ? (cc.log("there is no statictable named " + t), null) : e
            },
            r.xmlNames = ["chapter"],
            r
        }();
        a.XmlUtil = o,
        cc._RF.pop()
    },
    {}]
}, {}, ["ChapterItem", "Mask", "Motor", "ScrollView", "ChapterManage", "CrumbManage", 
"MusicControl", "SoundManage", "Btn", "MenuUi", "Seting", "TopUi", "Ui", "Arrow", "Crumb", 
"Draw", "DropCrumb", "LeftRight", "Split", "Star", "ChapterData", "GameData", "RoleData", "SplitData", 
"GameEnum", "GlobalFun", "XmlUtil", "ChapterVo"]);