const atomic = new Atomic('#c', window.innerWidth, 500, 0, 1, 10);
let ctx = atomic.ctx;

console.log(atomic)

function setup() {
  let gapX = 0;
  let loopI = 0;
  for (let i = 0; i < 5; i++) {
    let b = atomic.Poly.box(100 + gapX, 100, 60, 30, {
      render: { fillStyle: 'white' }
    });
    gapX += 100;
    atomic.vertices.push(
      new Atomic.Vertex(b, { x: 80 + gapX, y: 115 }, false, {
        canvas: atomic.canvas,
        gravity: 1,
        friction: 1
      })
    );
  }
  atomic.vertices.pop();
}
setup();

function animate() {
  atomic.frame(animate);

  atomic.update();
  atomic.render();

  atomic.Render.dots(2);
  atomic.Render.pointIndex();
  atomic.Render.lines();

  atomic.drag();
}
animate();