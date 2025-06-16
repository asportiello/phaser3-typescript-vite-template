import Phaser from 'phaser'

export default class GameScene extends Phaser.Scene {
    private player!: Phaser.Physics.Arcade.Sprite
    private cursors!: Phaser.Types.Input.Keyboard.CursorKeys
    private speed = 150

    constructor() {
        super('game')
    }

    preload() {
        // Carrega a spritesheet com o nome e caminho corretos
        this.load.spritesheet('player_sprite', 'assets/Character.png', {
            frameWidth: 32,
            frameHeight: 32
        })
        
        // Carrega a imagem de fundo da casa
        // (Assumindo que você subiu o 'inside-house.png' para 'public/assets/')
        this.load.image('inside-house', 'assets/House.png') 
    }

    create() {
        // Adiciona a imagem de fundo
        this.add.image(0, 0, 'inside-house').setOrigin(0, 0)

        // Adiciona o jogador
        this.player = this.physics.add.sprite(128, 128, 'player_sprite')

        // Configura limites do mundo e colisão
        this.physics.world.setBounds(0, 0, 240, 160) // Exemplo de tamanho, ajuste se necessário
        this.player.setCollideWorldBounds(true)

        // Cria o controle do teclado
        this.cursors = this.input.keyboard.createCursorKeys()

        // --- DEFINIÇÕES DE ANIMAÇÃO CORRETAS ---

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

        // Câmera segue o jogador
        this.cameras.main.startFollow(this.player, true)
        this.cameras.main.setBounds(0, 0, 240, 160)
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
        if (this.player.body.velocity.y > 0) {
            this.player.anims.play('walk-down', true)
        } else if (this.player.body.velocity.y < 0) {
            this.player.anims.play('walk-up', true)
        } else if (this.player.body.velocity.x > 0) {
            this.player.anims.play('walk-right', true)
        } else if (this.player.body.velocity.x < 0) {
            this.player.anims.play('walk-left', true)
        } else {
            // Se parado, para a animação no frame correto da última direção
            const currentAnim = this.player.anims.currentAnim
            if (currentAnim) {
                const key = currentAnim.key
                switch (key) {
                    case 'walk-down': this.player.setFrame(0); break;
                    case 'walk-left': this.player.setFrame(4); break;
                    case 'walk-right': this.player.setFrame(8); break;
                    case 'walk-up': this.player.setFrame(12); break;
                }
            }
        }
    }
}
