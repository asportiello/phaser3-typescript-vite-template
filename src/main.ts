import Phaser from 'phaser'

/* cenas */
import PreloadScene      from './scenes/PreloadScene'
import CasaScene         from './scenes/CasaScene'          // ← a principal para testar colisão
import CasaDoAnciaoScene from './scenes/CasaDoAnciaoScene'
import GameScene         from './GameScene'
import UIScene           from './scenes/UIScene'
import VinhedoScene      from './scenes/VinhedoScene'
import WorldScene        from './scenes/WorldScene'

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  parent: 'app',
  width: 240,          // 15 × 10 tiles de 16 px
  height: 160,
  pixelArt: true,      // evita blur nos pixels
  backgroundColor: '#000',
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 0 },
      debug: true       // ⇐ mostra retângulos verde/azul no runtime
    }
  },
  /* ordem importa: a primeira que der `this.scene.start()` fica em foco */
  scene: [
    PreloadScene,      // carrega assets e depois: this.scene.start('CasaScene')
    CasaScene,         // <-- teste de colisão
    CasaDoAnciaoScene,
    GameScene,
    UIScene,
    VinhedoScene,
    WorldScene
  ]
}

export default new Phaser.Game(config)
