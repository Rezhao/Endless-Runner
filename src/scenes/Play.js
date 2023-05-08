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
        
        for(let i = 0; i < game.config.width; i += brickSize) {
            let groundTile = this.physics.add.sprite(i, game.config.height - brickSize, 'bricks', 'yellowBrick').setOrigin(0);
            // let groundTile = this.physics.add.sprite(i, game.config.height - brickSize, 'ybrick').setOrigin(0);
            groundTile.body.immovable = true;
            groundTile.body.allowGravity = false;
            this.ground.add(groundTile);
        }

        this.player = this.physics.add.sprite(50, game.config.height/2 - brickSize, 'yellow').setScale(0.5);
        // this.player.body.allowGravity = false;

        this.physics.add.collider(this.player, this.ground);
    }

    update(){
        this.background.tilePositionX += 2;


        this.player.onGround = this.player.body.touching.down;
	    // if so, we have jumps to spare
	    if(this.player.onGround) {
            this.player.anims.play('walk', true);
	    	this.jumps = this.MAX_JUMPS;
	    	this.jumping = false;
	    } else {
	    	this.player.anims.play('jump');
	    }
    }
}