class GameOver extends Phaser.Scene {
    constructor() {
        super('gameOverScene');
    }

    create() {
        let scoreConfig = {
            fontFamily: 'Courier',
            fontSize: '28px',
            backgroundColor: '#edcb8f',
            color: '#866146',
            align: 'right',
            padding: {
                top: 5,
                bottom: 5,
            }
            // fixedWidth: 100
        }

        this.add.text(game.config.width/2, game.config.height/2, "GAME OVER", scoreConfig);

    }

    update() {

    }
}