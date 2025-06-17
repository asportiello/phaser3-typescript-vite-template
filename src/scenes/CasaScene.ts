import Phaser from 'phaser'

export default class CasaScene extends Phaser.Scene {
  private player!: Phaser.Physics.Arcade.Sprite

  preload() {
    this.load.image('insideTiles', 'inside-house.png')
    this.load.tilemapTiledJSON('house', 'house.tmj')
    this.load.spritesheet('player', 'Character.png', {
      frameWidth: 32, frameHeight: 32
    })
  }

  create() {
    /* --------------- MAPA --------------- */
    const map     = this.make.tilemap({ key: 'house' })
    const tileset = map.addTilesetImage('starting house', 'insideTiles')

    map.createLayer('Ground', tileset, 0, 0)

    const furniture = map.createLayer('Furniture', tileset, 0, 0)

    // (a) tente cada um separadamente ─ só UM deve ficar ativo
    furniture.setCollisionByExclusion([0])            // TODO ①
    // furniture.setCollisionByProperty({ collides:true }) // TODO ②

    // Se Phaser < 3.55, descomente a linha abaixo
    // @ts-ignore
    // this.physics.world.convertTilemapLayer(furniture)

    /* --------------- PLAYER ------------- */
    this.player = this.physics.add.sprite(32, 96, 'player')
    .setScale(map.tileWidth / 32)                     // 0.5 se tile=16
    .setCollideWorldBounds(true)

    this.player.body
      .setSize(map.tileWidth - 2, map.tileHeight - 2)
      .setOffset(1, 1)

    this.physics.add.collider(this.player, furniture)

    /* --------------- CÂMERA ------------- */
    this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels)
    this.cameras.main.startFollow(this.player)

    /* --------------- DEBUG -------------- */
    // 1) mostra os corpos do Arcade
    this.physics.world.createDebugGraphic()

    // 2) pinta os tiles sólidos de vermelho
    const g = this.add.graphics().setAlpha(0.6)
    furniture.renderDebug(g, {
      tileColor: null,
      collidingTileColor: new Phaser.Display.Color(255, 0, 0),
      faceColor: new Phaser.Display.Color(0, 255, 0)
    })

    // 3) exibe versão do Phaser no console
    console.log('Phaser', Phaser.VERSION)
  }

  update() {
    const cursors = this.input.keyboard.createCursorKeys()
    const v = 150
    const body = this.player.body as Phaser.Physics.Arcade.Body
    body.setVelocity(
      (cursors.left?.isDown ? -v : 0) + (cursors.right?.isDown ? v : 0),
      (cursors.up?.isDown   ? -v : 0) + (cursors.down?.isDown  ? v : 0)
    )
    body.velocity.normalize().scale(v)
  }
}
