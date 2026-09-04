import Phaser from 'phaser';
import { GAME_SETTINGS } from './utils/Constants.js';
import { BootScene } from './scenes/BootScene.js';
import { MainMenuScene } from './scenes/MainMenuScene.js';
import { GameScene } from './scenes/GameScene.js';
import { GameOverScene } from './scenes/GameOverScene.js';

const config = {
  type: Phaser.AUTO,
  width: GAME_SETTINGS.WIDTH,
  height: GAME_SETTINGS.HEIGHT,
  backgroundColor: '#052a1c',
  parent: 'game',
  scale: { mode: Phaser.Scale.RESIZE, autoCenter: Phaser.Scale.CENTER_BOTH },
  render: { antialias: true, roundPixels: true },
  scene: [BootScene, MainMenuScene, GameScene, GameOverScene]
};

new Phaser.Game(config);
