import Phaser from 'phaser'

export default class VinhedoScene extends Phaser.Scene {
  constructor() {
    super('vinhedo')
  }

  preload() {}

  create() {
    this.add.text(200, 200, 'VinhedoScene', { font: '20px Arial', color: '#ffffff' })
  }
}
