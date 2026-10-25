const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const { test } = require('node:test');
const { runInNewContext } = require('node:vm');
const html = readFileSync(require('node:path').join(__dirname, '..', 'index.html'), 'utf8');
const PoolRound = runInNewContext(html.match(/<script id="pool-round">([\s\S]*?)<\/script>/)[1] + '\nPoolRound;');
const PoolWorld = runInNewContext(html.match(/<script id="pool-physics">([\s\S]*?)<\/script>/)[1] + '\nPoolWorld;');
test('timer starts on actual movement, not activation, aiming or a zero-length step', () => {
  let now = 1000;
  const round = new PoolRound(() => now), world = new PoolWorld();
  world.onMove = () => round.start();
  const ball = world.add(200, 200);
  world.activate(ball); world.step(1 / 120);
  assert.equal(round.started, null);
  world.shoot(ball, -50, 0); world.step(0);
  assert.equal(round.started, null);
  world.step(1 / 120);
  assert.equal(round.started, 1000);
  now = 2500; world.step(1 / 120);
  assert.equal(round.elapsed(), 1.5);
});
test('wall-clock time includes rest between shots, freezes on finish, and resets completely', () => {
  let now = 0;
  const round = new PoolRound(() => now);
  assert.equal(round.finish(), null);
  round.start(); now = 12345;
  assert.equal(round.finish(), 12.345);
  now = 99999;
  assert.equal(round.elapsed(), 12.345);
  assert.equal(round.finish(), null);
  round.reset(); assert.equal(round.elapsed(), 0); assert.equal(round.started, null);
  round.start(); now += 2000;
  assert.equal(round.finish(), 2);
});
test('a shot that immediately enters the pocket starts before it finishes', () => {
  const world = new PoolWorld(), round = new PoolRound(() => 1000);
  world.pocket = { x: 250, y: 200, radius: 24 };
  const ball = world.add(220, 200);
  world.onMove = () => round.start();
  let result = null; world.onPot = () => { result = round.finish(); };
  world.shoot(ball, -140, 0); world.step(1 / 120);
  assert.equal(result, 0); assert.equal(ball.potted, true);
});

test('bonuses accumulate, lower the final score, stay nonnegative, and reset', () => {
  let now = 0;
  const round = new PoolRound(() => now);
  round.reward(); assert.equal(round.bonus, 0);
  round.start(); now = 12000;
  round.reward(); round.reward();
  assert.equal(round.score(), 2);
  assert.equal(round.finish(), 2);
  round.reward(); assert.equal(round.bonus, 10);
  round.reset(); round.start(); round.reward();
  assert.equal(round.finish(), 0);
  round.reset(); assert.equal(round.bonus, 0); assert.equal(round.started, null);
});

test('genuine collisions qualify both balls; direct shots and wall bounces do not', () => {
  const world = new PoolWorld();
  const a = world.add(200, 200), b = world.add(246, 200);
  world.shoot(a, -20, 0); world.step(1 / 120);
  assert.equal(a.collided, true); assert.equal(b.collided, true);
  world.shoot(b, -20, 0); assert.equal(b.collided, false);
  const other = new PoolWorld(), c = other.add(775, 100);
  other.shoot(c, -140, 0); other.step(1 / 120);
  assert.equal(c.collided, false);
});

test('a collision pot awards once, and a direct pot awards nothing', () => {
  const world = new PoolWorld(), round = new PoolRound(() => 1000);
  world.pocket = { x: 300, y: 200, radius: 24 };
  world.onMove = () => round.start();
  world.onPot = ball => { if (ball.collided) round.reward(); };
  const a = world.add(200, 200), b = world.add(248, 200);
  world.shoot(a, -140, 0);
  for (let i = 0; i < 7; i++) world.step(1 / 120);
  assert.equal(b.potted, true); assert.equal(round.bonus, 5);
  world.pot(b); assert.equal(round.bonus, 5);
  const direct = world.add(270, 200); world.shoot(direct, -140, 0);
  world.step(1 / 120);
  assert.equal(direct.potted, true); assert.equal(direct.collided, false);
  assert.equal(round.bonus, 5);
});
