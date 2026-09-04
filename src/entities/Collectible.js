import Phaser from 'phaser';

const FLOWERS = {
  thumba: { color: 0xfff4dc, label: 'THUMBA', score: 10 },
  chetti: { color: 0xe84d3d, label: 'CHETTI', score: 15 },
  jamanthi: { color: 0xffcf3f, label: 'JAMANTHI', score: 20 }
};

export class Collectible extends Phaser.GameObjects.Container {
  constructor(scene, x, y, type = 'thumba') {
    super(scene, x, y);
    this.kind = type;
    this.active = true;
    this.info = FLOWERS[type] || { color: 0xffcf3f, label: 'FLOWER', score: 10 };
    const glow = scene.add.circle(0, 0, 25, this.info.color, .12);
    const flower = scene.add.star(0, 0, 5, 9, 18, this.info.color);
    const center = scene.add.circle(0, 0, 5, 0xffa51f);
    this.add([glow, flower, center]);
    scene.add.existing(this);
    this.setDepth(10);
  }

  reset(x, y, type) {
    this.x = x; this.y = y; this.kind = type; this.active = true; this.setVisible(true); this.setAlpha(1);
  }

  collect() {
    if (!this.active) return 0;
    this.active = false;
    this.scene.tweens.add({ targets: this, scale: 1.7, alpha: 0, duration: 180, onComplete: () => this.setVisible(false) });
    return this.info.score;
  }
}
