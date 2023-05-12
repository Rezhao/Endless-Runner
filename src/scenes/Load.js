class Load extends Phaser.Scene {
    constructor() {
        super('loadScene');
    }

    preload() {
        // set load path
        this.load.path = 'assets/';
        // take care of all of our asset loading now
        this.load.atlas("happy", "happy.png", "happy.json");
        this.load.atlas("yellow", "./yellow/yellow.png", "./yellow/yellow.json");
        this.load.atlas("bricks", "bricks.png", "bricks.json");
        this.load.image("pinkBrick", "./bricks/pinkBrick.png");

        this.load.atlas("purple", "./purple/purple.png", "./purple/purple.json");
        this.load.atlas("pink", "./pink/pink.png", "./pink/pink.json");

        this.load.image('yellow-jump', './yellow/yellowJump.png');
        // this.load.image('yellow',"yellow1.png");
        // this.load.image('yellowBrick','purpleBrick.png');
        this.load.image('background','background.png');
        // this.load.image('ybrick', 'y1.png');
        // this.load.atlas('platformer_atlas', 'kenny_sheet.png', 'kenny_sheet.json');
        // this.load.image('arrowKey', 'arrowKey.png');
        // this.load.image('talltrees', 'talltrees.png');
        // this.load.image('groundScroll', 'ground.png');
        // this.load.atlasXML('shooter_atlas', 'shooter_sheet.png', 'shooter_sheet.xml');
    }

    create() {
        // ...and pass to the next Scene
        this.scene.start('playScene');
    }
}