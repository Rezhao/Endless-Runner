class Rules extends Phaser.Scene {
    constructor() {
        super("rulesScene");
    }

    preload() {
        this.load.path = 'assets/';
        this.load.image('rules','rulesBackground.png');
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

        var text = this.add.text(game.config.width/2, 90, 'RULES', titleConfig).setOrigin(0.5);
        // text.setShadow(4, 4, '#0473d4', 5);

        let textConfig = {
            fontFamily: 'simpleKindOfGirl',
            fontSize: '28px',
            // fontStyle: 'bold',
            color: '#000000',
            align: 'left',
            wordWrap: {
                width: game.config.width - 100// maximum width of the text
            },
            padding: {
                top: 5,
                bottom: 5,
            },
            // fixedWidth: 0
        }

        this.add.text(game.config.width/2, game.config.height/2 - 100, "CONTROLS: Use LEFT and RIGHT arrow keys to move. UP to jump (you can jump up to 3 times in a row).", textConfig).setOrigin(0.5);
        this.add.text(game.config.width/2, game.config.height/2, "GOAL: Last as long as possible by hopping on each platform and collect as many points as you can.", textConfig).setOrigin(0.5);
        this.add.text(game.config.width/2, game.config.height/2 + 150, "INSTRUCTIONS: Hop on same colored platforms as the blob (the player) to earn 3 points. " 
        + "If you hop on other colored platforms, you will be deducted 1 point but will not die. Collecting boba power ups give you 5 extra points! " 
        + "Once you fall or exit out of the game screen, you lose :(", textConfig).setOrigin(0.5);


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
        this.begin = this.add.text(game.config.width - 100, game.config.height - 50, 'PLAY', beginConfig).setOrigin(0.5);
        this.begin.setInteractive();

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
            this.scene.start('playScene');

        });
    }
}