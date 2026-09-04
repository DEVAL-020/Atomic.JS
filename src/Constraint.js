/**
 * @class 
 * @param {*} parent
 * @param {*} v0
 * @param {*} v1
 * @param {*} edge
 */
class Constraint {
  constructor(parent, v0, v1, edge) {
    this.parent = parent;
    this.v0 = v0;
    this.v1 = v1;
    this.p0 = v0.position;
    this.p1 = v1.position;
    this.edge = edge;
    this.dist = Math.sqrt(this.p0.squareDist(this.p1));
  }
  /**
   * @method Constraint.solve()
   * 
   */
  solve() {
    let dx = this.p1.x - this.p0.x;
    let dy = this.p1.y - this.p0.y;
    let d = Math.sqrt(dx * dx + dy * dy);

    const diffrence = (d - this.dist) / d;
    const adjustX = (dx * 0.5 * diffrence) /*stfns*/;
    const adjustY = (dy * 0.5 * diffrence) /*stfns*/;
    this.p0.x += adjustX;
    this.p0.y += adjustY;
    this.p1.x -= adjustX;
    this.p1.y -= adjustY;
  }
}
;

module.exports = Constraint;