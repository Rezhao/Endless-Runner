//ADD CONDITION RESTRAINT OF MUST HOP ON SPECIFIC COLOR


class Platform extends Phaser.Physics.Arcade.Sprite{
    constructor(scene, velocity, color) {
        // call Phaser Physics Sprite constructor
        super(scene, game.config.width + brickWidth, Phaser.Math.Between(131, game.config.height - brickHeight/2), color + 'Brick'); 
        
        this.parentScene = scene;               // maintain scene context

        // set up physics sprite
        this.parentScene.add.existing(this);    // add to existing scene, displayList, updateList
        this.parentScene.physics.add.existing(this);    // add to physics system
        this.setVelocityX(velocity);            // make it go!
        this.setImmovable();                    
        // this.tint = Math.random() * 0xFFFFFF;   // randomize tint
        this.newPlatform = true;                 // custom property to control barrier spawning

        this.body.allowGravity = false;
        this.c = color;

        this.body.checkCollision.down = false;
        this.body.checkCollision.left = false;
        this.body.checkCollision.right = false;
    }

    update() {
        if(this.newPlatform && this.x < game.config.width/2 + 350) {
            // (recursively) call parent scene method from this context
            this.parentScene.addPlatform(this.parent, this.velocity);
            this.newPlatform = false;

        }

        // destroy paddle if it reaches the left edge of the screen
        if(this.x < -this.width) {
            this.destroy();
        }
    }

    getColor() {
        return this.c;
    }

    // setColor(c) {
    //     console.log(c + 'Brick');
    //     this.setTexture(c + 'Brick');
    // }
}