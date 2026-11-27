(function() {
  // ============================================
  // METABALLS - 2D canvas, field computed pixel by pixel
  // Per-block settings (optional) on .ball:
  //   data-balls="3"            number of balls (6 by default)
  //   data-color="99,102,241"   ball color as R,G,B (indigo by default)
  // ============================================
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)');

  document.querySelectorAll('.ball').forEach(function(root) {
    var canvas = root.querySelector('.metaballs-canvas');
    if (!canvas) return;
    var ctx = canvas.getContext('2d');
    var container = canvas.parentElement;

    var numBalls = parseInt(root.getAttribute('data-balls'), 10) || 6;
    var color = (root.getAttribute('data-color') || '99,102,241').split(',').map(Number);
    var background = [26, 26, 36];
    var PIXEL_BUDGET = 650000;

    var w = 0, h = 0, scale = 1, imageData = null;
    var balls = [];
    var raf = 0, visible = true;

    function resize() {
      w = container.clientWidth;
      h = container.clientHeight;
      // Retina screen: up to 2 canvas pixels per CSS pixel, within a limit of PIXEL_BUDGET pixels
      // computed per frame (the field is computed pixel by pixel: on a large frame, smoothness comes first)
      scale = Math.max(1, Math.min(window.devicePixelRatio || 1, 2, Math.sqrt(PIXEL_BUDGET / Math.max(1, w * h))));
      canvas.width = Math.max(1, Math.round(w * scale));
      canvas.height = Math.max(1, Math.round(h * scale));
      imageData = ctx.createImageData(canvas.width, canvas.height);
      if (!balls.length) {
        for (var i = 0; i < numBalls; i++) {
          var radius = 30 + Math.random() * 40;
          balls.push({
            x: radius + Math.random() * Math.max(0, w - 2 * radius),
            y: radius + Math.random() * Math.max(0, h - 2 * radius),
            vx: (Math.random() - 0.5) * 2,
            vy: (Math.random() - 0.5) * 2,
            radius: radius
          });
        }
      }
      keepInside();
      drawMetaballs();
      start();
    }

    // A ball never leaves the frame, even after the frame shrinks
    function keepInside() {
      for (var i = 0; i < balls.length; i++) {
        var ball = balls[i];
        ball.x = w > 2 * ball.radius ? Math.min(Math.max(ball.x, ball.radius), w - ball.radius) : w / 2;
        ball.y = h > 2 * ball.radius ? Math.min(Math.max(ball.y, ball.radius), h - ball.radius) : h / 2;
      }
    }

    function drawMetaballs() {
      var W = canvas.width, H = canvas.height;
      var data = imageData.data;
      var n = balls.length;
      var bx = [], by = [], r2 = [], dy2 = [];
      for (var i = 0; i < n; i++) {
        bx[i] = balls[i].x * scale;
        by[i] = balls[i].y * scale;
        r2[i] = balls[i].radius * balls[i].radius * scale * scale;
      }
      var soft = scale * scale; // the "+ 1" in r² / (d² + 1), in screen pixels
      var idx = 0;

      for (var y = 0; y < H; y++) {
        for (i = 0; i < n; i++) dy2[i] = (y - by[i]) * (y - by[i]) + soft;
        for (var x = 0; x < W; x++) {
          var sum = 0;
          for (i = 0; i < n; i++) {
            var dx = x - bx[i];
            sum += r2[i] / (dx * dx + dy2[i]);
          }

          if (sum > 1) {
            var intensity = Math.min(sum - 1, 1) * 50; // the core gets lighter where the fields add up
            data[idx] = color[0] + intensity;
            data[idx + 1] = color[1] + intensity;
            data[idx + 2] = color[2] + intensity;
          } else {
            data[idx] = background[0];
            data[idx + 1] = background[1];
            data[idx + 2] = background[2];
          }
          data[idx + 3] = 255;
          idx += 4;
        }
      }

      ctx.putImageData(imageData, 0, 0);
    }

    function updateBalls() {
      for (var i = 0; i < balls.length; i++) {
        var ball = balls[i];
        ball.x += ball.vx;
        ball.y += ball.vy;

        if (ball.x < ball.radius) ball.vx = Math.abs(ball.vx);
        if (ball.x > w - ball.radius) ball.vx = -Math.abs(ball.vx);
        if (ball.y < ball.radius) ball.vy = Math.abs(ball.vy);
        if (ball.y > h - ball.radius) ball.vy = -Math.abs(ball.vy);
      }
      keepInside();
    }

    function animate() {
      raf = 0;
      updateBalls();
      drawMetaballs();
      start();
    }

    // The loop only runs if the block is on screen, the tab visible and motion allowed
    function start() {
      if (!raf && visible && !document.hidden && !reduce.matches) raf = requestAnimationFrame(animate);
    }

    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function(entries) {
        visible = entries[0].isIntersecting;
        if (visible) start();
        else if (raf) { cancelAnimationFrame(raf); raf = 0; }
      }).observe(root);
    }
    document.addEventListener('visibilitychange', start);

    if ('ResizeObserver' in window) new ResizeObserver(resize).observe(container);
    else window.addEventListener('resize', resize);
    resize();
  });
})();