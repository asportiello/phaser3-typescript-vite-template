import Phaser from 'phaser'

export default class PreloadScene extends Phaser.Scene {
  constructor() {
    super('preload')
  }

  preload() {
    this.load.image('base', 'Base.png')
    this.load.image('character', 'Character.png')
    this.load.spritesheet('player_sprite', 'Character.png', {
      frameWidth: 32,
      frameHeight: 32
    })
    this.load.image('inside-house', 'inside-house.png')
    this.load.image('house', 'House.png')
    this.load.image('tiles', 'Tiles.png')
    this.load.image('tree', 'Tree.png')
    this.load.image('elder', 'elder.png')
  }

  create() {
    this.scene.start('game')
  }
}
