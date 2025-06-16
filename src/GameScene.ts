import Phaser from 'phaser'

export default class GameScene extends Phaser.Scene {
  private player!: Phaser.Physics.Arcade.Sprite
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys
  private speed = 150

  constructor() {
    super('game')
  }

  preload() {
    this.load.spritesheet('player_sprite', 'Character.png', {
      frameWidth: 32,
      frameHeight: 32
    })
  }

  create() {
    this.player = this.physics.add.sprite(100, 100, 'player_sprite')
    this.player.setCollideWorldBounds(true)

    this.cursors = this.input.keyboard.createCursorKeys()

    this.anims.create({
      key: 'walk-down',
      frames: this.anims.generateFrameNumbers('player_sprite', { start: 0, end: 3 }),
      frameRate: 10,
      repeat: -1
    })
    this.anims.create({
      key: 'walk-left',
      frames: this.anims.generateFrameNumbers('player_sprite', { start: 4, end: 7 }),
      frameRate: 10,
      repeat: -1
    })
    this.anims.create({
      key: 'walk-right',
      frames: this.anims.generateFrameNumbers('player_sprite', { start: 8, end: 11 }),
      frameRate: 10,
      repeat: -1
    })
    this.anims.create({
      key: 'walk-up',
      frames: this.anims.generateFrameNumbers('player_sprite', { start: 12, end: 15 }),
      frameRate: 10,
      repeat: -1
    })

    this.cameras.main.startFollow(this.player)
  }

  update() {
    const body = this.player.body as Phaser.Physics.Arcade.Body
    body.setVelocity(0)

    if (this.cursors.left?.isDown) {
      body.setVelocityX(-this.speed)
      this.player.anims.play('walk-left', true)
    } else if (this.cursors.right?.isDown) {
      body.setVelocityX(this.speed)
      this.player.anims.play('walk-right', true)
    } else if (this.cursors.up?.isDown) {
      body.setVelocityY(-this.speed)
      this.player.anims.play('walk-up', true)
    } else if (this.cursors.down?.isDown) {
      body.setVelocityY(this.speed)
      this.player.anims.play('walk-down', true)
    } else {
      this.player.anims.stop()
      this.player.setFrame(0)
    }
  }
}
