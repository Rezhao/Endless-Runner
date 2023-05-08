class Title extends Phaser.Scene {
    constructor() {
        super('titleScene');
    }

    preload(){
        // this.load.spritesheet("happyFront", "./assets/spritesheet.png", {frameWidth: 64, frameHeight: 64});

        this.load.atlas("mysprite", "assets/spritesheet.png", "assets/sprites.json");
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

        this.anims.create({
            key: 'happy',
            frameRate: 8,
            // repeat: -1,
            frames: this.anims.generateFrameNames("mysprite", { 
                prefix: "happy",
                // suffix: ".png",
                start: 1, 
                end: 10 }),
            repeat: -1
        });

        this.happy = this.add.sprite(300, 360, "mysprite");
        this.happy.play("happy");
        // this.happy.anims.msPerFrame  = 40;


    }

    update(){

    }
}