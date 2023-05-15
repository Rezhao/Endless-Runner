class Title extends Phaser.Scene {
    constructor() {
        super('titleScene');
    }

    preload(){
        // this.load.spritesheet("happyFront", "./assets/spritesheet.png", {frameWidth: 64, frameHeight: 64});

        // this.load.atlas("mysprite", "assets/spritesheet.png", "assets/sprites.json");

        this.load.path = 'assets/';

        this.load.atlas("happy", "happy.png", "happy.json");
        this.load.image('title','titleBackground.png');

        this.load.audio('select', './sounds/select.mp3');
    }

    create(){
        // this.hero = new Hero(this, 200, 150, 'hero', 0, 'down');
        // this.sprite = this.add.sprite(game.config.width/2, 300, 'mysprite');
        // this.sprite.animations.add(
        //     'happy',
        //     this.animations.generateFrameNames('happy', 1, 4),
        //     5,
        //     true
        // );
        
        // this.sprite.animations.play('happy');
        this.home = this.add.tileSprite(0, 0, game.config.width, game.config.height,'title').setOrigin(0, 0);

        let titleConfig = {
            fontFamily: 'bubbleBobble',
            fontSize: '120px',
            // fontStyle: 'bold',
            color: '#00ffe1',
            // align: 'right',
            padding: {
                top: 5,
                bottom: 5,
            },
            // fixedWidth: 0
        }

        var text = this.add.text(game.config.width/2, 150, 'COLOR BLOB', titleConfig).setOrigin(0.5);
        text.setShadow(4, 4, '#0473d4', 5);


        this.anims.create({
            key: 'happy',
            frameRate: 8,
            // repeat: -1,
            frames: this.anims.generateFrameNames("happy", { 
                prefix: "happy",
                // suffix: ".png",
                start: 1, 
                end: 10 }),
            repeat: -1
        });

        this.happy = this.add.sprite(game.config.width/2, game.config.height - 250, "happy").setScale(1.5);
        this.happy.play("happy");

        let menuConfig = {
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

        this.start = this.add.text(game.config.width/2, game.config.height - 90, 'START', menuConfig).setOrigin(0.5);
        this.start.setInteractive();

        let textConfig = {
            fontFamily: 'simpleKindOfGirl',
            fontSize: '28px',
            // fontStyle: 'bold',
            color: '#bababa',
            // align: 'right',
            padding: {
                top: 5,
                bottom: 5,
            },
            // fixedWidth: 0
        }

        this.add.text(game.config.width/2 + 120, game.config.height - 50, "* Click on start to begin!", textConfig);

        this.clicked = false;
        // this.happy.anims.msPerFrame  = 40;


        // this.scene.start('playScene');

        // this.button = this.add.sprite(100, 100, 'button');

        // // Make the button interactive
        // this.button.setInteractive();

        // // Add a click event listener to the button
        // this.button.on('pointerdown', () => {
        //     console.log('Button clicked!');
        // });


    }

    update(){
        this.start.on('pointerover', () => {
            this.start.setTint(0xff2b87); 
        });
        
        // Set the tint color back to normal when the mouse leaves the button
        this.start.on('pointerout', () => {
            this.start.clearTint();
        });
        
        // Add a click event listener to the button
        this.start.on('pointerdown', () => {
            // console.log('Button clicked!');
            if(!this.clicked){
                this.sound.play('select');
                this.clicked = true;
            }
            // this.sound.play('select');
            this.scene.start('rulesScene');

        });
    }
}