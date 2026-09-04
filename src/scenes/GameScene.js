import Phaser from 'phaser';
import { Player } from '../entities/Player.js';
import { Collectible } from '../entities/Collectible.js';
import { GAME_SETTINGS, COLORS } from '../utils/Constants.js';

export class GameScene extends Phaser.Scene {
  constructor() { super('GameScene'); }

  create() {
    this.gameState = 'RUNNING';
    this.score = 0; this.flowers = 0; this.distance = 0;
    this.speed = GAME_SETTINGS.BASE_SPEED; this.spawnTimer = 0;
    this.obstacles = []; this.collectibles = []; this.flowerPool = [];
    this.bestScore = Number(localStorage.getItem('onamOdysseyBest') || 0);
    this.buildWorld(); this.createHud();
    this.player = new Player(this); this.createInput(); this.createMobileControls();
    this.events.once('shutdown', () => this.clearPools());
    this.updateHud();
  }

  buildWorld() {
    const cx = GAME_SETTINGS.WIDTH / 2;
    this.add.rectangle(cx, 350, 400, 700, COLORS.SKY).setDepth(-10);
    this.add.rectangle(cx, 400, 400, 330, COLORS.GRASS).setDepth(-9);
    this.add.rectangle(cx, 390, 300, 620, COLORS.ROAD).setDepth(-8);
    this.add.triangle(cx, 85, 80, 0, cx, 95, 320, 0, COLORS.GOLD).setAlpha(.75).setDepth(-7);
    this.add.text(cx, 82, 'ONAM ODYSSEY', { fontSize: '13px', fontStyle: 'bold', color: '#fff1c5' }).setOrigin(.5).setDepth(-6);
    for (const x of [154, 246]) this.add.rectangle(x, 395, 4, 610, COLORS.GOLD).setAlpha(.75).setDepth(-4);
    for (let y = -20; y < 760; y += 70) this.add.rectangle(cx, y, 210, 5, COLORS.GOLD).setAlpha(.8).setDepth(-3);
    for (let y = 120; y < 720; y += 120) for (const side of [-1, 1]) {
      const x = cx + side * 180;
      this.add.rectangle(x, y + 35, 15, 85, 0x704326).setDepth(-2);
      this.add.circle(x, y - 2, 42, 0x1e6a3e).setDepth(-2);
      this.add.circle(x + side * 18, y + 12, 25, 0x2f7f48).setDepth(-2);
    }
    this.add.rectangle(cx, 128, 310, 30, 0x163f2e, .92).setStrokeStyle(2, COLORS.GOLD).setDepth(4);
    this.add.text(cx, 128, '🌼 COLLECT FLOWERS • DODGE THE HAZARDS 🌼', {
      fontSize: '11px', fontStyle: 'bold', color: '#ffe782'
    }).setOrigin(.5).setDepth(5);
  }

  createHud() {
    const cx = GAME_SETTINGS.WIDTH / 2;
    this.hud = this.add.container(0, 0).setDepth(50);
    this.hud.add(this.add.rectangle(cx, 28, 380, 52, 0x061b14, .88).setStrokeStyle(2, COLORS.GOLD));
    this.scoreText = this.add.text(22, 14, 'SCORE 000000', { fontSize: '15px', fontStyle: 'bold', color: '#fff1c5' });
    this.flowerText = this.add.text(cx, 14, '🌼 0/3', { fontSize: '15px', fontStyle: 'bold', color: '#ffe782' }).setOrigin(.5, 0);
    this.speedText = this.add.text(378, 14, '1.0x', { fontSize: '15px', fontStyle: 'bold', color: '#bfead0' }).setOrigin(1, 0);
    this.hud.add([this.scoreText, this.flowerText, this.speedText]);
    this.sequenceText = this.add.text(cx, 112, 'POOKALAM: THUMBA → CHETTI → JAMANTHI', {
      fontSize: '10px', color: '#fff1c5', backgroundColor: '#163f2e', padding: { x: 8, y: 5 }
    }).setOrigin(.5).setDepth(51);
  }

  createInput() {
    this.input.keyboard.on('keydown-LEFT', () => this.player.moveLane(-1));
    this.input.keyboard.on('keydown-RIGHT', () => this.player.moveLane(1));
    this.input.keyboard.on('keydown-A', () => this.player.moveLane(-1));
    this.input.keyboard.on('keydown-D', () => this.player.moveLane(1));
    this.input.keyboard.on('keydown-UP', () => this.player.jump());
    this.input.keyboard.on('keydown-W', () => this.player.jump());
    this.input.keyboard.on('keydown-SPACE', () => this.player.jump());
    this.input.keyboard.on('keydown-P', () => this.togglePause());
    this.input.on('pointerdown', p => { this.touchStart = { x: p.x, y: p.y }; });
    this.input.on('pointerup', p => {
      if (!this.touchStart || this.gameState !== 'RUNNING') return;
      const dx = p.x - this.touchStart.x, dy = p.y - this.touchStart.y;
      this.touchStart = null;
      if (Math.max(Math.abs(dx), Math.abs(dy)) < 30) return;
      if (Math.abs(dx) > Math.abs(dy)) this.player.moveLane(dx > 0 ? 1 : -1);
      else if (dy < 0) this.player.jump();
    });
  }

  createMobileControls() {
    const makeButton = (x, y, label, action) => {
      const b = this.add.rectangle(x, y, 62, 52, 0x061b14, .78).setStrokeStyle(2, COLORS.GOLD).setInteractive();
      this.add.text(x, y, label, { fontSize: '22px', fontStyle: 'bold', color: '#ffe782' }).setOrigin(.5).setDepth(52);
      b.on('pointerdown', action); return b;
    };
    makeButton(62, 645, '←', () => this.player.moveLane(-1));
    makeButton(338, 645, '→', () => this.player.moveLane(1));
    makeButton(200, 645, '↑', () => this.player.jump());
    makeButton(365, 78, 'Ⅱ', () => this.togglePause());
    this.add.text(200, 682, 'SWIPE ← →  •  SWIPE ↑ TO JUMP', { fontSize: '9px', color: '#fff1c5' }).setOrigin(.5).setDepth(52);
  }

  spawnObstacle() {
    const lane = Phaser.Math.Between(0, 2), x = GAME_SETTINGS.LANES[lane] + 200, roll = Math.random();
    let obj;
    if (roll < .34) {
      obj = this.add.circle(x, -55, 23, 0x8b5a2b).setStrokeStyle(3, 0xe5b65b); obj.kind = 'coconut';
    } else if (roll < .67) {
      obj = this.add.rectangle(x, -65, 68, 50, 0xd47b25).setStrokeStyle(3, COLORS.GOLD); obj.kind = 'barricade';
    } else {
      obj = this.add.rectangle(x, -75, 72, 82, COLORS.BLUE).setStrokeStyle(3, COLORS.GOLD);
      this.add.rectangle(x, -75, 72, 12, COLORS.RED).setDepth(9); obj.kind = 'train';
    }
    obj.lane = lane; obj.setDepth(8); this.obstacles.push(obj);
  }

  spawnFlower() {
    const lane = Phaser.Math.Between(0, 2);
    const type = GAME_SETTINGS.POKALAM_SEQUENCE[this.flowers % GAME_SETTINGS.POKALAM_SEQUENCE.length];
    const c = this.flowerPool.pop() || new Collectible(this, 0, 0, type);
    c.reset(GAME_SETTINGS.LANES[lane] + 200, -40, type); c.lane = lane; this.collectibles.push(c);
  }

  collectFlower(c, i) {
    const points = c.collect(collected => this.flowerPool.push(collected));
    if (!points) return;
    this.flowers++; this.score += points; this.spawnPetals(c.x, c.y); this.collectibles.splice(i, 1);
    const labels = ['THUMBA', 'CHETTI', 'JAMANTHI'];
    this.sequenceText.setText(`POOKALAM: ${labels.map((x, n) => n < Math.min(this.flowers, 3) ? `✓ ${x}` : x).join('  →  ')}`);
  }

  spawnPetals(x, y) {
    for (let i = 0; i < 10; i++) {
      const p = this.add.circle(x, y, 3 + (i % 3), COLORS.GOLD);
      this.tweens.add({ targets: p, x: x + Phaser.Math.Between(-55, 55), y: y + Phaser.Math.Between(-45, 45), alpha: 0, angle: Phaser.Math.Between(-180, 180), duration: 450, onComplete: () => p.destroy() });
    }
  }

  checkCollisions() {
    for (const o of this.obstacles) {
      if (Math.abs(o.y - this.player.y) < 58 && o.lane === this.player.lane && this.player.isOnGround()) {
        if (this.player.hit()) { this.cameras.main.shake(160, .014); this.gameOver(); return; }
      }
    }
    for (let i = this.collectibles.length - 1; i >= 0; i--) {
      const c = this.collectibles[i];
      if (c.active && Math.abs(c.y - this.player.y) < 65 && c.lane === this.player.lane) this.collectFlower(c, i);
    }
  }

  togglePause() {
    if (this.gameState === 'OVER') return;
    this.gameState = this.gameState === 'PAUSED' ? 'RUNNING' : 'PAUSED';
    this.pauseLabel?.destroy();
    if (this.gameState === 'PAUSED') this.pauseLabel = this.add.text(200, 350, 'Ⅱ  PAUSED\n\nTap Ⅱ or press P to resume', {
      fontSize: '22px', fontStyle: 'bold', color: '#fff1c5', align: 'center', backgroundColor: '#061b14', padding: { x: 24, y: 18 }
    }).setOrigin(.5).setDepth(100);
  }

  gameOver() {
    this.gameState = 'OVER';
    const finalScore = Math.floor(this.score);
    if (finalScore > this.bestScore) { this.bestScore = finalScore; localStorage.setItem('onamOdysseyBest', String(finalScore)); }
    this.scene.launch('GameOverScene', { score: finalScore, flowers: this.flowers, best: this.bestScore });
  }

  update(time, delta) {
    if (this.gameState !== 'RUNNING') return;
    const dt = Math.min(delta, 50) / 1000;
    this.player.update(time, delta); this.spawnTimer += delta; this.distance += this.speed * dt; this.score += dt * 8;
    this.speed = Math.min(GAME_SETTINGS.MAX_SPEED, GAME_SETTINGS.BASE_SPEED + this.distance * GAME_SETTINGS.SPEED_RAMP / 1000);
    const interval = GAME_SETTINGS.SPAWN_INTERVAL * GAME_SETTINGS.BASE_SPEED / this.speed;
    if (this.spawnTimer > interval) { this.spawnTimer = 0; this.spawnObstacle(); if (Math.random() < .72) this.spawnFlower(); }
    for (let i = this.obstacles.length - 1; i >= 0; i--) {
      const o = this.obstacles[i]; o.y += this.speed * dt;
      if (o.y > GAME_SETTINGS.HEIGHT + 90) { o.destroy(); this.obstacles.splice(i, 1); }
    }
    for (let i = this.collectibles.length - 1; i >= 0; i--) {
      const c = this.collectibles[i]; c.y += this.speed * dt; c.rotation += dt * 4;
      if (c.y > GAME_SETTINGS.HEIGHT + 60) { c.setVisible(false); this.flowerPool.push(c); this.collectibles.splice(i, 1); }
    }
    this.checkCollisions(); this.updateHud();
  }

  updateHud() {
    if (!this.scoreText) return;
    this.scoreText.setText(`SCORE ${String(Math.floor(this.score)).padStart(6, '0')}`);
    this.flowerText.setText(`🌼 ${Math.min(this.flowers, 3)}/3`);
    this.speedText.setText(`${(this.speed / GAME_SETTINGS.BASE_SPEED).toFixed(1)}x`);
  }

  clearPools() { this.flowerPool.forEach(x => x.destroy()); this.flowerPool = []; }
}
