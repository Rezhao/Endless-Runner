class GameOver extends Phaser.Scene {
    constructor() {
        super('gameOverScene');
    }

    preload() {
        this.load.path = 'assets/';
        this.load.audio('ending', './sounds/wah-wah.mp3');
    }

    create() {
        let overConfig = {
            fontFamily: 'bubbleBobble',
            fontSize: '100px',
            // backgroundColor: '#edcb8f',
            color: '#00ffe1',
            align: 'center',
            padding: {
                top: 5,
                bottom: 5,
            }
            // fixedWidth: 100
        }

        var gameOverText = this.add.text(game.config.width/2, game.config.height/2 - 120, "GAME OVER", overConfig).setOrigin(0.5);
        gameOverText.setShadow(4, 4, '#0473d4', 5);

        let shakeTween = this.tweens.add({
            targets: gameOverText,
            x: '+=7',  // Adjust the values to control the shake intensity
            y: '+=7',
            duration: 100,  // Adjust the duration to control the shake speed
            // ease: 'Power0',
            yoyo: true,
            repeat: -1,
        });

        let scaleTween = this.tweens.add({
            targets: gameOverText,
            scaleX: 1.5,  // Adjust the scale values to control the enlargement
            scaleY: 1.5,
            duration: 410,  // Adjust the duration to control the scale speed
            ease: 'Linear',
            yoyo: true,
            repeat: -1
        });

        this.time.delayedCall(3000, () => {
            // shakeTween.stop();
            scaleTween.stop();
        }, [], this);
        this.time.delayedCall(5000, () => {
            shakeTween.stop();
            // gameOverText.setScale(1);
            // scaleTween.stop();
        }, [], this);

        let playConfig = {
            fontFamily: 'doubleBubble',
            fontSize: '70px',
            // fontStyle: 'bold',
            color: '#ffffff',
            // align: 'right',
            padding: {
                top: 5,
                bottom: 5,
            },
            // fixedWidth: 0
        }
        this.playAgain = this.add.text(game.config.width/2, game.config.height/2 + 20, 'Play Again', playConfig).setOrigin(0.5);
        this.playAgain.setInteractive();


        let textConfig = {
            fontFamily: 'simpleKindOfGirl',
            fontSize: '21px',
            // fontStyle: 'bold',
            color: '#ffffff',
            align: 'left',
            wordWrap: {
                width: game.config.width - 40// maximum width of the text
            },
            padding: {
                top: 5,
                bottom: 5,
            },
            // fixedWidth: 0
        }

        let subTitleConfig = {
            fontFamily: 'bubbleBobble',
            fontSize: '28px',
            // fontStyle: 'bold',
            color: '#999999',
            align: 'left',
            padding: {
                top: 5,
                bottom: 5,
            },
            fixedWidth: 200
        }

        this.add.text(20, game.config.height - 200, 'CREDITS:', subTitleConfig);
        this.add.text(20, game.config.height - 160, '• All artwork and code is created be me, Rebecca Zhao (i.e. the backgrounds, characters, items, bricks)', textConfig);
        this.add.text(20, game.config.height - 110, '• All music/sound effects downloaded from https://pixabay.com/sound-effects/search/sparkle/', textConfig);
        this.add.text(20, game.config.height - 85, '• All fonts downloaded from https://www.fontspace.com/search?q=bubble', textConfig);
        this.add.text(20, game.config.height - 60, '• Referenced code from professor', textConfig);


        this.end = this.sound.add('ending');
        this.end.play();
        this.clicked = false;

    }

    update() {


        // this.scene.restart();
        this.playAgain.on('pointerover', () => {
            this.playAgain.setTint(0xbb95fc); 
        });
        
        // Set the tint color back to normal when the mouse leaves the button
        this.playAgain.on('pointerout', () => {
            this.playAgain.clearTint();
        });
        
        // Add a click event listener to the button
        this.playAgain.on('pointerdown', () => {
            // console.log('Button clicked!');
            if(!this.clicked){
                this.sound.play('chimes');
                this.clicked = true;
            }
            this.end.stop();
            this.scene.start('playScene');

        });
    }
}