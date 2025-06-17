import Phaser from 'phaser'

export default class CasaScene extends Phaser.Scene {
  private player!: Phaser.Physics.Arcade.Sprite

  preload() {
    this.load.image('insideTiles', 'inside-house.png')
    this.load.tilemapTiledJSON('house', 'house.tmj')
    this.load.spritesheet('player', 'Character.png',
      { frameWidth: 32, frameHeight: 32 })
  }

  create() {
    /* MAPA --------------------------------------------------- */
    const map     = this.make.tilemap({ key: 'house' })
    const tileset = map.addTilesetImage('starting house', 'insideTiles')

    map.createLayer('Ground', tileset, 0, 0)

    // camada de móveis
    const furniture = map.createLayer('Furniture', tileset, 0, 0)

    // colide com todos os tiles diferentes de -1
    furniture.setCollisionByExclusion([-1])

    // cria corpos Arcade para cada tile sólido
    // (necessário até Phaser 3.55.x)
    // @ts-ignore — não aparece na tipagem
    this.physics.world.convertTilemapLayer(furniture)

    /* PLAYER ------------------------------------------------- */
    this.player = this.physics.add
      .sprite(32, 96, 'player')
      .setScale(map.tileWidth / 32)

    const body = this.player.body as Phaser.Physics.Arcade.Body
    body.setSize(map.tileWidth - 2, map.tileHeight - 2).setOffset(1, 1)

    this.physics.add.collider(this.player, furniture)

    /* CÂMERA ------------------------------------------------- */
    this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels)
    this.cameras.main.startFollow(this.player)

    /* DEBUG -------------------------------------------------- */
    // 1) mostra TODOS os corpos estáticos (azul) e dinâmicos (verde)
    this.physics.world.createDebugGraphic()

    // 2) pinta de vermelho os tiles sólidos
    const g = this.add.graphics().setAlpha(0.6)
    furniture.renderDebug(g, {
      tileColor: null,
      collidingTileColor: new Phaser.Display.Color(255, 0, 0),
      faceColor: new Phaser.Display.Color(0, 255, 0)
    })
  }

  update() {
    const cursors = this.input.keyboard.createCursorKeys()
    const speed   = 150
    const body    = this.player.body as Phaser.Physics.Arcade.Body

    body.setVelocity(
      (cursors.left?.isDown ? -speed : 0) + (cursors.right?.isDown ? speed : 0),
      (cursors.up?.isDown   ? -speed : 0) + (cursors.down?.isDown  ? speed : 0)
    )
    body.velocity.normalize().scale(speed)
  }
}
