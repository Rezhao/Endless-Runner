class Rules extends Phaser.Scene {
    constructor() {
        super("rulesScene");
    }

    preload() {
        //setting loading path
        this.load.path = 'assets/';

        //load rules background image
        this.load.image('rules','rulesBackground.png');

        //loading audio for click
        this.load.audio('chimes', './sounds/chime.mp3');
    }

    create() {
        //adding rules background
        this.ruleScreen = this.add.tileSprite(0, 0, game.config.width, game.config.height,'rules').setOrigin(0, 0);

        //setting title text configurations
        let titleConfig = {
            fontFamily: 'doubleBubble',
            fontSize: '90px',
            color: '#ff2b87',
            padding: {
                top: 5,
                bottom: 5,
            }
        }

        //adding rules title to screen
        var text = this.add.text(game.config.width/2, 65, 'RULES', titleConfig).setOrigin(0.5);

        //setting rules text configurations
        let textConfig = {
            fontFamily: 'simpleKindOfGirl',
            fontSize: '26px',
            color: '#0a418a',
            align: 'left',
            wordWrap: {
                width: 560
            },
            padding: {
                top: 5,
                bottom: 5,
            }
        }

        //setting text configurations for subtitles in rules
        let subTitleConfig = {
            fontFamily: 'bubbleBobble',
            fontSize: '35px',
            color: '#00b3ff',
            align: 'right',
            padding: {
                top: 5,
                bottom: 5,
            },
            fixedWidth: 200
        }

        //adding controles subtitle
        this.add.text(10, game.config.height/5 + 10, "CONTROLS:", subTitleConfig).setOrigin(0);
        //adding controls description
        this.add.text(game.config.width/2 + 90, game.config.height/2 - 140, "Use LEFT and RIGHT arrow keys to move. Use UP arrow to jump (you can jump up to 3 times in a row).", textConfig).setOrigin(0.5);

        //adding goals subtitle
        this.add.text(10, game.config.height/2 - 100, "GOAL:", subTitleConfig).setOrigin(0);
        //adding goals description
        this.add.text(game.config.width/2 + 95, game.config.height/2 - 70, "Last as long as possible by hopping on each platform and collect as many points as you can.", textConfig).setOrigin(0.5);

        //adding instructions subtitle
        this.add.text(10, game.config.height/2 - 30, "INSTRUCTIONS:", subTitleConfig).setOrigin(0);
        //adding instructions description
        this.add.text(game.config.width/2 + 95, game.config.height/2 + 15, "Hop on platforms that match the color of the blob (the player) to earn 3 points (i.e. if your player is blue, hop on blue platforms to gain 3 points).", textConfig).setOrigin(0.5);
        this.add.text(game.config.width/2 + 95, game.config.height/2 + 95, "If you hop on platforms that do not match the blob's color, you will be deducted 1 point.", textConfig).setOrigin(0.5);
        this.add.text(game.config.width/2 + 75, game.config.height/2 + 150, "Collect boba 🧋 power ups to get 5 extra points! ", textConfig).setOrigin(0.5);
        this.add.text(game.config.width/2 + 97, game.config.height/2 + 190, "If you fall or exit out of the game screen, you lose ☹️", textConfig).setOrigin(0.5);
        
        //setting new configurations for side note
        textConfig.wordWrap = false;
        textConfig.fontSize = '24px';
        textConfig.color = '#ff004c';
        this.add.text(20, game.config.height - 50, "* Speed of platforms will slowly increase, so WATCH OUT!", textConfig).setOrigin(0);

        //setting play text configuration
        let beginConfig = {
            fontFamily: 'doubleBubble',
            fontSize: '60px',
            color: '#6738ff',
            padding: {
                top: 5,
                bottom: 5,
            },
        }

        //adding play text
        this.begin = this.add.text(game.config.width - 100, game.config.height - 40, 'PLAY', beginConfig).setOrigin(0.5);
        this.begin.setInteractive(); //set interactive so mouse click works

        //boolean to keep track that sound effect plays once
        this.clicked = false;

    }

    update(){
        //if mouse is hovering text
        this.begin.on('pointerover', () => {
            this.begin.setTint(0x2c04b3); //set tint to text
        });
        
        //if mouse is not hovering text
        this.begin.on('pointerout', () => {
            this.begin.clearTint(); //clear tint and revert to original
        });
        
        //if mouse clicks on text
        this.begin.on('pointerdown', () => {
            //if sound effect hasn't played yet
            if(!this.clicked){
                this.sound.play('chimes'); //play sound
                this.clicked = true; //set clicked to true
            }

            //move to next scene
            this.scene.start('playScene');

        });
    }
}