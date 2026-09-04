import Phaser from 'phaser';
import { Player } from '../entities/Player.js';
import { Collectible } from '../entities/Collectible.js';
import { GAME_SETTINGS, COLORS } from '../utils/Constants.js';

export class GameScene extends Phaser.Scene {
  constructor() { super('GameScene'); }

  create() {
    this.gameState = 'RUNNING';
    this.score = 0; this.flowers = 0; this.distance = 0;
    this.speed = GAME_SETTINGS.BASE_SPEED;
    this.spawnTimer = 0;
    this.obstacles = [];
    this.collectibles = [];
    this.flowerPool = [];
    this.buildWorld();
    this.player = new Player(this);
    this.createInput();
    this.events.on('shutdown', () => this.clearPools());
    this.updateHud();
  }

  buildWorld() {
    this.add.rectangle(GAME_SETTINGS.WIDTH / 2, GAME_SETTINGS.HEIGHT / 2, GAME_SETTINGS.WIDTH, GAME_SETTINGS.HEIGHT, COLORS.SKY).setDepth(-10);
    this.road = this.add.rectangle(GAME_SETTINGS.WIDTH / 2, GAME_SETTINGS.HEIGHT / 2 + 40, 300, 760, COLORS.ROAD).setDepth(-5);
    for (const x of [GAME_SETTINGS.WIDTH / 2 - 46, GAME_SETTINGS.WIDTH / 2 + 46]) this.add.rectangle(x, 370, 4, 660, COLORS.GOLD).setAlpha(.75).setDepth(-4);
    for (let y = -20; y < 760; y += 70) this.add.rectangle(GAME_SETTINGS.WIDTH / 2, y, 210, 5, COLORS.GOLD).setDepth(-3);
    for (let y = 60; y < 720; y += 120) {
      for (const side of [-1, 1]) {
        const x = GAME_SETTINGS.WIDTH / 2 + side * 180;
        this.add.rectangle(x, y + 20, 18, 90, 0x704326).setDepth(-2);
        this.add.circle(x, y - 15, 42, 0x1e6a3e).setDepth(-2);
      }
    }
  }

  createInput() {
    this.cursors = this.input.keyboard.createCursorKeys();
    this.keys = this.input.keyboard.addKeys('A,D,W');
    this.lastLeft = false; this.lastRight = false; this.lastJump = false;
    this.input.on('pointerdown', p => { this.touchStart = { x: p.x, y: p.y }; });
    this.input.on('pointerup', p => {
      if (!this.touchStart) return;
      const dx = p.x - this.touchStart.x, dy = p.y - this.touchStart.y;
      this.touchStart = null;
      if (Math.max(Math.abs(dx), Math.abs(dy)) < 30) return;
      if (Math.abs(dx) > Math.abs(dy)) this.player.moveLane(dx > 0 ? 1 : -1); else if (dy < 0) this.player.jump();
    });
  }

  spawnObstacle() {
    const lane = Phaser.Math.Between(0, 2);
    const x = GAME_SETTINGS.LANES[lane] + GAME_SETTINGS.WIDTH / 2;
    const train = Math.random() < .5;
    const h = train ? 74 : 48, w = train ? 70 : 66;
    const obj = this.add.rectangle(x, -70, w, h, train ? COLORS.BLUE : 0xd47b25).setStrokeStyle(3, 0x222222).setDepth(8);
    obj.kind = 'obstacle'; obj.lane = lane; obj.hit = false;
    this.obstacles.push(obj);
  }

  spawnFlower() {
    const lane = Phaser.Math.Between(0, 2), types = GAME_SETTINGS.POKALAM_SEQUENCE;
    const type = types[this.flowers % types.length];
    const c = this.flowerPool.pop() || new Collectible(this, 0, 0, type);
    c.reset(GAME_SETTINGS.LANES[lane] + GAME_SETTINGS.WIDTH / 2, -40, type);
    c.lane = lane; this.collectibles.push(c);
  }

  recycleObstacle(o, i) {
    o.setVisible(false); o.destroy(); this.obstacles.splice(i, 1);
  }

  collectFlower(c, i) {
    this.flowers++;
    this.score += c.collect() || 10;
    this.spawnPetals(c.x, c.y);
    this.collectibles.splice(i, 1);
    this.time.delayedCall(250, () => this.flowerPool.push(c));
  }

  spawnPetals(x, y) {
    for (let i = 0; i < 8; i++) {
      const p = this.add.circle(x, y, 4, COLORS.GOLD);
      this.tweens.add({ targets: p, x: x + Phaser.Math.Between(-45,45), y: y + Phaser.Math.Between(-35,35), alpha: 0, duration: 450, onComplete: () => p.destroy() });
    }
  }

  checkCollisions() {
    for (let i = this.obstacles.length - 1; i >= 0; i--) {
      const o = this.obstacles[i];
      if (!o.visible) continue;
      const nearY = Math.abs(o.y - this.player.y) < 55;
      const sameLane = o.lane === this.player.lane;
      if (nearY && sameLane && this.player.isOnGround()) {
        if (this.player.hit()) {
          this.cameras.main.shake(120, .012);
          this.gameOver();
          return;
        }
      }
    }
    for (let i = this.collectibles.length - 1; i >= 0; i--) {
      const c = this.collectibles[i];
      if (c.active && Math.abs(c.y - this.player.y) < 65 && c.lane === this.player.lane) this.collectFlower(c, i);
    }
  }

  gameOver() {
    this.gameState = 'OVER';
    this.scene.launch('GameOverScene', { score: Math.floor(this.score), flowers: this.flowers });
  }

  update(time, delta) {
    if (this.gameState !== 'RUNNING') return;
    const dt = delta / 1000;
    this.player.update(time, delta);
    this.spawnTimer += delta;
    this.distance += this.speed * dt;
    this.score += dt * 8;
    this.speed = Math.min(GAME_SETTINGS.MAX_SPEED, GAME_SETTINGS.BASE_SPEED + this.distance * GAME_SETTINGS.SPEED_RAMP / 1000);
    if (this.spawnTimer > GAME_SETTINGS.SPAWN_INTERVAL * GAME_SETTINGS.BASE_SPEED / this.speed) {
      this.spawnTimer = 0; this.spawnObstacle(); if (Math.random() < .7) this.spawnFlower();
    }
    for (let i = this.obstacles.length - 1; i >= 0; i--) { const o = this.obstacles[i]; o.y += this.speed * dt; if (o.y > GAME_SETTINGS.HEIGHT + 80) this.recycleObstacle(o, i); }
    for (let i = this.collectibles.length - 1; i >= 0; i--) { const c = this.collectibles[i]; c.y += this.speed * dt; c.rotation += dt * 4; if (c.y > GAME_SETTINGS.HEIGHT + 50) { c.setVisible(false); this.flowerPool.push(c); this.collectibles.splice(i,1); } }
    this.checkCollisions();
    this.updateHud();
  }

  updateHud() { this.scene.get('MainMenuScene')?.events.emit('hud', { score: Math.floor(this.score), flowers: this.flowers, speed: (this.speed / GAME_SETTINGS.BASE_SPEED).toFixed(1) }); }
  clearPools() { this.flowerPool.forEach(x => x.destroy()); this.flowerPool = []; }
}
