import Phaser from 'phaser'

/**
 * Sprite sheet layout (32×32 each cell, 4×4 grid – indices):
 *
 *  0   1   2   3
 *  4   5   6   7
 *  8   9  10  11
 * 12  13  14  15
 *
 *  • Down (looking south):   0, 4, 8, 12
 *  • Up   (looking north):   1, 5, 9, 13
 *  • Right(looking east):    2, 6, 10, 14
 *  • Left (looking west):    3, 7, 11, 15
 */
export default class GameScene extends Phaser.Scene {
  private player!: Phaser.Physics.Arcade.Sprite
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys
  private speed = 150

  constructor() {
    super('game')
  }

  preload() {
    // Load player sprite sheet
    this.load.spritesheet('player_sprite', 'assets/Character.png', {
      frameWidth: 32,
      frameHeight: 32,
    })

    // Load background image
    this.load.image('inside-house', 'assets/House.png')
  }

  create() {
    // Add background
    this.add.image(0, 0, 'inside-house').setOrigin(0, 0)

    // Create player
    this.player = this.physics.add.sprite(128, 128, 'player_sprite')

    // World & camera bounds
    this.physics.world.setBounds(0, 0, 240, 160)
    this.player.setCollideWorldBounds(true)

    this.cameras.main.setBounds(0, 0, 240, 160)
    this.cameras.main.startFollow(this.player, true)

    // Keyboard controls
    this.cursors = this.input.keyboard.createCursorKeys()

    // -----------------------------------------------------
    // Animation definitions (use non‑contiguous frames!)
    // -----------------------------------------------------
    const make = (key: string, frames: number[]) =>
      this.anims.create({
        key,
        frames: this.anims.generateFrameNumbers('player_sprite', { frames }),
        frameRate: 8,
        repeat: -1,
      })

    make('walk-down', [0, 4, 8, 12])  // front
    make('walk-up', [1, 5, 9, 13])    // back
    make('walk-right', [2, 6, 10, 14])// right profile
    make('walk-left', [3, 7, 11, 15]) // left profile
  }

  update() {
    const body = this.player.body as Phaser.Physics.Arcade.Body

    // Reset velocity every tick
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

    // Normalise for diagonal speed
    body.velocity.normalize().scale(this.speed)

    // Choose animation based on velocity direction
    if (body.velocity.y > 0) {
      this.player.anims.play('walk-down', true)
    } else if (body.velocity.y < 0) {
      this.player.anims.play('walk-up', true)
    } else if (body.velocity.x > 0) {
      this.player.anims.play('walk-right', true)
    } else if (body.velocity.x < 0) {
      this.player.anims.play('walk-left', true)
    } else {
      // Idle: stop current animation & show first frame of last anim
      const lastKey = this.player.anims.currentAnim?.key
      this.player.anims.stop()

      switch (lastKey) {
        case 'walk-up':
          this.player.setFrame(1)
          break
        case 'walk-left':
          this.player.setFrame(3)
          break
        case 'walk-right':
          this.player.setFrame(2)
          break
        default: // walk‑down or undefined
          this.player.setFrame(0)
      }
    }
  }
}
