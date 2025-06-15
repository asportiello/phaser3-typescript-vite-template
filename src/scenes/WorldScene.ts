import Phaser from 'phaser'

export default class WorldScene extends Phaser.Scene {
  private player!: Phaser.Physics.Arcade.Sprite
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys

  constructor() {
    super('world')
  }

  create() {
    const width = 800
    const height = 600

    this.cameras.main.setBounds(0, 0, width, height)
    this.physics.world.setBounds(0, 0, width, height)

    this.add.tileSprite(width / 2, height / 2, width, height, 'tiles')

    this.player = this.physics.add.sprite(100, 100, 'character')
    this.player.setScale(0.25)
    this.player.setCollideWorldBounds(true)

    this.add.image(400, 300, 'house').setScale(0.5)
    this.add.image(600, 300, 'tree').setScale(0.5)

    this.cursors = this.input.keyboard.createCursorKeys()
    this.cameras.main.startFollow(this.player)
  }

  update() {
    const body = this.player.body as Phaser.Physics.Arcade.Body
    body.setVelocity(0)

    if (this.cursors.left?.isDown) {
      body.setVelocityX(-150)
    } else if (this.cursors.right?.isDown) {
      body.setVelocityX(150)
    }
    if (this.cursors.up?.isDown) {
      body.setVelocityY(-150)
    } else if (this.cursors.down?.isDown) {
      body.setVelocityY(150)
    }
  }
}
