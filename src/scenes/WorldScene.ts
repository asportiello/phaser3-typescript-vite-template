import Phaser from 'phaser'

export default class WorldScene extends Phaser.Scene {
  constructor() {
    super('world')
  }

  preload() {}

  create() {
    this.add.text(200, 200, 'World Scene', { font: '20px Arial', color: '#ffffff' })
  }
}
