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

        this.ground = this.add.group();
        // this.ground.body.allowGravity = false;

        // let groundTile = this.physics.add.sprite(i, game.config.height - tileSize, 'platformer_atlas', 'block').setScale(SCALE).setOrigin(0);
        
        for(let i = 0; i < game.config.width; i += brickSize) {
            let groundTile = this.physics.add.sprite(i, game.config.height - brickSize, 'bricks', 'yellowBrick').setOrigin(0);
            groundTile.body.immovable = true;
            groundTile.body.allowGravity = false;
            this.ground.add(groundTile);
        }

        this.player = this.physics.add.sprite(50, game.config.height/2 - brickSize, 'yellow').setScale(0.5);
        // this.player.body.allowGravity = false;

        this.physics.add.collider(this.player, this.ground);
    }
}