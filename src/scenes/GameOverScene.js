import Phaser from 'phaser';

export class GameOverScene extends Phaser.Scene {
  constructor() { super('GameOverScene'); }
  create(data) {
    this.cameras.main.setBackgroundColor('#061b14');
    this.add.text(200, 170, '🌼 RUN OVER', { fontSize: '38px', fontStyle: 'bold', color: '#ffe782' }).setOrigin(.5);
    this.add.text(200, 255, `Score: ${data.score || 0}\nFlowers: ${data.flowers || 0}`, { fontSize: '24px', color: '#fff1c5', align: 'center', lineSpacing: 12 }).setOrigin(.5);
    const b = this.add.rectangle(200, 430, 240, 64, 0xdcae39).setStrokeStyle(3, 0xffe782).setInteractive({ useHandCursor: true });
    this.add.text(200, 430, 'RUN AGAIN', { fontSize: '22px', fontStyle: 'bold', color: '#183526' }).setOrigin(.5);
    b.on('pointerdown', () => this.scene.start('GameScene'));
  }
}
