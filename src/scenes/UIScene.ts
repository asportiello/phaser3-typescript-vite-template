import Phaser from 'phaser'

export default class UIScene extends Phaser.Scene {
  private questionText?: Phaser.GameObjects.Text
  private inputText?: Phaser.GameObjects.Text
  private successText?: Phaser.GameObjects.Text
  private overlay?: Phaser.GameObjects.Rectangle
  private gameOverContainer?: Phaser.GameObjects.Container
  private currentAnswer = ''

  constructor() {
    super('ui')
  }

  create() {
    this.events.on('showQuestion', this.showQuestion, this)
    this.events.on('showSuccess', this.showSuccess, this)
    this.events.on('showGameOver', this.showGameOver, this)

    this.input.keyboard.on('keydown', (event: KeyboardEvent) => {
      if (!this.inputText) return

      if (event.key === 'Backspace') {
        this.currentAnswer = this.currentAnswer.slice(0, -1)
      } else if (event.key === 'Enter') {
        this.events.emit('submitAnswer', this.currentAnswer)
        this.clearQuestion()
      } else if (event.key.length === 1) {
        this.currentAnswer += event.key
      }
      this.inputText.setText(this.currentAnswer)
    })
  }

  private showQuestion(question: string) {
    this.clearAll()
    this.questionText = this.add.text(400, 200, question, {
      font: '20px Arial',
      color: '#ffffff',
      backgroundColor: '#000000'
    }).setOrigin(0.5)

    this.inputText = this.add.text(400, 260, '', {
      font: '18px Arial',
      color: '#ffff00',
      backgroundColor: '#000000'
    }).setOrigin(0.5)
    this.currentAnswer = ''
  }

  private clearQuestion() {
    this.questionText?.destroy()
    this.inputText?.destroy()
    this.questionText = undefined
    this.inputText = undefined
    this.currentAnswer = ''
  }

  private showSuccess(text: string) {
    this.clearAll()
    this.successText = this.add.text(400, 200, text, {
      font: '20px Arial',
      color: '#00ff00',
      backgroundColor: '#000000'
    }).setOrigin(0.5)
    this.time.delayedCall(3000, () => {
      this.successText?.destroy()
      this.successText = undefined
    })
  }

  private showGameOver() {
    this.clearAll()
    this.overlay = this.add.rectangle(400, 300, 800, 600, 0x000000, 0.7)
    this.gameOverContainer = this.add.container(400, 300)
    const txt = this.add.text(0, -20, 'Game Over', {
      font: '32px Arial',
      color: '#ff0000'
    }).setOrigin(0.5)
    const btn = this.add.text(0, 30, 'Reiniciar', {
      font: '20px Arial',
      color: '#ffffff',
      backgroundColor: '#000000'
    }).setPadding(10).setOrigin(0.5).setInteractive()
    btn.on('pointerdown', () => {
      const scene = this.scene.get('casa-do-anciao')
      scene.scene.restart()
      this.scene.restart()
    })
    this.gameOverContainer.add([txt, btn])
  }

  private clearAll() {
    this.clearQuestion()
    this.successText?.destroy()
    this.successText = undefined
    this.overlay?.destroy()
    if (this.gameOverContainer) {
      this.gameOverContainer.destroy(true)
      this.gameOverContainer = undefined
    }
  }
}
