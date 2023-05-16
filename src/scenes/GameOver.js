class GameOver extends Phaser.Scene {
    constructor() {
        super('gameOverScene');
    }

    preload() {
        //loading in path
        this.load.path = 'assets/';

        //loading game over sound effect
        this.load.audio('ending', './sounds/wah-wah.mp3');
    }

    create() {
        //game over configuration for text
        let overConfig = {
            fontFamily: 'bubbleBobble',
            fontSize: '100px',
            color: '#00ffe1',
            align: 'center',
            padding: {
                top: 5,
                bottom: 5,
            }
        }

        //creating game over text
        var gameOverText = this.add.text(game.config.width/2, game.config.height/2 - 120, "GAME OVER", overConfig).setOrigin(0.5);
        gameOverText.setShadow(4, 4, '#0473d4', 5); //adds drop shadow to text

        //using tween to create shaking text animation
        let shakeTween = this.tweens.add({
            targets: gameOverText, //tween will apply to game over text
            x: '+=7', // Adjusting x value to control shake intensity
            y: '+=7', // Adjusting y value to control shake intensity
            duration: 100, // duration of shake animation/speed
            yoyo: true,
            repeat: -1,
        });

        //using tween to create scale text animation (making text enlarged)
        let scaleTween = this.tweens.add({
            targets: gameOverText, //tween will apply to game over text
            scaleX: 1.5, //Adjust x scale value to control enlargement
            scaleY: 1.5, //Adjust y scale value to control enlargement
            duration: 410, //duration to control the scale speed
            ease: 'Linear', //move linearly
            yoyo: true,
            repeat: -1
        });

        //set scale tween to last for 3 seconds
        this.time.delayedCall(3000, () => {
            scaleTween.stop();
        }, [], this);

        //set shake tween to last for 5 seconds
        this.time.delayedCall(5000, () => {
            shakeTween.stop();
        }, [], this);

        //text configuration for play again
        let playConfig = {
            fontFamily: 'doubleBubble',
            fontSize: '70px',
            color: '#ffffff',
            padding: {
                top: 5,
                bottom: 5,
            },
        }

        //adding play again text
        this.playAgain = this.add.text(game.config.width/2, game.config.height/2 + 20, 'Play Again', playConfig).setOrigin(0.5);
        this.playAgain.setInteractive(); //set interactive to use mouse to click

        //text configuration for citations
        let textConfig = {
            fontFamily: 'simpleKindOfGirl',
            fontSize: '21px',
            color: '#ffffff',
            align: 'left',
            wordWrap: {
                width: game.config.width - 40
            },
            padding: {
                top: 5,
                bottom: 5,
            },
        }

        //text configuration for citations subtitle
        let subTitleConfig = {
            fontFamily: 'bubbleBobble',
            fontSize: '28px',
            color: '#999999',
            align: 'left',
            padding: {
                top: 5,
                bottom: 5,
            },
            fixedWidth: 200
        }

        //adding text for credits subtitle
        this.add.text(20, game.config.height - 200, 'CREDITS:', subTitleConfig);

        //adding text for list of credits
        this.add.text(20, game.config.height - 160, '• All artwork and code is created be me, Rebecca Zhao (i.e. the backgrounds, characters, items, bricks)', textConfig);
        this.add.text(20, game.config.height - 110, '• All music/sound effects downloaded from https://pixabay.com/sound-effects/search/sparkle/', textConfig);
        this.add.text(20, game.config.height - 85, '• All fonts downloaded from https://www.fontspace.com/search?q=bubble', textConfig);
        this.add.text(20, game.config.height - 60, '• Referenced code from professor', textConfig);

        //play game over sound effect
        this.end = this.sound.add('ending');
        this.end.play();

        //boolean to make sure click sound effect is played once
        this.clicked = false;
    }

    update() {
        //if mouse is hovering play again text
        this.playAgain.on('pointerover', () => {
            this.playAgain.setTint(0xbb95fc); //set tint to pink
        });
        
        //if mouse is not hovering play again
        this.playAgain.on('pointerout', () => {
            this.playAgain.clearTint(); //clear tint and sets back to white
        });
        
        //if mouse clicked play again
        this.playAgain.on('pointerdown', () => {
            //check if sound effect hasn't been played yet
            if(!this.clicked){
                this.sound.play('chimes'); //play sound effect
                this.clicked = true; //set clicked to true
            }

            this.end.stop(); //stop game over sound effect if player leaves scene before sound ended
            this.scene.start('playScene'); //start play scene again
        });
    }
}