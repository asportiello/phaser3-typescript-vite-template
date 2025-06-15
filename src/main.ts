import Phaser from 'phaser'

import OpenWorldScene from './OpenWorldScene'

const config: Phaser.Types.Core.GameConfig = {
	type: Phaser.AUTO,
	parent: 'app',
	width: 800,
	height: 600,
        physics: {
                default: 'arcade',
                arcade: {
                        gravity: { y: 0 },
                },
        },
        scene: [OpenWorldScene],
}

export default new Phaser.Game(config)
