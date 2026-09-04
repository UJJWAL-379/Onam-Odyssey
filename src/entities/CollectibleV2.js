import Phaser from 'phaser';

const FLOWERS = {
  thumba: { color: 0xfff4dc, score: 10 },
  chetti: { color: 0xe84d3d, score: 15 },
  jamanthi: { color: 0xffcf3f, score: 20 }
};

export class CollectibleV2 extends Phaser.GameObjects.Container {
  constructor(scene, x, y, type = 'thumba') {
    super(scene, x, y);
    scene.add.existing(this);
    this.setDepth(10);
    this.glow = scene.add.circle(0, 0, 27, 0xffcf3f, .12);
    this.flower = scene.add.star(0, 0, 5, 9, 18, 0xffcf3f);
    this.center = scene.add.circle(0, 0, 5, 0xffa51f);
    this.add([this.glow, this.flower, this.center]);
    this.reset(x, y, type);
  }

  reset(x, y, type = 'thumba') {
    this.x = x; this.y = y; this.kind = type;
    this.info = FLOWERS[type] || FLOWERS.thumba;
    this.active = true;
    this.setVisible(true).setAlpha(1).setScale(1);
    this.glow.setFillStyle(this.info.color, .12);
    this.flower.setFillStyle(this.info.color, 1);
  }

  collect(onComplete) {
    if (!this.active) return 0;
    this.active = false;
    this.scene.tweens.add({
      targets: this, scale: 1.7, alpha: 0, duration: 180,
      onComplete: () => { this.setVisible(false); onComplete?.(this); }
    });
    return this.info.score;
  }
}
