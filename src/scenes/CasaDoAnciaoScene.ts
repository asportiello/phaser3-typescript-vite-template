import Phaser from 'phaser'

export default class CasaDoAnciaoScene extends Phaser.Scene {
  private player!: Phaser.Physics.Arcade.Sprite
  private npc!: Phaser.Physics.Arcade.Sprite
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys
  private interactKey!: Phaser.Input.Keyboard.Key
  private newDoor?: Phaser.GameObjects.Rectangle
  private uiScene!: Phaser.Scene
  private tileSize = 16
  private debugGraphics?: Phaser.GameObjects.Graphics

  private npcData = {
    question: 'Qual \u00e9 a palavra secreta?',
    answer: 'esp\u00edrito',
    successDialogue: 'Muito bem, jovem. A porta se abriu!'
  }

  constructor() {
    super('casa-do-anciao')
  }

  preload() {
    this.load.spritesheet('player_sprite', 'Character.png', {
      frameWidth: 32,
      frameHeight: 32
    })
    this.load.image('elder', 'elder.png')
    this.load.image('tiles_casa', 'Tiles.png')
    this.load.tilemapTiledJSON('mapa_casa', 'home-inside.tmj')
  }

  create() {
    const map = this.make.tilemap({ key: 'mapa_casa' })
    const tileset = map.addTilesetImage('Tiles', 'tiles_casa')
    const tileSize = map.tileWidth
    this.tileSize = tileSize

    map.createLayer('Ground', tileset)
    const furnitureLayer = map.createLayer('Furniture', tileset)
    furnitureLayer.setCollisionByExclusion([0])
    // convert tilemap layer into Arcade bodies (not in typings)
    // @ts-ignore
    this.physics.world.convertTilemapLayer(furnitureLayer)

    this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels)
    this.physics.world.setBounds(0, 0, map.widthInPixels, map.heightInPixels)

    this.player = this.physics.add
      .sprite(map.tileWidth * 2, map.tileHeight * 6, 'player_sprite')
      .setScale(map.tileWidth / 32)
    const playerBody = this.player.body as Phaser.Physics.Arcade.Body
    playerBody.setSize(map.tileWidth, map.tileWidth).setOffset(0, 0)
    this.player.setCollideWorldBounds(true)
    this.physics.add.collider(this.player, furnitureLayer)

    // Debug visualization for collision tiles
    this.debugGraphics = this.add.graphics().setAlpha(0.6)
    furnitureLayer.renderDebug(this.debugGraphics, {
      tileColor: null,
      collidingTileColor: new Phaser.Display.Color(255, 0, 0),
      faceColor: new Phaser.Display.Color(0, 255, 0),
    })

    this.anims.create({
      key: 'walk-down',
      frames: this.anims.generateFrameNumbers('player_sprite', { start: 0, end: 3 }),
      frameRate: 10,
      repeat: -1
    })
    this.anims.create({
      key: 'walk-up',
      frames: this.anims.generateFrameNumbers('player_sprite', { start: 4, end: 7 }),
      frameRate: 10,
      repeat: -1
    })
    this.anims.create({
      key: 'walk-left',
      frames: this.anims.generateFrameNumbers('player_sprite', { start: 8, end: 11 }),
      frameRate: 10,
      repeat: -1
    })
    this.anims.create({
      key: 'walk-right',
      frames: this.anims.generateFrameNumbers('player_sprite', { start: 12, end: 15 }),
      frameRate: 10,
      repeat: -1
    })

    this.npc = this.physics.add.staticSprite(tileSize * 5, tileSize * 3, 'elder')
    this.npc.setScale(tileSize / 1024, (tileSize * 2) / 1024)
    this.npc.refreshBody()

    this.cursors = this.input.keyboard.createCursorKeys()
    this.interactKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E)

    this.scene.launch('ui')
    this.uiScene = this.scene.get('ui')
    this.uiScene.events.on('submitAnswer', this.handleAnswer, this)

    this.cameras.main.startFollow(this.player)
  }

  update() {
    const body = this.player.body as Phaser.Physics.Arcade.Body
    body.setVelocity(0)

    if (this.cursors.left?.isDown) {
      body.setVelocityX(-150)
      this.player.anims.play('walk-left', true)
    } else if (this.cursors.right?.isDown) {
      body.setVelocityX(150)
      this.player.anims.play('walk-right', true)
    } else if (this.cursors.up?.isDown) {
      body.setVelocityY(-150)
      this.player.anims.play('walk-up', true)
    } else if (this.cursors.down?.isDown) {
      body.setVelocityY(150)
      this.player.anims.play('walk-down', true)
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

    const dist = Phaser.Math.Distance.Between(this.player.x, this.player.y, this.npc.x, this.npc.y)
    if (dist < 50 && Phaser.Input.Keyboard.JustDown(this.interactKey)) {
      this.uiScene.events.emit('showQuestion', this.npcData.question)
    }
  }

  private handleAnswer(answer: string) {
    if (answer.trim().toLowerCase() === this.npcData.answer) {
      this.uiScene.events.emit('showSuccess', this.npcData.successDialogue)
      this.time.delayedCall(3000, () => this.createDoor())
    } else {
      this.uiScene.events.emit('showGameOver')
    }
  }

  private createDoor() {
    if (this.newDoor) return
    const tileSize = this.tileSize
    const x = tileSize * 1.5
    const y = tileSize
    this.newDoor = this.add.rectangle(x, y, tileSize, tileSize * 2, 0xf6e05e)
    this.physics.add.existing(this.newDoor, true)
    this.physics.add.overlap(this.player, this.newDoor, () => {
      this.scene.start('vinhedo')
    })
  }
}
