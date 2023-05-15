class Rules extends Phaser.Scene {
    constructor() {
        super("rulesScene");
    }

    preload() {
        this.load.path = 'assets/';
        this.load.image('rules','rulesBackground.png');
        this.load.audio('chimes', './sounds/chime.mp3');
    }

    create() {
        this.ruleScreen = this.add.tileSprite(0, 0, game.config.width, game.config.height,'rules').setOrigin(0, 0);

        let titleConfig = {
            // fontFamily: 'bubbleBobble',
            fontFamily: 'doubleBubble',
            fontSize: '90px',
            // fontStyle: 'bold',
            color: '#ff2b87',
            // align: 'right',
            padding: {
                top: 5,
                bottom: 5,
            },
            // fixedWidth: 0
        }

        var text = this.add.text(game.config.width/2, 65, 'RULES', titleConfig).setOrigin(0.5);
        // text.setShadow(4, 4, '#0473d4', 5);

        let textConfig = {
            fontFamily: 'simpleKindOfGirl',
            fontSize: '26px',
            // fontStyle: 'bold',
            color: '#0a418a',
            align: 'left',
            wordWrap: {
                width: 560// maximum width of the text
            },
            padding: {
                top: 5,
                bottom: 5,
            },
            // fixedWidth: 0
        }

        let subTitleConfig = {
            fontFamily: 'bubbleBobble',
            fontSize: '35px',
            // fontStyle: 'bold',
            color: '#00b3ff',
            align: 'right',
            padding: {
                top: 5,
                bottom: 5,
            },
            fixedWidth: 200
        }

        this.add.text(10, game.config.height/5 + 10, "CONTROLS:", subTitleConfig).setOrigin(0);
        this.add.text(game.config.width/2 + 90, game.config.height/2 - 140, "Use LEFT and RIGHT arrow keys to move. Use UP arrow to jump (you can jump up to 3 times in a row).", textConfig).setOrigin(0.5);

        this.add.text(10, game.config.height/2 - 100, "GOAL:", subTitleConfig).setOrigin(0);
        this.add.text(game.config.width/2 + 95, game.config.height/2 - 70, "Last as long as possible by hopping on each platform and collect as many points as you can.", textConfig).setOrigin(0.5);

        this.add.text(10, game.config.height/2 - 30, "INSTRUCTIONS:", subTitleConfig).setOrigin(0);
        this.add.text(game.config.width/2 + 95, game.config.height/2 + 15, "Hop on platforms that match the color of the blob (the player) to earn 3 points (i.e. if your player is blue, hop on blue platforms to gain 3 points).", textConfig).setOrigin(0.5);
        this.add.text(game.config.width/2 + 95, game.config.height/2 + 95, "If you hop on platforms that do not match the blob's color, you will be deducted 1 point.", textConfig).setOrigin(0.5);
        this.add.text(game.config.width/2 + 75, game.config.height/2 + 150, "Collect boba 🧋 power ups to get 5 extra points! ", textConfig).setOrigin(0.5);
        this.add.text(game.config.width/2 + 97, game.config.height/2 + 190, "If you fall or exit out of the game screen, you lose ☹️", textConfig).setOrigin(0.5);
        
        textConfig.wordWrap = false;
        textConfig.fontSize = '24px';
        textConfig.color = '#ff004c';
        this.add.text(20, game.config.height - 50, "* Speed of platforms will slowly increase, so WATCH OUT!", textConfig).setOrigin(0);


        let beginConfig = {
            // fontFamily: 'bubbleBobble',
            fontFamily: 'doubleBubble',
            fontSize: '60px',
            // fontStyle: 'bold',
            color: '#6738ff',
            // align: 'right',
            padding: {
                top: 5,
                bottom: 5,
            },
            // fixedWidth: 0
        }
        this.begin = this.add.text(game.config.width - 100, game.config.height - 40, 'PLAY', beginConfig).setOrigin(0.5);
        this.begin.setInteractive();

        this.clicked = false;

    }

    update(){
        this.begin.on('pointerover', () => {
            this.begin.setTint(0x2c04b3); 
        });
        
        // Set the tint color back to normal when the mouse leaves the button
        this.begin.on('pointerout', () => {
            this.begin.clearTint();
        });
        
        // Add a click event listener to the button
        this.begin.on('pointerdown', () => {
            // console.log('Button clicked!');
            if(!this.clicked){
                this.sound.play('chimes');
                this.clicked = true;
            }
            // this.sound.play('chimes');
            this.scene.start('playScene');

        });
    }
}