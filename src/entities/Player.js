import Phaser from 'phaser';
import { GAME_SETTINGS } from '../utils/Constants.js';

export class Player extends Phaser.GameObjects.Container {
  constructor(scene) {
    super(scene, GAME_SETTINGS.WIDTH / 2, GAME_SETTINGS.PLAYER_Y);
    scene.add.existing(this);
    this.scene = scene;
    this.lane = 1;
    this.targetX = GAME_SETTINGS.LANES[1] + GAME_SETTINGS.WIDTH / 2;
    this.isJumping = false;
    this.invulnerableUntil = 0;
    this.runTime = 0;

    const shadow = scene.add.ellipse(0, 35, 48, 12, 0x000000, 0.22);
    const dhoti = scene.add.rectangle(0, 8, 52, 38, 0xf3dfae).setStrokeStyle(2, 0x9b7528);
    const body = scene.add.ellipse(0, -24, 42, 66, 0x1f7048);
    const head = scene.add.circle(0, -65, 19, 0xb96d43);
    const crown = scene.add.triangle(0, -94, -18, 18, 0, -12, 18, 18, 0xe0b535);
    const moustache = scene.add.rectangle(0, -62, 17, 3, 0x3a2418);
    this.leftArm = scene.add.rectangle(-28, -25, 10, 38, 0xb96d43).setOrigin(.5, 0);
    this.rightArm = scene.add.rectangle(28, -25, 10, 38, 0xb96d43).setOrigin(.5, 0);
    this.leftLeg = scene.add.rectangle(-13, 30, 11, 34, 0x6c422b).setOrigin(.5, 0);
    this.rightLeg = scene.add.rectangle(13, 30, 11, 34, 0x6c422b).setOrigin(.5, 0);
    this.add([shadow, dhoti, body, head, crown, moustache, this.leftArm, this.rightArm, this.leftLeg, this.rightLeg]);
    this.setDepth(20);
  }

  moveLane(direction) {
    const next = Phaser.Math.Clamp(this.lane + direction, 0, 2);
    if (next === this.lane || this.scene.gameState !== 'RUNNING') return false;
    this.lane = next;
    this.targetX = GAME_SETTINGS.LANES[next] + GAME_SETTINGS.WIDTH / 2;
    this.scene.tweens.add({ targets: this, x: this.targetX, duration: GAME_SETTINGS.LANE_SWITCH_TIME, ease: 'Cubic.easeOut' });
    return true;
  }

  jump() {
    if (this.isJumping || this.scene.gameState !== 'RUNNING') return false;
    this.isJumping = true;
    this.scene.tweens.add({
      targets: this,
      y: this.y - 175,
      duration: 360,
      ease: 'Sine.easeOut',
      yoyo: true,
      hold: 20,
      onComplete: () => { this.y = GAME_SETTINGS.PLAYER_Y; this.isJumping = false; }
    });
    return true;
  }

  hit() {
    if (this.scene.time.now < this.invulnerableUntil) return false;
    this.invulnerableUntil = this.scene.time.now + GAME_SETTINGS.INVULNERABLE_MS;
    this.scene.tweens.add({ targets: this, alpha: 0.25, duration: 90, yoyo: true, repeat: 5 });
    return true;
  }

  update(time, delta) {
    if (this.scene.gameState !== 'RUNNING') return;
    this.runTime += delta;
    const phase = this.runTime * 0.02;
    const amount = this.isJumping ? 0.12 : 1;
    this.leftArm.rotation = Math.sin(phase) * 0.55 * amount;
    this.rightArm.rotation = -Math.sin(phase) * 0.55 * amount;
    this.leftLeg.rotation = -Math.sin(phase) * 0.45 * amount;
    this.rightLeg.rotation = Math.sin(phase) * 0.45 * amount;
  }

  isOnGround() { return !this.isJumping; }
}
