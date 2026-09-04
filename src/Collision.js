const Vector = require('./Vector');

/**
 * @class 
 * 
 */
class Collision {
  constructor() {
    this.testAxis = new Vector(0, 0);
    this.response = new Vector(0, 0);
    this.relTanVel = new Vector(0, 0);
    this.tangent = new Vector(0, 0);
    this.relVel = new Vector(0, 0);
    this.center = new Vector(0, 0);
    this.axis = new Vector(0, 0);
    this.line = new Vector(0, 0);
    this.depth = 0;
    this.edge = null;
    this.vertex = null;
  }
  /**
   * 
   * @method Collision.SAT
   * @param {Body} B0
   * @param {Body} B1
   */
  SAT(B0, B1) {

    this.checkAABB(B1, B0);
    let minDistance = Number.MAX_SAFE_INTEGER;
    const n0 = B0.edges.length;
    const n1 = B1.edges.length;

    for (let i = 0, n = n0 + n1; i < n; i++) {

      let edge = i < n0 ? B0.edges[i] : B1.edges[i - n0];
 
      this.testAxis.normal(edge.p0, edge.p1);
 
      B0.project(this.testAxis);
      B1.project(this.testAxis);

      const dist = B0.min < B1.min ? B1.min - B0.max : B0.min - B1.max;

      if (dist > 0) {
        return false;
      }
      else if (Math.abs(dist) < minDistance) {

        minDistance = Math.abs(dist);
        this.axis.copy(this.testAxis);
        this.edge = edge;
      }
    }

    this.depth = minDistance;

    if (this.edge.parent != B1) {
      const t = B1;
      B1 = B0;
      B0 = t;
    }
    const xx = B0.center.x - B1.center.x;
    const yy = B0.center.y - B1.center.y;
    const n = this.axis.x * xx + this.axis.y * yy;
    if (n < 0) {
      this.axis.negative();
    }
    let smallestDist = Number.MAX_SAFE_INTEGER, v, dist;
    for (let i = 0; i < B0.vCount; i++) {

      v = B0.vertices[i];
      this.line.sub2(v.position, B1.center);
      dist = this.axis.dot(this.line);

      if (dist < smallestDist) {
        smallestDist = dist;
        this.vertex = v;
      }
    }
    return true;
  }
  checkAABB(B1, B0) {
    if (!(0 > Math.abs(B1.center.x - B0.center.x) - (B1.halfEx.x + B0.halfEx.x) &&
      0 > Math.abs(B1.center.y - B0.center.y) - (B1.halfEx.y + B0.halfEx.y))) {
      return false;
    }
  }
  /**
   * 
   * @method Collision.resolve()
   * @param {float} friction
   */
  resolve(friction) {

    let p0 = this.edge.p0, p1 = this.edge.p1, o0 = this.edge.v0.oldPosition, o1 = this.edge.v1.oldPosition, vp = this.vertex.position, vo = this.vertex.oldPosition, rs = this.response;
    this.response.scale(this.axis, this.depth);
    let t = Math.abs(p0.x - p1.x) > Math.abs(p0.y - p1.y)
      ? (vp.x - rs.x - p0.x) / (p1.x - p0.x)
      : (vp.y - rs.y - p0.y) / (p1.y - p0.y);

    let lambda = 1 / (t * t + (1 - t) * (1 - t));

    let m0 = this.vertex.parent.mass, m1 = this.edge.parent.mass, tm = m0 + m1;
    m0 = m0 / tm;
    m1 = m1 / tm;

    p0.x -= rs.x * (1 - t) * lambda * m0;
    p0.y -= rs.y * (1 - t) * lambda * m0;
    p1.x -= rs.x * t * lambda * m0;
    p1.y -= rs.y * t * lambda * m0;
    vp.x += rs.x * m1;
    vp.y += rs.y * m1;

    this.relVel.set(vp.x - vo.x - (p0.x + p1.x - o0.x - o1.x) * 0.5, vp.y - vo.y - (p0.y + p1.y - o0.y - o1.y) * 0.5);

    this.tangent.perp(this.axis);

    let relTv = this.relVel.dot(this.tangent);
    let rt = this.relTanVel.set(this.tangent.x * relTv, this.tangent.y * relTv);

    let groundf = 0.95;
    vo.x += rt.x * groundf * m1;
    vo.y += rt.y * groundf * m1;
    o0.x -= rt.x * (1 - t) * groundf * lambda * m0;
    o0.y -= rt.y * (1 - t) * groundf * lambda * m0;
    o1.x -= rt.x * t * groundf * lambda * m0;
    o1.y -= rt.y * t * groundf * lambda * m0;
  }
  aabb(B0, B1) {
    return (B0.bound.minX <= B1.bound.maxX) &&
      (B0.bound.minY <= B1.bound.maxY) &&
      (B0.bound.maxX >= B1.bound.minX) &&
      (B1.bound.maxY >= B0.bound.minY);
  }
}

module.exports = Collision;
