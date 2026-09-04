import Phaser from 'phaser';

export class MainMenuScene extends Phaser.Scene {
  constructor() { super('MainMenuScene'); }
  create() {
    this.cameras.main.setBackgroundColor('#052a1c');
    this.add.text(200, 130, 'ഓണാശംസകൾ', { fontSize: '24px', color: '#ffd34e' }).setOrigin(.5);
    this.add.text(200, 205, 'MAVELI RUN', { fontSize: '48px', fontStyle: 'bold', color: '#fff1c5' }).setOrigin(.5);
    this.add.text(200, 285, 'THE ONSADYA DASH', { fontSize: '16px', color: '#e8c66a' }).setOrigin(.5);
    this.add.text(200, 355, '← →  Change lane\n↑ / SPACE  Jump\nSwipe  Move on mobile', { fontSize: '18px', align: 'center', color: '#ffffff', lineSpacing: 10 }).setOrigin(.5);
    const button = this.add.rectangle(200, 485, 260, 70, 0xdcae39).setStrokeStyle(3, 0xffe782).setInteractive({ useHandCursor: true });
    this.add.text(200, 485, 'START RUN', { fontSize: '24px', fontStyle: 'bold', color: '#183526' }).setOrigin(.5);
    button.on('pointerdown', () => this.scene.start('GameScene'));
  }
}
