import Phaser from 'phaser'

export default class GameScene extends Phaser.Scene {
  private player!: Phaser.Physics.Arcade.Sprite
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys
  private speed = 150

  constructor() {
    super('game')
  }

  preload() {
    // Load player spritesheet
    this.load.spritesheet('player_sprite', 'assets/Character.png', {
      frameWidth: 32,
      frameHeight: 32,
    })

    // Load house background
    this.load.image('inside-house', 'assets/House.png')
  }

  create() {
    // Background
    this.add.image(0, 0, 'inside-house').setOrigin(0, 0)

    // Player setup
    this.player = this.physics.add.sprite(128, 128, 'player_sprite')

    // World bounds & camera
    this.physics.world.setBounds(0, 0, 240, 160)
    this.player.setCollideWorldBounds(true)
    this.cameras.main.setBounds(0, 0, 240, 160)
    this.cameras.main.startFollow(this.player, true)

    // Controls
    this.cursors = this.input.keyboard.createCursorKeys()

    // Animations
    this.anims.create({
      key: 'walk-down',
      frames: this.anims.generateFrameNumbers('player_sprite', { start: 0, end: 3 }),
      frameRate: 8,
      repeat: -1,
    })
    this.anims.create({
      key: 'walk-left',
      frames: this.anims.generateFrameNumbers('player_sprite', { start: 4, end: 7 }),
      frameRate: 8,
      repeat: -1,
    })
    this.anims.create({
      key: 'walk-right',
      frames: this.anims.generateFrameNumbers('player_sprite', { start: 8, end: 11 }),
      frameRate: 8,
      repeat: -1,
    })
    this.anims.create({
      key: 'walk-up',
      frames: this.anims.generateFrameNumbers('player_sprite', { start: 12, end: 15 }),
      frameRate: 8,
      repeat: -1,
    })
  }

  update() {
    const body = this.player.body as Phaser.Physics.Arcade.Body

    // Reset velocity
    this.player.setVelocity(0)

    // Horizontal movement
    if (this.cursors.left?.isDown) {
      this.player.setVelocityX(-this.speed)
    } else if (this.cursors.right?.isDown) {
      this.player.setVelocityX(this.speed)
    }

    // Vertical movement
    if (this.cursors.up?.isDown) {
      this.player.setVelocityY(-this.speed)
    } else if (this.cursors.down?.isDown) {
      this.player.setVelocityY(this.speed)
    }

    // Normalize for diagonal movement
    body.velocity.normalize().scale(this.speed)

    // Animation logic
    if (body.velocity.y > 0) {
      this.player.anims.play('walk-down', true)
    } else if (body.velocity.y < 0) {
      this.player.anims.play('walk-up', true)
    } else if (body.velocity.x > 0) {
      this.player.anims.play('walk-right', true)
    } else if (body.velocity.x < 0) {
      this.player.anims.play('walk-left', true)
    } else {
      // Idle: keep last facing direction
      const key = this.player.anims.currentAnim?.key
      this.player.anims.stop()
      switch (key) {
        case 'walk-down':
          this.player.setFrame(0)
          break
        case 'walk-left':
          this.player.setFrame(4)
          break
        case 'walk-right':
          this.player.setFrame(8)
          break
        case 'walk-up':
          this.player.setFrame(12)
          break
        default:
          this.player.setFrame(0)
      }
    }
  }
}
