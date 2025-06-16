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
    const width = this.scale.width
    const height = this.scale.height

    this.cameras.main.setBounds(0, 0, width, height)
    this.physics.world.setBounds(0, 0, width, height)

    this.add.tileSprite(width / 2, height / 2, width, height, 'base')

    this.player = this.physics.add.sprite(width / 2, height / 2, 'player_sprite')
    this.player.setCollideWorldBounds(true)

    // simple furniture
    this.add.rectangle(width / 2, height - 40, 64, 64, 0x222222)
    this.add.rectangle(width / 2 - 100, height / 2 + 50, 80, 40, 0x664422)
    this.add.rectangle(width / 2 + 100, height / 2 + 50, 80, 40, 0x664422)

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

    // 1. Reset current velocity
    this.player.setVelocity(0)

    // 2. Horizontal movement
    if (this.cursors.left?.isDown) {
      body.velocity.x = -this.speed
    } else if (this.cursors.right?.isDown) {
      body.velocity.x = this.speed
    }

    // 3. Vertical movement
    if (this.cursors.up?.isDown) {
      body.velocity.y = -this.speed
    } else if (this.cursors.down?.isDown) {
      body.velocity.y = this.speed
    }

    // 4. Normalize diagonal movement
    body.velocity.normalize().scale(this.speed)

    // 5. Decide which animation to play
    if (body.velocity.y > 0) {
      this.player.anims.play('walk-down', true)
    } else if (body.velocity.y < 0) {
      this.player.anims.play('walk-up', true)
    } else if (body.velocity.x > 0) {
      this.player.anims.play('walk-right', true)
    } else if (body.velocity.x < 0) {
      this.player.anims.play('walk-left', true)
    } else {
      this.player.anims.stop()
      const last = this.player.anims.currentAnim?.key
      if (last === 'walk-down') {
        this.player.setFrame(0)
      } else if (last === 'walk-left') {
        this.player.setFrame(4)
      } else if (last === 'walk-right') {
        this.player.setFrame(8)
      } else if (last === 'walk-up') {
        this.player.setFrame(12)
      }
    }
  }
}
