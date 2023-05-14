class Play extends Phaser.Scene {
    constructor() {
        super('playScene');
    }

    preload() {
        
    }

    create() {
        this.ACCELERATION = 500;
        this.MAX_X_VEL = 500;   // pixels/second
        this.MAX_Y_VEL = 5000;
        this.DRAG = 600; 
        this.JUMP_VELOCITY = -700;
        this.MAX_JUMPS = 3;
        this.SCROLL_SPEED = 4;
        this.physics.world.gravity.y = 3000;
        this.platformSpeed = -200;

        // this.cameras.main.setBackgroundColor('#000000');

        this.background = this.add.tileSprite(0, 0, game.config.width, game.config.height, 'background').setOrigin(0);

        this.ground = this.add.group();
        // this.ground.body.allowGravity = false;

        // let groundTile = this.physics.add.sprite(i, game.config.height - tileSize, 'platformer_atlas', 'block').setScale(SCALE).setOrigin(0);
        
        // this.colors = ['yellow', 'purple', 'pink', 'green', 'orange', 'red', 'blue'];
        randomColor = Phaser.Utils.Array.GetRandom(colors);

        for(let i = 0; i < game.config.width; i += brickWidth) {
            this.groundScroll = this.add.tileSprite(i, game.config.height - brickHeight, brickWidth, brickHeight, 'bricks', randomColor + 'Brick').setOrigin(0);
            this.physics.add.existing(this.groundScroll);  
            // randomColor = Phaser.Utils.Array.GetRandom(this.colors);
            // let groundTile = this.physics.add.sprite(i, game.config.height - brickSize, 'ybrick').setOrigin(0);
            this.groundScroll.body.immovable = true;
            this.groundScroll.body.allowGravity = false;
            this.ground.add(this.groundScroll);
        }

        // this.path = this.add.group({
        //     runChildUpdate: true 
        // });

        this.otherColors = colors
        Phaser.Utils.Array.Remove(this.otherColors, randomColor);

        this.isColor = true;
        this.platformGroup = this.add.group({
            runChildUpdate: true    // make sure update runs on group children
        });

        this.time.delayedCall(1000, () => { 
            this.addPlatform(); 
        });


        this.testGround = this.physics.add.sprite(-10, game.config.height/2, randomColor + 'Brick').setOrigin(0);
        this.testGround.body.immovable = true;
        this.testGround.body.allowGravity = false;


        this.player = this.physics.add.sprite(75, game.config.height/2 - 30, randomColor, randomColor + '1').setScale(0.5);
        // this.player.setCollideWorldBounds(true);
        this.player .body.checkCollision.up = false;
        this.player .body.checkCollision.left = false;
        this.player .body.checkCollision.right = false;
        // this.player.body.allowGravity = false;

        this.anims.create({
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

        this.anims.create({
            key: 'idle',
            defaultTextureKey: randomColor,
            frames: [
                { frame: randomColor + '1' }
            ],
            repeat: -1
        });

        this.anims.create({
            key: 'jump',
            defaultTextureKey: 'jump',
            frames: [
                { frame: randomColor + 'Jump' }
            ],
            repeat: -1
        });



        cursors = this.input.keyboard.createCursorKeys();
        this.physics.add.collider(this.player, this.ground);
        this.physics.add.collider(this.player, this.testGround);
    }

    update(){

        //based on position of random object, randomize color at that point
        this.physics.add.collider(this.player, this.platformGroup);

        this.background.tilePositionX += 2;
        this.ground.tilePositionX += 2;

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
            // this.player.anims.play('walk', true);
	    	this.jumps = this.MAX_JUMPS;
	    	this.jumping = false;
	    } else {
            this.player.anims.play('jump');
	    }

        if(this.jumps > 0 && Phaser.Input.Keyboard.DownDuration(cursors.up, 150)) {
	        this.player.body.velocity.y = this.JUMP_VELOCITY;
	        this.jumping = true;
	        // this.upKey.tint = 0xFACADE;
	    } 

        if(this.jumping && Phaser.Input.Keyboard.UpDuration(cursors.up)) {
	    	this.jumps--;
	    	this.jumping = false;
	    }
    }

    addPlatform() {
        let speedVariance =  Phaser.Math.Between(0, 50);

        if(this.isColor) {
            let platform = new Platform(this, this.platformSpeed - speedVariance, randomColor);
            this.platformGroup.add(platform);
            this.isColor = false;
        } else{
            // let color = Phaser.Utils.Array.GetRandom(this.otherColors);
            let platform = new Platform(this, this.platformSpeed - speedVariance, Phaser.Utils.Array.GetRandom(this.otherColors));
            this.platformGroup.add(platform);
            this.isColor = true;
        }

    }
}