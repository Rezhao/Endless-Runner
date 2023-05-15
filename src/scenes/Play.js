class Play extends Phaser.Scene {
    constructor() {
        super('playScene');
    }

    preload() {
        //setting a load path
        this.load.path = 'assets/';

        //load in bricks
        this.load.image("pinkBrick", "./bricks/pinkBrick.png");
        this.load.image("yellowBrick", "./bricks/yellowBrick.png");
        this.load.image("purpleBrick", "./bricks/purpleBrick.png");
        this.load.image("greenBrick", "./bricks/greenBrick.png");
        this.load.image("blueBrick", "./bricks/blueBrick.png");
        this.load.image("orangeBrick", "./bricks/orangeBrick.png");
        this.load.image("redBrick", "./bricks/redBrick.png");

        //load each atlas for player animations
        this.load.atlas("yellow", "./yellow/yellow.png", "./yellow/yellow.json");
        this.load.atlas("purple", "./purple/purple.png", "./purple/purple.json");
        this.load.atlas("pink", "./pink/pink.png", "./pink/pink.json");
        this.load.atlas("green", "./green/green.png", "./green/green.json");
        this.load.atlas("orange", "./orange/orange.png", "./orange/orange.json");
        this.load.atlas("red", "./red/red.png", "./red/red.json");
        this.load.atlas("blue", "./blue/blue.png", "./blue/blue.json");

        //load player jump frames
        this.load.atlas("jump", "./jump/jump.png", "./jump/jump.json");

        //loading background
        this.load.image('background','background.png');

        //loading boba powerup
        this.load.image('boba','boba.png');
        
        //loading audio sound effects
        this.load.audio('boing', './sounds/cartoon-jump.mp3');
        this.load.audio('sparkle', './sounds/twinklesparkle.mp3');
        this.load.audio('powerup', './sounds/powerup.mp3');

        // load in game background music
        this.load.audio('blob-music', './sounds/chiptune-grooving.mp3'); 
    }

    create() {
        //setting variables to track speed of platforms and jump/walk speed
        this.ACCELERATION = 600;
        this.DRAG = 700; 
        this.JUMP_VELOCITY = -700;
        this.MAX_JUMPS = 3;
        this.SCROLL_SPEED = 4;
        this.physics.world.gravity.y = 3000;
        this.platformSpeed = -200;
        this.platformSpeedMax = -700;

        // set music configurations
        let blobBackgroundMusicConfig = {
            mute: false,
            volume: 1, 
            loop: true, //looping music so it is never ending
            rate: 1,
            delay: 0 
        };

        // set background game music
        this.blobBackgroundMusic = this.sound.add('blob-music', blobBackgroundMusicConfig);
        this.blobBackgroundMusic.play(blobBackgroundMusicConfig); // play background music based on configurations

        //adding background tile
        this.background = this.add.tileSprite(0, 0, game.config.width, game.config.height, 'background').setOrigin(0);

        //creating copy of colors array and removing the current color of the player 
        //use this to create interference platforms and pick a new color when player switches color
        this.otherColors = [...colors]
        Phaser.Utils.Array.Remove(this.otherColors, randomColor);

        //boolean to set every other platform to the same color as the player
        this.isColor = true;

        //keeps track of other colored platforms (different from player color)
        this.platformGroup = this.add.group({
            runChildUpdate: true    // make sure update runs on group children
        });

        //keeps track of same colored platforms (same color as player)
        this.sameColorGroup = this.add.group({
            runChildUpdate: true    // make sure update runs on group children
        });

        //keeps track of which platforms player has already landed on so we don't add points multiple times
        this.platformLanded = this.add.group({
            runChildUpdate: true    // make sure update runs on group children
        });

        //delay 
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
            frames: this.anims.generateFrameNames(randomColor, { 
                prefix: randomColor,
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
            this.time.delayedCall(1000, () => { this.scene.start('gameOverScene'); });
        }

        if(this.physics.overlap(this.player, this.boba)){
            this.sound.play('sparkle');
            this.switchColor();
        }

        if(localStorage.getItem("score") < this.score){
            localStorage.setItem("score", this.score);
            this.highScore.text = localStorage.getItem("score");
        }

        this.updateScore();

        this.background.tilePositionX += 2;

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

	    if(this.player.onGround) {
	    	this.jumps = this.MAX_JUMPS;
	    	this.jumping = false;
	    } else {
            this.player.anims.play('jump');
	    }

        if(this.jumps > 0 && Phaser.Input.Keyboard.DownDuration(cursors.up, 150)) {
	        this.player.body.velocity.y = this.JUMP_VELOCITY;
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
            frames: this.anims.generateFrameNames(randomColor, { 
                prefix: randomColor,
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
            if(!this.platformLanded.contains(platform)) {
                this.platformLanded.add(platform);
                this.score += 3;
                this.scoreLeft.text = this.score;
            }
        });

        this.physics.add.collider(this.player, this.platformGroup, (player, platform) =>{
            if(!this.platformLanded.contains(platform)) {
                this.platformLanded.add(platform);
                if(this.score > 0){
                    this.score -= 1;
                }
                this.scoreLeft.text = this.score;
            }
        });
    }

    outsideBounds() {
        if(this.player.y > game.config.height + 130){
                this.jumps = -1;
	    	    this.jumping = false;
                return true;
        } else{
            return false;
        }
    }
}