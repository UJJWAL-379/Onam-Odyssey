import Phaser from 'phaser';

export class MainMenuScene extends Phaser.Scene {
  constructor() { super('MainMenuScene'); }

  create() {
    this.cameras.main.setBackgroundColor('#052a1c');
    const best = Number(localStorage.getItem('onamOdysseyBest') || 0);
    this.add.text(200, 95, '🌼  ഓണാശംസകൾ  🌼', { fontSize: '22px', color: '#ffd34e', fontStyle: 'bold' }).setOrigin(.5);
    this.add.text(200, 170, 'MAVELI RUN', { fontSize: '46px', fontStyle: 'bold', color: '#fff1c5' }).setOrigin(.5);
    this.add.text(200, 228, 'THE ONSADYA DASH', { fontSize: '15px', color: '#e8c66a', fontStyle: 'bold' }).setOrigin(.5);
    this.add.text(200, 295, 'RUN  •  DODGE  •  COLLECT  •  BUILD THE POOKALAM', {
      fontSize: '11px', color: '#bfead0', align: 'center'
    }).setOrigin(.5);
    this.add.rectangle(200, 365, 315, 115, 0x163f2e).setStrokeStyle(2, 0xffd34e);
    this.add.text(200, 365, '← → / A D   CHANGE LANE\n↑ / W / SPACE   JUMP\nSWIPE   MOVE ON MOBILE', {
      fontSize: '16px', align: 'center', color: '#ffffff', lineSpacing: 8
    }).setOrigin(.5);
    this.add.text(200, 455, `BEST SCORE  ${best}`, { fontSize: '14px', color: '#ffe782', fontStyle: 'bold' }).setOrigin(.5);

    const button = this.add.rectangle(200, 535, 260, 68, 0xdcae39).setStrokeStyle(3, 0xffe782).setInteractive({ useHandCursor: true });
    const label = this.add.text(200, 535, 'START RUN', { fontSize: '24px', fontStyle: 'bold', color: '#183526' }).setOrigin(.5);
    button.on('pointerover', () => { button.setFillStyle(0xf0c64f); label.setScale(1.04); });
    button.on('pointerout', () => { button.setFillStyle(0xdcae39); label.setScale(1); });
    button.on('pointerdown', () => this.scene.start('GameScene'));
  }
}
