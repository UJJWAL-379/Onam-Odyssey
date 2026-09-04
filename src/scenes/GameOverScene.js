import Phaser from 'phaser';

export class GameOverScene extends Phaser.Scene {
  constructor() { super('GameOverScene'); }

  create(data = {}) {
    this.cameras.main.setBackgroundColor('#061b14');
    this.add.text(200, 125, '🌼 RUN COMPLETE', { fontSize: '34px', fontStyle: 'bold', color: '#ffe782' }).setOrigin(.5);
    this.add.text(200, 190, 'Maveli made it through the festival road!', { fontSize: '14px', color: '#bfead0' }).setOrigin(.5);
    this.add.rectangle(200, 300, 300, 150, 0x163f2e).setStrokeStyle(2, 0xffd34e);
    this.add.text(200, 270, `SCORE  ${String(data.score || 0).padStart(6, '0')}`, { fontSize: '27px', fontStyle: 'bold', color: '#fff1c5' }).setOrigin(.5);
    this.add.text(200, 320, `Flowers collected: ${data.flowers || 0}/3`, { fontSize: '17px', color: '#ffe782' }).setOrigin(.5);
    this.add.text(200, 355, `Best score: ${data.best || data.score || 0}`, { fontSize: '15px', color: '#bfead0' }).setOrigin(.5);

    const again = this.add.rectangle(200, 465, 240, 62, 0xdcae39).setStrokeStyle(3, 0xffe782).setInteractive({ useHandCursor: true });
    this.add.text(200, 465, 'RUN AGAIN', { fontSize: '21px', fontStyle: 'bold', color: '#183526' }).setOrigin(.5);
    again.on('pointerdown', () => this.scene.start('GameScene'));

    const menu = this.add.text(200, 555, 'Back to title', { fontSize: '15px', color: '#fff1c5' }).setOrigin(.5).setInteractive({ useHandCursor: true });
    menu.on('pointerdown', () => this.scene.start('MainMenuScene'));
  }
}
