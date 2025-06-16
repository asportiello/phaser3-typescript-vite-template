import Phaser from 'phaser'

export default class GameScene extends Phaser.Scene {
  private player!: Phaser.Physics.Arcade.Sprite
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys
  private speed = 150

  constructor() {
    super('game')
  }

  preload() {
    // Carrega a spritesheet e a imagem de fundo da casa
    this.load.spritesheet('player_sprite', 'assets/Character.png', {
      frameWidth: 32,
      frameHeight: 32
    })
    this.load.image('inside-house', 'assets/House.png')
  }

  create() {
    // Fundo da cena
    this.add.image(0, 0, 'inside-house').setOrigin(0, 0)

    // Jogador
    this.player = this.physics.add.sprite(128, 128, 'player_sprite')

    // Limites de colisão e mundo
    this.physics.world.setBounds(0, 0, 240, 160)
    this.player.setCollideWorldBounds(true)
    this.cameras.main.setBounds(0, 0, 240, 160)

    // Controles
    this.cursors = this.input.keyboard.createCursorKeys()

    this.anims.create({
      key: 'walk-down',
      frames: this.anims.generateFrameNumbers('player_sprite', { start: 0, end: 3 }),
      frameRate: 8,
      repeat: -1
    })
    this.anims.create({
      key: 'walk-left',
      frames: this.anims.generateFrameNumbers('player_sprite', { start: 4, end: 7 }),
      frameRate: 8,
      repeat: -1
    })
    this.anims.create({
      key: 'walk-right',
      frames: this.anims.generateFrameNumbers('player_sprite', { start: 8, end: 11 }),
      frameRate: 8,
      repeat: -1
    })
    this.anims.create({
      key: 'walk-up',
      frames: this.anims.generateFrameNumbers('player_sprite', { start: 12, end: 15 }),
      frameRate: 8,
      repeat: -1
    })

    this.cameras.main.startFollow(this.player, true)
  }

  update() {
    const body = this.player.body as Phaser.Physics.Arcade.Body

    // 1. Reseta a velocidade
    this.player.setVelocity(0)

    // 2. Calcula movimento horizontal e vertical independentemente
    if (this.cursors.left?.isDown) {
      this.player.setVelocityX(-this.speed)
    } else if (this.cursors.right?.isDown) {
      this.player.setVelocityX(this.speed)
    }

    if (this.cursors.up?.isDown) {
      this.player.setVelocityY(-this.speed)
    } else if (this.cursors.down?.isDown) {
      this.player.setVelocityY(this.speed)
    }

    // 3. Normaliza a velocidade para movimento diagonal consistente
    this.player.body.velocity.normalize().scale(this.speed)

    // 4. Lógica de animação correta
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
      } else if (last === 'walk-up') {
        this.player.setFrame(4)
      } else if (last === 'walk-left') {
        this.player.setFrame(8)
      } else if (last === 'walk-right') {
        this.player.setFrame(12)
      }
    }
  }
}
