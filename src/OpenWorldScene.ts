import Phaser from 'phaser'

export default class OpenWorldScene extends Phaser.Scene {
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys
  private player!: Phaser.GameObjects.Rectangle
  private questionActive = false
  private questionText?: Phaser.GameObjects.Text
  private optionTexts: Phaser.GameObjects.Text[] = []

  preload() {}

  create() {
    const worldWidth = 2000
    const worldHeight = 2000
    // simple background
    this.cameras.main.setBounds(0, 0, worldWidth, worldHeight)
    this.physics.world.setBounds(0, 0, worldWidth, worldHeight)
    this.add.rectangle(worldWidth / 2, worldHeight / 2, worldWidth, worldHeight, 0x4488aa)

    this.player = this.add.rectangle(400, 300, 40, 40, 0x00ff00)
    this.physics.add.existing(this.player)
    const body = this.player.body as Phaser.Physics.Arcade.Body
    body.setCollideWorldBounds(true)

    // create few question spots
    const createSpot = (x: number, y: number) => {
      const rect = this.add.rectangle(x, y, 30, 30, 0xff0000)
      this.physics.add.existing(rect, true)
      return rect
    }

    const spots = [
      createSpot(600, 600),
      createSpot(1200, 800),
      createSpot(1600, 1400)
    ]

    spots.forEach(spot => {
      this.physics.add.overlap(this.player, spot, () => this.askQuestion(spot))
    })

    this.cursors = this.input.keyboard.createCursorKeys()
    this.cameras.main.startFollow(this.player, true, 0.08, 0.08)
  }

  update() {
    const body = this.player.body as Phaser.Physics.Arcade.Body
    body.setVelocity(0)

    if (this.questionActive) {
      return
    }

    if (this.cursors.left?.isDown) {
      body.setVelocityX(-200)
    } else if (this.cursors.right?.isDown) {
      body.setVelocityX(200)
    }

    if (this.cursors.up?.isDown) {
      body.setVelocityY(-200)
    } else if (this.cursors.down?.isDown) {
      body.setVelocityY(200)
    }
  }

  private askQuestion(spot: Phaser.GameObjects.GameObject) {
    if (this.questionActive) return
    this.questionActive = true

    const a = Phaser.Math.Between(1, 10)
    const b = Phaser.Math.Between(1, 10)
    const correct = a + b
    const options = [correct, correct + Phaser.Math.Between(1, 3), correct - Phaser.Math.Between(1, 3)]
    Phaser.Utils.Array.Shuffle(options)

    this.questionText = this.add.text(10, 10, `${a} + ${b} = ?`, {
      font: '20px Arial',
      color: '#ffffff',
      backgroundColor: '#000000'
    }).setScrollFactor(0)

    this.optionTexts = options.map((opt, idx) => {
      const t = this.add.text(10, 40 + idx * 30, `${opt}`, {
        font: '18px Arial',
        color: '#ffffff',
        backgroundColor: '#000000'
      }).setInteractive().setScrollFactor(0)
      t.on('pointerdown', () => this.handleAnswer(opt === correct, spot))
      return t
    })
  }

  private handleAnswer(correct: boolean, spot: Phaser.GameObjects.GameObject) {
    if (!this.questionText) return
    this.questionText.setText(correct ? 'Correct!' : 'Wrong!')

    this.time.delayedCall(1000, () => {
      this.questionText?.destroy()
      this.optionTexts.forEach(t => t.destroy())
      this.optionTexts = []
      this.questionActive = false
      if (correct) spot.destroy()
    })
  }
}
