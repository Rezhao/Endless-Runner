class Play extends Phaser.Scene {
    constructor() {
        super('playScene');
    }

    preload() {
        this.load.path = 'assets/';
        // load in game background music
        this.load.audio('blob-music', './sounds/chiptune-grooving.mp3'); 

        this.load.image("pinkBrick", "./bricks/pinkBrick.png");
        this.load.image("yellowBrick", "./bricks/yellowBrick.png");
        this.load.image("purpleBrick", "./bricks/purpleBrick.png");
        this.load.image("greenBrick", "./bricks/greenBrick.png");
        this.load.image("blueBrick", "./bricks/blueBrick.png");
        this.load.image("orangeBrick", "./bricks/orangeBrick.png");
        this.load.image("redBrick", "./bricks/redBrick.png");

        this.load.atlas("yellow", "./yellow/yellow.png", "./yellow/yellow.json");
        this.load.atlas("purple", "./purple/purple.png", "./purple/purple.json");
        this.load.atlas("pink", "./pink/pink.png", "./pink/pink.json");
        this.load.atlas("green", "./green/green.png", "./green/green.json");
        this.load.atlas("orange", "./orange/orange.png", "./orange/orange.json");
        this.load.atlas("red", "./red/red.png", "./red/red.json");
        this.load.atlas("blue", "./blue/blue.png", "./blue/blue.json");

        this.load.atlas("jump", "./jump/jump.png", "./jump/jump.json");

        this.load.image('background','background.png');
        this.load.image('boba','boba.png');
        // this.load.image('title','titleBackground.png');
        // this.load.image('rules','rulesBackground.png');
        
        this.load.audio('boing', './sounds/cartoon-jump.mp3');
        this.load.audio('sparkle', './sounds/twinklesparkle.mp3');
        this.load.audio('powerup', './sounds/powerup.mp3');
    }

    create() {
        this.ACCELERATION = 600;
        // this.MAX_X_VEL = 500;   // pixels/second
        // this.MAX_Y_VEL = 5000;
        this.DRAG = 700; 
        this.JUMP_VELOCITY = -700;
        this.MAX_JUMPS = 3;
        this.SCROLL_SPEED = 4;
        this.physics.world.gravity.y = 3000;
        this.platformSpeed = -200;
        this.platformSpeedMax = -700;

        // set music configurations
        let blobBackgroundMusicConfig = {
            mute: false, // make sure music plays
            volume: 1, // at least 0.5 to hear sound
            loop: true, // play music forever
            rate: 1, // play music at a rate of 1
            delay: 0 // don't delay, play music immediately
        };

        // set background game music
        this.blobBackgroundMusic = this.sound.add('blob-music', blobBackgroundMusicConfig);
        this.blobBackgroundMusic.play(blobBackgroundMusicConfig); // play background music based on configurations

        this.background = this.add.tileSprite(0, 0, game.config.width, game.config.height, 'background').setOrigin(0);

        this.otherColors = [...colors]
        Phaser.Utils.Array.Remove(this.otherColors, randomColor);

        this.isColor = true;
        this.platformGroup = this.add.group({
            runChildUpdate: true    // make sure update runs on group children
        });

        this.sameColorGroup = this.add.group({
            runChildUpdate: true    // make sure update runs on group children
        });

        this.platformLanded = this.add.group({
            runChildUpdate: true    // make sure update runs on group children
        });

        this.time.delayedCall(1000, () => { 
            this.addPlatform(); 
        });


        this.startGround = this.physics.add.sprite(-10, game.config.height - 75, randomColor + 'Brick').setOrigin(0);
        this.startGround.body.immovable = true;
        this.startGround.body.allowGravity = false;

        this.time.delayedCall(5000, () => { 
            this.startGround.destroy();
        });


        this.player = this.physics.add.sprite(75, game.config.height/2 - 30, randomColor, randomColor + '1').setScale(0.5);
        this.player.body.checkCollision.up = false;
        this.player.body.checkCollision.left = false;
        this.player.body.checkCollision.right = false;

        this.score = 0;

        this.walk = this.anims.create({
            key: 'walk',
            frameRate: 15,
            // repeat: -1,
            frames: this.anims.generateFrameNames(randomColor, { 
                prefix: randomColor,
                // suffix: ".png",
                start: 1, 
                end: 6 }),
            repeat: -1
        });

        this.idle = this.anims.create({
            key: 'idle',
            defaultTextureKey: randomColor,
            frames: [
                { frame: randomColor + '1' }
            ],
            repeat: -1
        });

        this.jump = this.anims.create({
            key: 'jump',
            defaultTextureKey: 'jump',
            frames: [
                { frame: randomColor + 'Jump' }
            ],
            repeat: -1
        });


        this.difficultyTimer = this.time.addEvent({
            delay: 5000,
            callback: this.increaseSpeed,
            callbackScope: this,
            loop: true
        });


        this.boba_v;
        this.bobaCounter = 0;
        this.gotBoba = false;

        cursors = this.input.keyboard.createCursorKeys();
        this.physics.add.collider(this.player, this.startGround);

        let scoreConfig = {
            fontFamily: 'simpleKindOfGirl',
            fontSize: '28px',
            backgroundColor: '#edcb8f',
            color: '#866146',
            align: 'right',
            padding: {
                top: 5,
                bottom: 5,
                right: 5,
            },
            fixedWidth: 100
        }
        this.scoreLeft = this.add.text(10, 10, this.score, scoreConfig);
        this.add.rectangle(game.config.width - 260, 10, 250, 40, 0xedcb8f).setOrigin(0, 0);
        scoreConfig.fixedWidth = 0;
        this.highScore = this.add.text(game.config.width - 70, 10, localStorage.getItem("score"), scoreConfig);
        this.add.text(game.config.width - 250, 10, "High Score: ", scoreConfig);


        this.textPainted = false;

    }

    update(){
        if(this.outsideBounds()){
            this.blobBackgroundMusic.stop();
            // this.gameOver();
            // this.sound.play('ending');
            this.time.delayedCall(1000, () => { this.scene.start('gameOverScene'); });
        }

        if(this.physics.overlap(this.player, this.boba)){
            this.sound.play('sparkle');
            this.switchColor();
            // this.sound.play('sparkle');
            // this.gotBoba = true;
        }
        // console.log(localStorage.setItem("score", 0));
        if(localStorage.getItem("score") < this.score){
            localStorage.setItem("score", this.score);
            console.log(localStorage.getItem("score"));
            this.highScore.text = localStorage.getItem("score");
        }

        // if(!this.samePlatform){
        //     this.updateScore();
        // }

        this.updateScore();
    
        // this.physics.add.collider(this.player, this.sameColorGroup);
        // this.physics.add.collider(this.player, this.platformGroup);

        this.background.tilePositionX += 2;
        // this.ground.tilePositionX += 2;

        if(cursors.left.isDown) {
            this.player.body.setAccelerationX(-this.ACCELERATION);
            this.player.setFlip(true, false);
            this.player.anims.play('walk', true);
        } else if(cursors.right.isDown) {
            this.player.body.setAccelerationX(this.ACCELERATION);
            this.player.resetFlip();
            this.player.anims.play('walk', true);
        } else {
            // set acceleration to 0 so DRAG will take over
            this.player.body.setAccelerationX(0);
            this.player.body.setDragX(this.DRAG);
            this.player.anims.play('idle');
        }



        this.player.onGround = this.player.body.touching.down;
	    // if so, we have jumps to spare
	    if(this.player.onGround) {
	    	this.jumps = this.MAX_JUMPS;
	    	this.jumping = false;
	    } else {
            // this.sound.play('boing');
            this.player.anims.play('jump');
	    }

        //Phaser.Input.Keyboard.JustDown(keyLEFT)
        if(this.jumps > 0 && Phaser.Input.Keyboard.DownDuration(cursors.up, 150)) {
	        this.player.body.velocity.y = this.JUMP_VELOCITY;
            // this.sound.play('boing');
	        this.jumping = true;
	    } 

        if(this.jumping && Phaser.Input.Keyboard.UpDuration(cursors.up)) {
	    	this.jumps--;
	    	this.jumping = false;
            this.sound.play('boing');
	    }
    }

    addPlatform() {
        let speedVariance =  Phaser.Math.Between(0, 50);

        if(this.isColor) {
            this.platform = new Platform(this, this.platformSpeed - speedVariance, randomColor);
            // this.platformGroup.add(this.platform);
            this.sameColorGroup.add(this.platform);
            this.isColor = false;
            this.boba_v = this.platformSpeed - speedVariance;


            if(this.bobaCounter >= 5){
                this.addBoba();
                this.bobaCounter = 0;
                this.bobaPlatform = this.platform;
            }
            this.bobaCounter++;

        } else{
            let platform = new Platform(this, this.platformSpeed - speedVariance, Phaser.Utils.Array.GetRandom(this.otherColors));
            this.platformGroup.add(platform);
            this.isColor = true;
        }

    }

    increaseSpeed() {
        if(this.platformSpeed >= this.platformSpeedMax){
            this.platformSpeed -= 20;
        }
    }

    addBoba() {
        this.boba = this.physics.add.sprite(this.platform.x, this.platform.y - 45, 'boba').setScale(0.8);
        this.boba.setVelocityX(this.boba_v); 
        this.boba.setImmovable(); 
        this.boba.body.allowGravity = false;
        this.physics.add.collider(this.boba, this.sameColorGroup);
    }

    switchColor() {
        this.boba.destroy();
        this.score += 5;
        this.scoreLeft.text = this.score;
        // this.sound.play('sparkle');

        randomColor = Phaser.Utils.Array.GetRandom(this.otherColors);
        this.updateAnimations();

        this.bobaPlatform.setTexture(randomColor + 'Brick');
        this.player.setTexture(randomColor, randomColor + '1');

        this.sameColorGroup.children.each(function(brick) {
            brick.setTexture(randomColor + 'Brick');
        });


        this.otherColors = [...colors];
        Phaser.Utils.Array.Remove(this.otherColors, randomColor);
    }

    updateAnimations() {
        this.anims.remove('walk');
        this.anims.remove('jump');
        this.anims.remove('idle');

        this.walk = this.anims.create({
            key: 'walk',
            frameRate: 15,
            // repeat: -1,
            frames: this.anims.generateFrameNames(randomColor, { 
                prefix: randomColor,
                // suffix: ".png",
                start: 1, 
                end: 6 }),
            repeat: -1
        });

        this.idle = this.anims.create({
            key: 'idle',
            defaultTextureKey: randomColor,
            frames: [
                { frame: randomColor + '1' }
            ],
            repeat: -1
        });

        this.jump = this.anims.create({
            key: 'jump',
            defaultTextureKey: 'jump',
            frames: [
                { frame: randomColor + 'Jump' }
            ],
            repeat: -1
        });
    }


    updateScore() {
        this.physics.add.collider(this.player, this.sameColorGroup, (player, platform) =>{
            // console.log(this.score);
            //myGroup.contains(myObject)
            if(!this.platformLanded.contains(platform)) {
                this.platformLanded.add(platform);
                this.score += 3;
                this.scoreLeft.text = this.score;
            }
            // this.score += 5;
        });

        this.physics.add.collider(this.player, this.platformGroup, (player, platform) =>{
            // console.log(this.score);
            //myGroup.contains(myObject)
            if(!this.platformLanded.contains(platform)) {
                this.platformLanded.add(platform);
                if(this.score > 0){
                    this.score -= 1;
                }
                // this.score -= 1;
                this.scoreLeft.text = this.score;
            }
            // this.score += 5;
        });
    }

    outsideBounds() {
        //this.player.x < 0 || 
        //this.player.x > game.config.width || 
        if(this.player.y > game.config.height){
                // console.log('x is ' + this.player.x);
                // console.log('y is ' + this.player.y);
                this.jumps = -1;
	    	    this.jumping = false;
                return true;
                // return true;
        } else{
            return false;
        }
    }

}