import Phaser from 'phaser'
import gameData from '../GameDataManager'

export default class CasaDoAnciaoScene extends Phaser.Scene {
  private player!: Phaser.Physics.Arcade.Sprite
  private npc!: Phaser.Physics.Arcade.Sprite
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys
  private interactKey!: Phaser.Input.Keyboard.Key
  private newDoor?: Phaser.GameObjects.Rectangle
  private uiScene!: Phaser.Scene

  private npcData = {
    question: 'Qual \u00e9 a palavra secreta?',
    answer: 'esp\u00edrito',
    successDialogue: 'Muito bem, jovem. A porta se abriu!'
  }

  constructor() {
    super('casa-do-anciao')
  }

  preload() {
    this.load.image('character', 'Character.png')
    this.load.image('elder', 'elder.png')
    this.load.image('base', 'Base.png')
    this.load.image('tree', 'Tree.png')
  }

  create() {
    const map = gameData.maps.elder_house
    const tileSize = map.tileSize
    const width = map.width * tileSize
    const height = map.height * tileSize

    this.cameras.main.setBounds(0, 0, width, height)
    this.physics.world.setBounds(0, 0, width, height)

    this.add.tileSprite(width / 2, height / 2, width, height, 'base')

    this.player = this.physics.add.sprite(tileSize * 2, tileSize * 6, 'character')
    this.player.setScale(tileSize / 128)
    this.player.setCollideWorldBounds(true)

    this.npc = this.physics.add.staticSprite(tileSize * 5, tileSize * 3, 'elder')
    this.npc.setScale(tileSize / 1024, (tileSize * 2) / 1024)
    this.npc.refreshBody()

    map.scenery.forEach(obj => {
      const x = obj.x * tileSize + tileSize / 2
      const y = obj.y * tileSize + tileSize / 2
      if (obj.type === 'table') {
        this.add.rectangle(x, y, tileSize * 2, tileSize, 0x664422)
      } else if (obj.type === 'tree') {
        this.add.image(x, y, 'tree').setScale(tileSize / 64)
      }
    })

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
    } else if (this.cursors.right?.isDown) {
      body.setVelocityX(150)
    }
    if (this.cursors.up?.isDown) {
      body.setVelocityY(-150)
    } else if (this.cursors.down?.isDown) {
      body.setVelocityY(150)
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
    const map = gameData.maps.elder_house
    const tileSize = map.tileSize
    const x = tileSize * 1.5
    const y = tileSize
    this.newDoor = this.add.rectangle(x, y, tileSize, tileSize * 2, 0xf6e05e)
    this.physics.add.existing(this.newDoor, true)
    this.physics.add.overlap(this.player, this.newDoor, () => {
      this.scene.start('vinhedo')
    })
  }
}
