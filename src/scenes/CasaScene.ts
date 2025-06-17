import Phaser from 'phaser'

export default class CasaScene extends Phaser.Scene {
  private player!: Phaser.Physics.Arcade.Sprite

  preload() {
    // imagem usada pelo tileset externo
    this.load.image('insideTiles', 'inside-house.png')

    // mapa Tiled (formato .tmj / JSON)
    this.load.tilemapTiledJSON('house', 'house.tmj')

    // spritesheet do jogador
    this.load.spritesheet('player', 'Character.png', {
      frameWidth: 32,
      frameHeight: 32
    })
  }

  create() {
    /* --- MAPA --- */
    const map = this.make.tilemap({ key: 'house' })
    const tileset = map.addTilesetImage('starting house', 'insideTiles') // nome idêntico ao .tsx

    map.createLayer('Ground', tileset, 0, 0)

    const furniture = map.createLayer('Furniture', tileset, 0, 0)
    // marca como sólidos todos os tiles diferentes de 0
    furniture.setCollisionByExclusion([0])
    // @ts-ignore (função não tipada, mas existe)
    this.physics.world.convertTilemapLayer(furniture)

    /* --- JOGADOR --- */
    this.player = this.physics.add
      .sprite(32, 96, 'player')
      .setScale(map.tileWidth / 32) // se tile = 16px, escala = 0.5

    // hitbox ligeiramente menor para evitar prender em quinas
    const body = this.player.body as Phaser.Physics.Arcade.Body
    body.setSize(map.tileWidth - 2, map.tileHeight - 2).setOffset(1, 1)

    this.physics.add.collider(this.player, furniture)

    /* --- CONTROLES --- */
    this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels)
    this.cameras.main.startFollow(this.player)

    /* --- DEBUG VISUAL --- */
    const debug = this.add.graphics().setAlpha(0.6)
    furniture.renderDebug(debug, {
      tileColor: null,
      collidingTileColor: new Phaser.Display.Color(255, 0, 0), // móveis em vermelho
      faceColor: new Phaser.Display.Color(0, 255, 0)
    })
  }

  update() {
    const cursors = this.input.keyboard.createCursorKeys()
    const speed = 150
    const body = this.player.body as Phaser.Physics.Arcade.Body

    body.setVelocity(0)
    if (cursors.left?.isDown)  body.setVelocityX(-speed)
    if (cursors.right?.isDown) body.setVelocityX(speed)
    if (cursors.up?.isDown)    body.setVelocityY(-speed)
    if (cursors.down?.isDown)  body.setVelocityY(speed)
    body.velocity.normalize().scale(speed)
  }
}
