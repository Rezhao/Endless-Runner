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

        //loading bubble particle
        this.load.image('bubble','bubble.png');
        
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

        //delay by 1 second and then have the platforms start spawning in
        this.time.delayedCall(1000, () => { 
            this.addPlatform(); 
        });

        //creating the starting platform that the player begins on
        this.startGround = this.physics.add.sprite(-10, game.config.height - 75, randomColor + 'Brick').setOrigin(0);
        this.startGround.body.immovable = true; //set it so ground isn't affected by physics
        this.startGround.body.allowGravity = false; //set it so the ground doesn't fall 

        //delay by 5 seconds and then destroy starting platform
        this.time.delayedCall(5000, () => { 
            this.startGround.destroy();
        });

        //creating physics player
        this.player = this.physics.add.sprite(75, game.config.height/2 - 30, randomColor, randomColor + '1').setScale(0.5);
        //setting it so only the bottom of player checks for collision
        this.player.body.checkCollision.up = false; 
        this.player.body.checkCollision.left = false;
        this.player.body.checkCollision.right = false;

        //initializing the score of player
        this.score = 0;

        //creating walking animation (when player moves left and right)
        this.walk = this.anims.create({
            key: 'walk',
            frameRate: 15,
            frames: this.anims.generateFrameNames(randomColor, { 
                prefix: randomColor,
                start: 1, 
                end: 6 }),
            repeat: -1
        });

        //creating idle animation (when the player isn't moving)
        this.idle = this.anims.create({
            key: 'idle',
            defaultTextureKey: randomColor,
            frames: [
                { frame: randomColor + '1' }
            ],
            repeat: -1
        });

        //creating jump animation (when the player jumps/is in the air)
        this.jump = this.anims.create({
            key: 'jump',
            defaultTextureKey: 'jump',
            frames: [
                { frame: randomColor + 'Jump' }
            ],
            repeat: -1
        });

        //creating event to increase speed as the player plays (increasing difficulty)
        this.difficultyTimer = this.time.addEvent({
            delay: 5000,
            callback: this.increaseSpeed,
            callbackScope: this,
            loop: true
        });

        //variable to keep track of boba velocity
        this.boba_v;
        //variable to keep track of how many platforms has passed before passing in another boba power up
        this.bobaCounter = 0;

        //used to keep track of player input
        cursors = this.input.keyboard.createCursorKeys();

        //check collision of player and the starting platform
        this.physics.add.collider(this.player, this.startGround);

        //configuration to paint the score and high score on the screen
        let scoreConfig = {
            fontFamily: 'simpleKindOfGirl',
            fontSize: '28px',
            backgroundColor: '#c9b8ff',
            color: '#6a38ff',
            align: 'right',
            padding: {
                top: 5,
                bottom: 5,
                right: 5,
            },
            fixedWidth: 100
        }

        //painting player score
        this.scoreLeft = this.add.text(10, 10, this.score, scoreConfig);
        this.add.rectangle(game.config.width - 260, 10, 250, 40, 0xc9b8ff).setOrigin(0, 0);

        //painting high score
        scoreConfig.fixedWidth = 0;
        this.highScore = this.add.text(game.config.width - 70, 10, localStorage.getItem("score"), scoreConfig);

        //painting high score label
        scoreConfig.fontFamily = "bubbleBobble";
        this.add.text(game.config.width - 250, 10, "High Score: ", scoreConfig);
    }

    update(){
        //if the player is outside of the screen, play game over scene
        if(this.outsideBounds()){
            this.blobBackgroundMusic.stop(); //stop the background music
            this.time.delayedCall(1000, () => { this.scene.start('gameOverScene'); }); //delay start of game over scene by 1 second
        }

        //checking if the player overlaps with boba power up
        if(this.physics.overlap(this.player, this.boba)){
            this.sound.play('sparkle'); //plays sparkle sound effect
            this.switchColor(); //calls method that performs color switching
        }

        //reset high score if current player score is greater
        if(localStorage.getItem("score") < this.score){
            localStorage.setItem("score", this.score); //sets high score to new score
            this.highScore.text = localStorage.getItem("score"); //update text on screen to new high score
        }

        //calls method that updates score based on which platforms player jumped on
        this.updateScore();

        //scrolling background
        this.background.tilePositionX += 2;

        //adjusting acceleration, drag, and animation to match player input
        if(cursors.left.isDown) { //if player presses left arrow key
            this.player.body.setAccelerationX(-this.ACCELERATION); //make player move left
            this.player.setFlip(true, false); //flip the animation so it faces left
            this.player.anims.play('walk', true); //play the walking animation
        } else if(cursors.right.isDown) { //if player presses right arrow key
            this.player.body.setAccelerationX(this.ACCELERATION); //move player right
            this.player.resetFlip(); //reset animation to face right
            this.player.anims.play('walk', true); //play the walking animation
        } else {
            this.player.body.setAccelerationX(0); // set acceleration to 0 so DRAG will take over
            this.player.body.setDragX(this.DRAG); //drag to stop player from moving
            this.player.anims.play('idle'); //play idle animation
        }

        //check if player is touching any platform
        this.player.onGround = this.player.body.touching.down;

        //if the player is on a platform
	    if(this.player.onGround) {
	    	this.jumps = this.MAX_JUMPS; //set jump count to max
	    	this.jumping = false; //set player to not jumping
	    } else {
            this.player.anims.play('jump'); //if player is not on platform, they are in the air i.e. jumping
	    }

        //if up arrow key is pressed and we have not reached max jumps yet
        if(this.jumps > 0 && Phaser.Input.Keyboard.DownDuration(cursors.up, 150)) {
	        this.player.body.velocity.y = this.JUMP_VELOCITY; //set player velocity used to jump
	        this.jumping = true; //set jumping to true
	    } 

        //if player is jumping and up arrow is pressed
        if(this.jumping && Phaser.Input.Keyboard.UpDuration(cursors.up)) {
	    	this.jumps--; //subtract number of jumps player has left
	    	this.jumping = false; //set jumping to false
            this.sound.play('boing'); //play boing sound effect
	    }
    }

    addPlatform() {
        //randomize speed of platforms
        let speedVariance =  Phaser.Math.Between(0, 50);

        //if we need to create a new platform that is same color as player
        if(this.isColor) {
            this.platform = new Platform(this, this.platformSpeed - speedVariance, randomColor); //create new platform with same color
            this.sameColorGroup.add(this.platform); //add this to the same color group
            this.isColor = false; //set isColor to false so next platform is another color
            this.boba_v = this.platformSpeed - speedVariance; //set boba velocity to same as platform

            //if at least 5 same colored platforms have passed, we add a boba power up
            if(this.bobaCounter >= 5){
                this.addBoba(); //calls function to add boba
                this.bobaCounter = 0; //reset counter to 0
                this.bobaPlatform = this.platform; //keep track of which platform the boba is on
            }

            this.bobaCounter++; //update boba counter

        } else{ //otherwise, we want to create a platform that is a different color from player
            let platform = new Platform(this, this.platformSpeed - speedVariance, Phaser.Utils.Array.GetRandom(this.otherColors)); //creating new platform with different color
            this.platformGroup.add(platform); //add new platform to other colored platforms group
            this.isColor = true; //set isColor to true
        }
    }

    increaseSpeed() {
        //increase speed of platforms to make it increasingly harder to play
        if(this.platformSpeed >= this.platformSpeedMax){ //increase speed of platforms until it reaches max
            this.platformSpeed -= 20; 
        }
    }

    addBoba() {
        //creating new boba power up
        this.boba = this.physics.add.sprite(this.platform.x, this.platform.y - 45, 'boba').setScale(0.8);
        this.boba.setVelocityX(this.boba_v); //setting boba velocity
        this.boba.setImmovable(); //make it so it won't be affected by physics
        this.boba.body.allowGravity = false; //make it so it doesn't fall
        this.physics.add.collider(this.boba, this.sameColorGroup); //add collision detecter of boba power up and same colored platform
    }

    switchColor() {
        //creating particle emitter for boba explosion
        var emitter = this.add.particles(this.boba.x, this.boba.y, 'bubble', {
            lifespan: 4000,
            speed: { min: 150, max: 250 },
            scale: { start: 0.8, end: 0 },
            gravityY: 150,
            tint: [ 0xff91cc, 0xc79cff, 0x92c2fc, 0x92fcc0, 0xf0f7a1, 0xface98 ],
            blendMode: 'ADD',
            emitting: false
        });

        //destroy the boba element
        this.boba.destroy();

        //play particle emitter 
        emitter.explode(30);

        //update score by 5
        this.score += 5;
        //repaint score on screen
        this.scoreLeft.text = this.score;

        //get another random color that is different from current player's color
        randomColor = Phaser.Utils.Array.GetRandom(this.otherColors);

        //update animations so all of them match the new color 
        this.updateAnimations();

        //change current platform to match the new color of player
        this.bobaPlatform.setTexture(randomColor + 'Brick');

        //changing player image to new color
        this.player.setTexture(randomColor, randomColor + '1');

        //changing all platforms in same color group to new color
        this.sameColorGroup.children.each(function(brick) { //loops through each child
            brick.setTexture(randomColor + 'Brick'); //set each child's texture to new color
        });

        //make a copy of the colors array
        this.otherColors = [...colors];

        //remove new current color of player
        Phaser.Utils.Array.Remove(this.otherColors, randomColor);
    }

    updateAnimations() {
        //remove all the previous animations
        this.anims.remove('walk');
        this.anims.remove('jump');
        this.anims.remove('idle');

        //updating walk animation with new color frames
        this.walk = this.anims.create({
            key: 'walk',
            frameRate: 15,
            frames: this.anims.generateFrameNames(randomColor, { 
                prefix: randomColor,
                start: 1, 
                end: 6 }),
            repeat: -1
        });

        //updating idle animation with new color frames
        this.idle = this.anims.create({
            key: 'idle',
            defaultTextureKey: randomColor,
            frames: [
                { frame: randomColor + '1' }
            ],
            repeat: -1
        });

        //updating jump animation with new color frames
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
        //checks if the player collided with a same colored platform
        this.physics.add.collider(this.player, this.sameColorGroup, (player, platform) =>{
            //if the player hasn't collided with this platform yet
            if(!this.platformLanded.contains(platform)) {
                this.platformLanded.add(platform); //add it to the already landed platforms group
                this.score += 3; //update the score by 3
                this.scoreLeft.text = this.score; //repaint the score text
            }
        });

        //checks if the player collides with a different colored platform
        this.physics.add.collider(this.player, this.platformGroup, (player, platform) =>{
            //if the player hasn't collided with this platform yet
            if(!this.platformLanded.contains(platform)) {
                this.platformLanded.add(platform); //add it to the already landed platforms group
                if(this.score > 0){ //check if score is not zero
                    this.score -= 1; //subtract one point from their score
                }
                this.scoreLeft.text = this.score; //repaint score text
            }
        });
    }

    outsideBounds() {
        //checks if player has fallen outside bounds of screen
        if(this.player.y > game.config.height + 130){
                this.jumps = -1; //restrict player from jumping after falling out of bounds
	    	    this.jumping = false; //set jumping to false
                return true; //return true if player is outside
        } else{
            return false; //return false if player is inside bounds
        }
    }
}