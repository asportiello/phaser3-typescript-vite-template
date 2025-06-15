import Phaser from 'phaser'
import gameData from '../GameDataManager'

export default class ElderHouseScene extends Phaser.Scene {
  private player!: Phaser.GameObjects.Rectangle
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys
  private interactKey!: Phaser.Input.Keyboard.Key
  private door?: Phaser.GameObjects.Rectangle

  constructor() {
    super('elder-house')
  }

  preload() {}

  create() {
    const map = gameData.maps.elder_house
    const tileSize = map.tileSize
    const width = map.width * tileSize
    const height = map.height * tileSize

    this.cameras.main.setBounds(0, 0, width, height)
    this.physics.world.setBounds(0, 0, width, height)

    // simple floor
    this.add.rectangle(width / 2, height / 2, width, height, 0x888888)

    // create player
    this.player = this.add.rectangle(tileSize * 2, tileSize * 6, tileSize, tileSize, 0x00ff00)
    this.physics.add.existing(this.player)
    const body = this.player.body as Phaser.Physics.Arcade.Body
    body.setCollideWorldBounds(true)

    // add scenery
    map.scenery.forEach(obj => {
      const x = obj.x * tileSize + tileSize / 2
      const y = obj.y * tileSize + tileSize / 2
      if (obj.type === 'table') {
        this.add.rectangle(x, y, tileSize * 2, tileSize, 0x664422)
      } else if (obj.type === 'door') {
        const door = this.add.rectangle(x, y, tileSize, tileSize * 2, 0x222222)
        this.physics.add.existing(door, true)
        this.door = door
      }
    })

    this.cursors = this.input.keyboard.createCursorKeys()
    this.interactKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE)

    this.cameras.main.startFollow(this.player)
  }

  update() {
    const body = this.player.body as Phaser.Physics.Arcade.Body
    body.setVelocity(0)

    if (this.cursors.left?.isDown) {
      body.setVelocityX(-150)
    } else if (this.cursors.right?.isDown) {
      body.setVelocityX(150)
    }
    if (this.cursors.up?.isDown) {
      body.setVelocityY(-150)
    } else if (this.cursors.down?.isDown) {
      body.setVelocityY(150)
    }

    if (this.door) {
      const dist = Phaser.Math.Distance.Between(this.player.x, this.player.y, this.door.x, this.door.y)
      if (dist < 40 && Phaser.Input.Keyboard.JustDown(this.interactKey)) {
        this.scene.start('world')
      }
    }
  }
}
