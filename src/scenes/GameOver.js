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

        this.add.text(game.config.width/2, game.config.height/2, "GAME OVER", scoreConfig).setOrigin(0.5);

        let playConfig = {
            fontFamily: 'doubleBubble',
            fontSize: '60px',
            // fontStyle: 'bold',
            color: '#ffffff',
            // align: 'right',
            padding: {
                top: 5,
                bottom: 5,
            },
            // fixedWidth: 0
        }
        this.playAgain = this.add.text(game.config.width/2, game.config.height/2 + 64, 'Play Again', playConfig).setOrigin(0.5);
        this.playAgain.setInteractive();

    }

    update() {


        // this.scene.restart();
        this.playAgain.on('pointerover', () => {
            this.playAgain.setTint(0xff2b87); 
        });
        
        // Set the tint color back to normal when the mouse leaves the button
        this.playAgain.on('pointerout', () => {
            this.playAgain.clearTint();
        });
        
        // Add a click event listener to the button
        this.playAgain.on('pointerdown', () => {
            // console.log('Button clicked!');
            this.scene.start('playScene');

        });
    }
}