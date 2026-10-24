const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const path = require('node:path');
const { test } = require('node:test');
const { runInNewContext } = require('node:vm');

// Test the exact inline implementation; production remains a single HTML page.
const html = readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');
const source = html.match(/<script id="pool-physics">([\s\S]*?)<\/script>/)[1];
const PoolWorld = runInNewContext(source + '\nPoolWorld;');
const close = (actual, expected, tolerance = 1e-8) => assert.ok(Math.abs(actual - expected) < tolerance, `${actual} != ${expected}`);

test('pull direction is reversed and shot power is proportional, with a cap', () => {
  const world = new PoolWorld();
  const ball = world.add(200, 200);
  assert.equal(world.shoot(ball, 3, 0), false);
  world.shoot(ball, 30, 40);
  close(ball.vx, -300);
  close(ball.vy, -400);
  world.shoot(ball, 60, 80);
  close(Math.hypot(ball.vx, ball.vy), 1000);
  world.shoot(ball, 600, 800);
  close(Math.hypot(ball.vx, ball.vy), 1400);
});

test('walls keep a ball inside the viewport and reflect its velocity', () => {
  const world = new PoolWorld();
  const ball = world.add(world.width - 25, 100);
  world.shoot(ball, -140, 0);
  world.step(1 / 120);
  assert.equal(ball.x, world.width - world.radius);
  assert.ok(ball.vx < 0);
  assert.ok(Math.abs(ball.vx) < world.maxSpeed);
});

test('a collision transfers momentum to an initially docked ball', () => {
  const world = new PoolWorld();
  world.deceleration = 0;
  const a = world.add(200, 200), b = world.add(246, 200);
  let activated = 0;
  world.onActivate = () => activated++;
  world.shoot(a, -10, 0);
  world.step(0);
  assert.equal(b.loose, true);
  assert.equal(activated, 2);
  assert.ok(b.vx > 90);
  close(a.vx + b.vx, 100);
  assert.ok(a.vx * a.vx + b.vx * b.vx <= 10000);
  close(Math.hypot(b.x - a.x, b.y - a.y), world.radius * 2);
});

test('a ball held for aiming stays still when another ball hits it', () => {
  const world = new PoolWorld();
  const moving = world.add(205, 200), held = world.add(250, 200);
  world.activate(held);
  held.held = true;
  world.shoot(moving, -20, 0);
  world.step(1 / 120);
  close(held.x, 250);
  close(held.y, 200);
  close(held.vx, 0);
  assert.ok(moving.vx < 0);
});

test('a fast ball crossing the pocket is captured once, even beyond its centre', () => {
  const world = new PoolWorld();
  world.pocket = { x: 500, y: 50, radius: 24 };
  const ball = world.add(450, 50);
  let pots = 0;
  world.onPot = () => pots++;
  world.shoot(ball, -140, 0);
  world.step(0.08);
  assert.equal(ball.potted, true);
  assert.equal(pots, 1);
  close(ball.vx, 0);
  world.step(1 / 120);
  assert.equal(pots, 1);
});

test('rolling orientation follows distance divided by radius', () => {
  const world = new PoolWorld();
  world.deceleration = 0;
  const ball = world.add(200, 200);
  world.shoot(ball, -24, 0);
  world.step(0.1);
  close(ball.x, 224);
  close(ball.q[0], 0);
  close(ball.q[1], Math.sin(0.5));
  close(ball.q[3], Math.cos(0.5));
});

test('six-ball play stays bounded, loses energy, and eventually sleeps', () => {
  const world = new PoolWorld();
  for (let i = 0; i < 6; i++) {
    const ball = world.add(100 + i * 105, 100 + (i % 2) * 220);
    world.shoot(ball, Math.cos(i * 2.1) * 140, Math.sin(i * 2.1) * 140);
  }
  const energy = () => world.balls.reduce((sum, b) => sum + b.vx ** 2 + b.vy ** 2, 0);
  let previousEnergy = energy();
  for (let i = 0; i < 1200; i++) {
    world.step(1 / 120);
    assert.ok(energy() <= previousEnergy + 1e-5);
    previousEnergy = energy();
    for (const b of world.balls) {
      assert.ok(b.x >= 24 && b.x <= world.width - 24);
      assert.ok(b.y >= 24 && b.y <= world.height - 24);
      close(Math.hypot(...b.q), 1);
    }
  }
  assert.equal(world.moving(), false);
});
