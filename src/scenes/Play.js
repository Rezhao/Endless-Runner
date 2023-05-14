class Play extends Phaser.Scene {
    constructor() {
        super('playScene');
    }

    preload() {
        
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

        // this.cameras.main.setBackgroundColor('#000000');

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
        // this.player.setCollideWorldBounds(true);
        this.player.body.checkCollision.up = false;
        this.player.body.checkCollision.left = false;
        this.player.body.checkCollision.right = false;
        // this.player.body.allowGravity = false;

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
        this.isSameColor = false;
        // this.samePlatform = false;

        cursors = this.input.keyboard.createCursorKeys();
        this.physics.add.collider(this.player, this.startGround);
    }

    update(){
        if(this.outsideBounds()){
            this.scene.start('gameOverScene');
        }
        // this.outsideBounds();

        if(this.physics.overlap(this.player, this.boba)){
            this.switchColor();
        }

        if(localStorage.getItem("score") < this.score){
            localStorage.setItem("score", this.score);
            // this.highScore.text = localStorage.getItem("score");
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
            this.player.anims.play('jump');
	    }

        if(this.jumps > 0 && Phaser.Input.Keyboard.DownDuration(cursors.up, 150)) {
	        this.player.body.velocity.y = this.JUMP_VELOCITY;
	        this.jumping = true;
	    } 

        if(this.jumping && Phaser.Input.Keyboard.UpDuration(cursors.up)) {
	    	this.jumps--;
	    	this.jumping = false;
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
        this.physics.add.collider(this.boba, this.platformGroup);
    }

    switchColor() {
        this.boba.destroy();
        console.log('before ' + this.score);
        this.score += 5;
        console.log('after' + this.score);

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
            }
            // this.score += 5;
        });

        this.physics.add.collider(this.player, this.platformGroup, (player, platform) =>{
            // console.log(this.score);
            //myGroup.contains(myObject)
            if(!this.platformLanded.contains(platform)) {
                this.platformLanded.add(platform);
                this.score -= 1;
            }
            // this.score += 5;
        });
    }

    outsideBounds() {
        if(this.player.x < 0 || 
            this.player.x > game.config.width || 
            this.player.y > game.config.height){
                // console.log('x is ' + this.player.x);
                // console.log('y is ' + this.player.y);
                return true;
        } else{
            return false;
        }
    }
}



/*
TODO:

    // finish score: if can't figure out platform, count boba
    menu screen
    rules
    credits 
     music
     edge restrictions/end condition
     restart button
     use buttons as technical interesting?




*/