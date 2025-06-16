import Phaser from 'phaser'
import CasaDoAnciaoScene from './scenes/CasaDoAnciaoScene'
import PreloadScene from './scenes/PreloadScene'
import UIScene from './scenes/UIScene'
import VinhedoScene from './scenes/VinhedoScene'
import WorldScene from './scenes/WorldScene'
import GameScene from './GameScene'

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  parent: 'app',
  width: 800,
  height: 600,
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 0 },
      debug: false
    }
  },
  scene: [PreloadScene, GameScene, CasaDoAnciaoScene, UIScene, VinhedoScene, WorldScene]
}

export default new Phaser.Game(config)
