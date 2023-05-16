class Title extends Phaser.Scene {
    constructor() {
        super('titleScene');
    }

    preload(){
        //set load path
        this.load.path = 'assets/';

        //loading happy atlas
        this.load.atlas("happy", "happy.png", "happy.json");

        //loading title background
        this.load.image('title','titleBackground.png');

        //loading audio sound effect for click
        this.load.audio('select', './sounds/select.mp3');
    }

    create(){
        //adding title background
        this.home = this.add.tileSprite(0, 0, game.config.width, game.config.height,'title').setOrigin(0, 0);

        //setting title configurations
        let titleConfig = {
            fontFamily: 'bubbleBobble',
            fontSize: '120px',
            color: '#00ffe1',
            padding: {
                top: 5,
                bottom: 5,
            },
        }

        //adding text for title
        var text = this.add.text(game.config.width/2, 150, 'COLOR BLOB', titleConfig).setOrigin(0.5);
        text.setShadow(4, 4, '#0473d4', 5); //adding drop shadow for title

        //creating happy yellow blob animations
        this.anims.create({
            key: 'happy',
            frameRate: 8,
            frames: this.anims.generateFrameNames("happy", { 
                prefix: "happy",
                start: 1, 
                end: 10 }),
            repeat: -1
        });

        //adding happy sprite to screen
        this.happy = this.add.sprite(game.config.width/2, game.config.height - 250, "happy").setScale(1.5);
        this.happy.play("happy"); //play the animation

        //setting start text configurations
        let menuConfig = {
            fontFamily: 'doubleBubble',
            fontSize: '60px',
            color: '#ffffff',
            padding: {
                top: 5,
                bottom: 5,
            },
        }

        //adding start text
        this.start = this.add.text(game.config.width/2, game.config.height - 90, 'START', menuConfig).setOrigin(0.5);
        this.start.setInteractive(); //set interactive to detect mouse click

        //side note text configurations
        let textConfig = {
            fontFamily: 'simpleKindOfGirl',
            fontSize: '28px',
            color: '#bababa',
            padding: {
                top: 5,
                bottom: 5,
            },
        }

        //adding side note text
        this.add.text(game.config.width/2 + 120, game.config.height - 50, "* Click on start to begin!", textConfig);

        //boolean to keep track that sound effect plays once
        this.clicked = false;
    }

    update(){
        //if mouse is hovering text
        this.start.on('pointerover', () => {
            this.start.setTint(0xff2b87); //set tint
        });
        
        //if mouse is not hovering text
        this.start.on('pointerout', () => {
            this.start.clearTint(); //clear tint and revert to original color
        });
        
        //if mouse clicks text
        this.start.on('pointerdown', () => {
            //if sound hasn't played yet
            if(!this.clicked){
                this.sound.play('select'); //play sound effect
                this.clicked = true; //set boolean to true
            }

            //start next scene
            this.scene.start('rulesScene');

        });
    }
}