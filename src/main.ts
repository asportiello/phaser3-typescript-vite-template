import Phaser from 'phaser'
import CasaDoAnciaoScene from './scenes/CasaDoAnciaoScene'
import UIScene from './scenes/UIScene'
import VinhedoScene from './scenes/VinhedoScene'
import WorldScene from './scenes/WorldScene'

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  parent: 'app',
  width: 800,
  height: 600,
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 600 },
      debug: false
    }
  },
  scene: [CasaDoAnciaoScene, UIScene, VinhedoScene, WorldScene]
}

export default new Phaser.Game(config)
