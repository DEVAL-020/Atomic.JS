const Atomic = require('../../dist/atomic.build');

const atomic = new Atomic('#c', window.innerWidth, 450, 0, 1, 50);

function init() {

  for (let i = 0; i < 100; i++) {
    let randCol = 'hsl(' + Math.random() * 360 + 'deg, 50%,50%)';

    atomic.Poly.box(Math.random() * window.innerWidth, Math.random() * window.innerHeight, 30, 30, {
      render: { fillStyle: randCol }
    });

  }

  atomic.Poly.triangle(atomic.canvas.width - 550, 300, 100, 100, {
    static: true,
    render: {
      fillStyle: 'green',

    }
  });
  atomic.Poly.triangle(atomic.canvas.width - 400, 300, 100, 100, {
    static: true,
    render: {
      fillStyle: 'red'
    }
  });

  atomic.Poly.box(300, 200, 200, 20, {
    static: true,
    render: { fillStyle: 'red' }
  });
}
init();

function animate() {
  atomic.frame(animate);

  atomic.update();
  atomic.render();
  atomic.Render.information();
  atomic.showFps({x:atomic.canvas.width-100});

  atomic.drag();
}
animate();