

// http://www.emanueleferonato.com/2011/08/05/slicing-splitting-and-cutting-objects-with-box2d-part-4-using-real-graphics/

const EPSILON = 0.1;
const POINT_SQR_EPSILON = 5;

function compare(a, b) {
    if (a.fraction > b.fraction) {
        return 1;
    } else if (a.fraction < b.fraction) {
        return -1;

    }
    return 0;
}

function equals(a, b, epsilon) {
    epsilon = epsilon === undefined ? EPSILON : epsilon;
    return Math.abs(a - b) < epsilon;
}

function equalsVec2(a, b, epsilon) {
    return equals(a.x, b.x, epsilon) && equals(a.y, b.y, epsilon);
}

function pointInLine(point, a, b) {
    return cc.Intersection.pointLineDistance(point, a, b, true) < 1;
}

cc.Class({
    extends: cc.Component,


    properties: {

        checkpoints: {
            default: [],
            type: cc.Prefab,
        },

        uiLayer: {
            default: null,
            type: cc.Node,
        },

        graphicsLayer: {
            default: null,
            type: cc.Node,
        },
    },

    // use this for initialization
    onLoad: function () {
        this.checkpointInit();
        this.touchOpen();

        this.ctx = this.graphicsLayer.getComponent(cc.Graphics);
        this.graphicsLayer.zIndex = 2;
    },

    touchOpen: function () {
        this.halfWinWidth = cc.find('Canvas').width*0.5;
        this.halfWinHeight = cc.find('Canvas').height*0.5;
        this.node.on("touchstart", this.onTouchStart, this);
        this.node.on('touchmove', this.onTouchMove, this);
        this.node.on('touchend', this.onTouchEnd, this);
    },


    checkpointInit: function () {
        let checkpointIndex = cc.dataMgr.currentCheckPoint - 1;

        this.currentNode = cc.instantiate(this.checkpoints[checkpointIndex]);

        this.node.addChild(this.currentNode);
        this.currentNode.zIndex = 1;

        this.currentNode.setPosition(cc.v2(0, 0));



    },

    reNew: function () {
        //console.log("re new");
        this.currentNode.removeFromParent();
        this.checkpointInit();
    },

    renderHelpLine: function () {
        this.reNew();
        if(this.currentNode.getComponent("checkPointTouchLogic").helpLineCount == 1) {
            let pointBegin = this.currentNode.getComponent("checkPointTouchLogic").helpTouchBegin;
            let pointEnd = this.currentNode.getComponent("checkPointTouchLogic").helpTouchEnd;

            this.drawHLine(pointBegin,pointEnd);
        } else if(this.currentNode.getComponent("checkPointTouchLogic").helpLineCount == 2) {
            let pointBegin = this.currentNode.getComponent("checkPointTouchLogic").helpTouchBegin;
            let pointEnd = this.currentNode.getComponent("checkPointTouchLogic").helpTouchEnd;
            this.drawHLine(pointBegin,pointEnd);

            let pointBegin1 = this.currentNode.getComponent("checkPointTouchLogic").helpTouchBegin1;
            let pointEnd1 = this.currentNode.getComponent("checkPointTouchLogic").helpTouchEnd1;
            this.drawHLine(pointBegin1,pointEnd1);
        }
      
    },

    drawHLine:function(p1,p2) {
        this.ctx.moveTo(p1.x, p1.y);
        this.ctx.lineTo(p2.x, p2.y);
        this.ctx.stroke();
    },

    hittedTarget: function () {
        this.currentNode.getComponent("checkPointTouchLogic").currentResultCount += 1;
        this.uiLayer.getComponent("uiLayer").refreash();
        this.currentNode.getComponent("checkPointTouchLogic").checkIsOver();
    },

    hittedMassTrigger: function (mass) {
        this.currentNode.getComponent("checkPointTouchLogic").hittedMassTrigger(mass);
        this.uiLayer.getComponent("uiLayer").refreash();
        this.currentNode.getComponent("checkPointTouchLogic").checkIsOver();
    },


    onTouchStart: function (event) {
        this.ctx.clear();
        this.touching = true;
        this.r1 = this.r2 = this.results = null;
        this.touchStartPoint = this.touchPoint = cc.v2(event.touch.getLocation());

        console.log("touchStart");
         console.log(this.node.convertToNodeSpaceAR(this.touchStartPoint));
    },

    onTouchMove: function (event) {
        this.touchPoint = cc.v2(event.touch.getLocation());
        //      console.log("touchMove");
        //  console.log(this.touchPoint);
    },

    onTouchEnd: function (event) {
              console.log("touchend");
         console.log(this.node.convertToNodeSpaceAR(this.touchPoint));
        this.touchPoint = cc.v2(event.touch.getLocation());
        this.recalcResults();
        this.touching = false;

        if (this.r1 == null || this.r2 == null || this.results == null) {
            this.ctx.clear();
            return;
        }

        let point = cc.v2(event.touch.getLocation());
        if (equals(this.touchStartPoint.sub(point).magSqr(), 0)) return;

        // recalculate fraction, make fraction from one direction
        this.r2.forEach(r => {
            r.fraction = 1 - r.fraction;
        });

        let results = this.results;
        if (results.length >= 2) {
            //console.log(this.currentNode.getComponent("checkPointTouchLogic").currentTouchCount);
            this.currentNode.getComponent("checkPointTouchLogic").currentTouchCount += 1;
            this.uiLayer.getComponent("uiLayer").refreash();
        } else {
            console.log("无效的切割");
        }

        let pairs = [];

        for (let i = 0; i < results.length; i++) {
            let find = false;
            let result = results[i];

            for (let j = 0; j < pairs.length; j++) {
                let pair = pairs[j];
                if (pair[0] && result.collider === pair[0].collider) {
                    find = true;

                    // one collider may contains several fixtures, so raycast may through the inner fixture side
                    // we need remove them from the result
                    let r = pair.find((r) => {
                        return r.point.sub(result.point).magSqr() <= POINT_SQR_EPSILON;
                    });

                    if (r) {
                        pair.splice(pair.indexOf(r), 1);
                    }
                    else {
                        pair.push(result);
                    }

                    break;
                }
            }

            if (!find) {
                pairs.push([result]);
            }
        }

        for (let i = 0; i < pairs.length; i++) {
            let pair = pairs[i];
            if (pair.length < 2) {
                continue;
            }

            // sort pair with fraction
            pair = pair.sort(compare);

            let splitResults = [];

            // first calculate all results, not split collider right now
            for (let j = 0; j < (pair.length - 1); j += 2) {
                let r1 = pair[j];
                let r2 = pair[j + 1];

                if (r1 && r2) {
                    this.split(r1.collider, r1.point, r2.point, splitResults);
                }
            }


            if (splitResults.length <= 0) {
                continue;
            }

            // console.log("splitResults");
            // console.log(splitResults);
            // return;
            let collider = pair[0].collider;

            let maxPointsResult;
            for (let j = 0; j < splitResults.length; j++) {
                let splitResult = splitResults[j];

                for (let k = 0; k < splitResult.length; k++) {
                    if (typeof splitResult[k] === 'number') {
                        splitResult[k] = collider.points[splitResult[k]];
                    }
                }

                if (!maxPointsResult || splitResult.length > maxPointsResult.length) {
                    maxPointsResult = splitResult;
                }
            }

            if (maxPointsResult.length < 3) {
                continue;
            }


            // console.log("maxPointsResult");
            // console.log(maxPointsResult);
            // return;

            // keep max length points to origin collider
            collider.points = maxPointsResult;
            collider.node.getComponent("draw").draw();
            //collider.node.getComponent("draw").maskDraw();
            collider.apply();

            //console.log("开始检测最大定点数多边形 是否包含 关节");
            let joints = this.checkJoint(collider);
            //console.log(collider);
            //console.log(joints);
            this.dynamicConnectJoint(joints, collider);

            let body = collider.body;

            //todo


            for (let j = 0; j < splitResults.length; j++) {
                let splitResult = splitResults[j];

                if (splitResult.length < 3) continue;
                if (splitResult == maxPointsResult) continue;

                let tempParent = body.node.parent;
                // create new body
                let node = new cc.Node();
                node.group = body.node.group;
                node.position = tempParent.convertToNodeSpaceAR(body.getWorldPosition());
                node.rotation = body.getWorldRotation();
                //node.parent = cc.director.getScene();
                node.parent = tempParent;
                node.addComponent("draw");
                let nodeBody = node.addComponent(cc.RigidBody);
                nodeBody.gravityScale = body.gravityScale;
                nodeBody.linearVelocity = body.linearVelocity;
                nodeBody.linearDamping = body.linearDamping;

                let nodeCol = node.addComponent(cc.PhysicsPolygonCollider);
                nodeCol.points = splitResult;
                nodeCol.tag = collider.tag;
                nodeCol.density = collider.density;
                nodeCol.friction = collider.friction;

                nodeCol.apply();

                let joints = this.checkJoint(nodeCol);
                this.dynamicConnectJoint(joints, nodeCol);

            }

        }

        this.ctx.clear();
    },

    dynamicConnectJoint: function (joints, collider) {
        for (let i = 0; i < joints.length; i++) {
            let jt = joints[i].getComponent(cc.RevoluteJoint);
            jt.connectedBody = collider.body;//nodeBody其实就行
            let worldPos = jt.getComponent(cc.RigidBody).getWorldPosition();
            let nodePos = collider.body.getLocalPoint(worldPos);
            jt.connectedAnchor = nodePos;
            jt.apply();
        }

        collider.apply();
    },

    checkJoint: function (collider) {
        let ps = collider.points;
        let resultsOfJoints = [];
        //这个N是将来关卡数据中的jointNode节点的集合
        let jointsArr = this.currentNode.getComponent("checkPointTouchLogic").revoluteJointNodeArr;
        for (let i = 0; i < jointsArr.length; i++) {
            let jt = jointsArr[i];
            let jtPos = jt.getComponent(cc.RigidBody).getWorldPosition();
            let jtPosInCollider = collider.body.getLocalPoint(jtPos);
            if (cc.Intersection.pointInPolygon(jtPosInCollider, ps)) {
                resultsOfJoints[resultsOfJoints.length] = jt;
            }
        }

        return resultsOfJoints;
    },

    split: function (collider, p1, p2, splitResults) {
        let body = collider.body;
        let points = collider.points;


        // The manager.rayCast() method returns points in world coordinates, so use the body.getLocalPoint() to convert them to local coordinates.
        p1 = body.getLocalPoint(p1);
        p2 = body.getLocalPoint(p2);


        let newSplitResult1 = [p1, p2];
        let newSplitResult2 = [p2, p1];

        let index1, index2;
        for (let i = 0; i < points.length; i++) {
            let pp1 = points[i];
            let pp2 = i === points.length - 1 ? points[0] : points[i + 1];

            if (index1 === undefined && pointInLine(p1, pp1, pp2)) {
                index1 = i;
            }
            else if (index2 === undefined && pointInLine(p2, pp1, pp2)) {
                index2 = i;
            }

            if (index1 !== undefined && index2 !== undefined) {
                break;
            }
        }

        if (index1 === undefined || index2 === undefined) {
            debugger
            return;
        }

        let splitResult, indiceIndex1 = index1, indiceIndex2 = index2;

        if (splitResults.length > 0) {
            for (let i = 0; i < splitResults.length; i++) {
                let indices = splitResults[i];
                indiceIndex1 = indices.indexOf(index1);
                indiceIndex2 = indices.indexOf(index2);

                if (indiceIndex1 !== -1 && indiceIndex2 !== -1) {
                    splitResult = splitResults.splice(i, 1)[0];
                    break;
                }
            }
        }

        if (!splitResult) {
            splitResult = points.map((p, i) => {
                return i;
            });
        }


        for (let i = indiceIndex1 + 1; i !== (indiceIndex2 + 1); i++) {
            if (i >= splitResult.length) {
                i = 0;
            }

            let p = splitResult[i];
            p = typeof p === 'number' ? points[p] : p;
            // p = points[p];

            if (p.sub(p1).magSqr() < POINT_SQR_EPSILON || p.sub(p2).magSqr() < POINT_SQR_EPSILON) {
                continue;
            }

            newSplitResult2.push(splitResult[i]);
        }

        for (let i = indiceIndex2 + 1; i !== indiceIndex1 + 1; i++) {
            if (i >= splitResult.length) {
                i = 0;
            }

            let p = splitResult[i];
            p = typeof p === 'number' ? points[p] : p;

            if (p.sub(p1).magSqr() < POINT_SQR_EPSILON || p.sub(p2).magSqr() < POINT_SQR_EPSILON) {
                continue;
            }

            newSplitResult1.push(splitResult[i]);
        }

        splitResults.push(newSplitResult1);
        splitResults.push(newSplitResult2);
    },

    recalcResults: function () {
        if (!this.touching) return;

        let startPoint = this.touchStartPoint;
        let point = this.touchPoint;

        this.ctx.clear();
        this.ctx.moveTo(this.touchStartPoint.x - this.halfWinWidth, this.touchStartPoint.y - this.halfWinHeight);
        this.ctx.lineTo(point.x - this.halfWinWidth, point.y - this.halfWinHeight);
        this.ctx.stroke();

        let manager = cc.director.getPhysicsManager();

        let r1 = manager.rayCast(this.touchStartPoint, point, cc.RayCastType.All);
        let r2 = manager.rayCast(point, this.touchStartPoint, cc.RayCastType.All);

        for (let i = 0; i < r1.length; i++) {
            //触碰到铰链关节
            if (r1[i].collider.tag == cc.dataMgr.OBJECT_COLOR.JOINT) {
                this.r1 = null;
                this.r2 = null;
                this.results = null;
                return;
            }
        }


        for (let i = 0; i < r1.length; i++) {
            //约定大于100的不可切
            if (r1[i].collider.tag > 100) {

                r1.splice(i, 1);
                i -= 1;
            } 
            // else {
            //     console.log("看这里");
            //     console.log(r1[i].collider.tag);
            // }
        }
        for (let i = 0; i < r2.length; i++) {
            if (r2[i].collider.tag > 100) {
                r2.splice(i, 1);
                i -= 1;
            } 
            // else {
            //     console.log("zai看这里");
            //     console.log(r2[i].collider.tag);
            // }
        }

        // console.log(r1);
        // console.log(r2);
        let results = r1.concat(r2);

        for (let i = 0; i < results.length; i++) {
            let p = results[i].point;
            this.ctx.circle(p.x - this.halfWinWidth, p.y - this.halfWinHeight, 5);
        }
        this.ctx.fill();

        this.r1 = r1;
        this.r2 = r2;
        this.results = results;
        //console.log(results);
    },

    // called every frame, uncomment this function to activate update callback
    update: function (dt) {
        // body maybe moving, need calc raycast results in update
        this.recalcResults();
    },
});




