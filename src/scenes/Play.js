class Play extends Phaser.Scene {
    constructor() {
        super('playScene');
    }

    preload() {
        
    }

    create() {
        this.JUMP_VELOCITY = -700;
        this.MAX_JUMPS = 3;
        this.SCROLL_SPEED = 4;
        this.physics.world.gravity.y = 3000;

        // this.cameras.main.setBackgroundColor('#000000');

        this.background = this.add.tileSprite(0, 0, game.config.width, game.config.height, 'background').setOrigin(0);

        this.ground = this.add.group();
        // this.ground.body.allowGravity = false;

        // let groundTile = this.physics.add.sprite(i, game.config.height - tileSize, 'platformer_atlas', 'block').setScale(SCALE).setOrigin(0);
        
        this.colors = ['yellow', 'purple'];
        this.randomColor = Phaser.Utils.Array.GetRandom(this.colors);

        for(let i = 0; i < game.config.width; i += brickSize) {
            let groundTile = this.physics.add.sprite(i, game.config.height - brickSize, 'bricks', this.randomColor + 'Brick').setOrigin(0);
            // let groundTile = this.physics.add.sprite(i, game.config.height - brickSize, 'ybrick').setOrigin(0);
            groundTile.body.immovable = true;
            groundTile.body.allowGravity = false;
            this.ground.add(groundTile);
        }

        // this.colors = ['yellow', 'purple'];
        // this.randomColor = Phaser.Utils.Array.GetRandom(this.colors);

        this.player = this.physics.add.sprite(75, game.config.height/2 - brickSize, this.randomColor, this.randomColor + '1').setScale(0.5);
        // this.player.body.allowGravity = false;

        this.anims.create({
            key: 'walk',
            frameRate: 15,
            // repeat: -1,
            frames: this.anims.generateFrameNames(this.randomColor, { 
                prefix: this.randomColor,
                // suffix: ".png",
                start: 1, 
                end: 6 }),
            repeat: -1
        });


        cursors = this.input.keyboard.createCursorKeys();
        this.physics.add.collider(this.player, this.ground);
    }

    update(){

        //based on position of random object, randomize color at that point


        this.background.tilePositionX += 2;


        this.player.onGround = this.player.body.touching.down;
	    // if so, we have jumps to spare
	    if(this.player.onGround) {
            this.player.anims.play('walk', true);
	    	this.jumps = this.MAX_JUMPS;
	    	this.jumping = false;
	    } else {
	    	// this.player.anims.play('yellow-jump');
            this.player.setTexture('yellow-jump'); ////////CHANGE TO VARIABLE LATER
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
}