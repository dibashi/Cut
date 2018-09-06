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