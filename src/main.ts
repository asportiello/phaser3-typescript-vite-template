import Phaser from 'phaser'
import ElderHouseScene from './scenes/ElderHouseScene'
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
  scene: [ElderHouseScene, WorldScene]
}

export default new Phaser.Game(config)
