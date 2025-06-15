import Phaser from 'phaser'

export default class GameScene extends Phaser.Scene {
  private player!: Phaser.Physics.Arcade.Sprite
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys
  private jumpKey!: Phaser.Input.Keyboard.Key

  constructor() {
    super('game')
  }

  preload() {
    this.load.spritesheet('player', 'player.png', { frameWidth: 32, frameHeight: 48 })
  }

  create() {
    this.player = this.physics.add.sprite(100, 300, 'player')
    this.player.setCollideWorldBounds(true)

    this.cursors = this.input.keyboard.createCursorKeys()
    this.jumpKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE)

    this.cameras.main.startFollow(this.player)
  }

  update() {
    const body = this.player.body as Phaser.Physics.Arcade.Body
    body.setVelocityX(0)

    if (this.cursors.left?.isDown) {
      body.setVelocityX(-160)
    } else if (this.cursors.right?.isDown) {
      body.setVelocityX(160)
    }

    if (this.jumpKey.isDown && body.blocked.down) {
      body.setVelocityY(-330)
    }
  }
}
