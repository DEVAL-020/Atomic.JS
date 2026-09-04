const atomic = new Atomic('#c', window.innerWidth, 600, 1, 1, 50);
let ctx = atomic.ctx;
const DOMGravity = document.getElementById('gravity');

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
    render: { fillStyle: 'tomato' }
  });
}
init();

atomic.canvas.addEventListener('click', function (e) {
  let randCol = 'hsl(' + Math.random() * 360 + 'deg, 50%,50%)';
  atomic.Poly.box(e.offsetX - 15, e.offsetY - 15, 30, 30, {
    mass: 1,
    render: {
      fillStyle: randCol
    }
  });
})

let tmpVDraw = {};
function drawPoly() {
  let tmpV = {};
  let index = 0;
  let interval = 0;
  let isDragging = false;
  let isShift = false;

  window.addEventListener('keydown', function (e) {
    if (e.key === 'Shift') {
      isShift = true;
    }
  })
  window.addEventListener('keyup', function (e) {
    if (e.key === 'Shift') {
      isShift = false;
    }
  })

  atomic.canvas.addEventListener('mousedown', function (e) {
    isDragging = true;
  })

  atomic.canvas.addEventListener('mousemove', function (e) {
    interval++;
    if (isDragging && isShift) {
      if (interval >= 5) {
        let x = e.offsetX;
        let y = e.offsetY;
        tmpV[index] = { x: x, y: y };
        tmpVDraw[index] = { x: x, y: y };
        tmpVDraw[index + 1] = tmpVDraw[0];
        index++;
        interval = 0;
      }
    }

  })

  atomic.canvas.addEventListener('mouseup', function (e) {
    if (index > 2) {
      atomic.createPoly(tmpV, {

        render: { fillStyle: 'deepskyblue' }
      });
    }
    tmpV = {};
    tmpVDraw = {};
    index = 0;
    interval = 0;
    isDragging = false;
  })

}
drawPoly();

function showDrawing() {
  if (tmpVDraw[0]) {
    ctx.beginPath();
    ctx.strokeStyle = 'black';
    ctx.moveTo(tmpVDraw[0].x, tmpVDraw[0].y)
    for (const i in tmpVDraw) {
      ctx.lineTo(tmpVDraw[i].x, tmpVDraw[i].y)
    }
    ctx.stroke();
    ctx.closePath();
  }
}

function animate() {
  atomic.gravity = DOMGravity.checked ? 1 : 0;

  atomic.frame(animate);
  atomic.update();

  atomic.render();

  showDrawing();


  atomic.showFps({ x: atomic.canvas.width - 100 });

  atomic.drag();
}
animate();