/*
https://airum82.medium.com/working-with-texture-atlases-in-phaser-3-25c4df9a747a 

https://pixabay.com/sound-effects/search/sparkle/ 

https://www.fontspace.com/search?q=bubble

https://www.leshylabs.com/apps/sstool/


*/


'use strict';

let cursors;
const brickWidth = 193;
const brickHeight = 23;

let config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    physics: {
        default: 'arcade',
        arcade: {
            // debug: true,
            gravity: {
                x: 0,
                y: 0
            }
        }
    },
    scene: [Title, Rules, Play, GameOver],
}

let game = new Phaser.Game(config);

let centerX = game.config.width/2;
let colors = ['yellow', 'purple', 'pink', 'green', 'orange', 'red', 'blue'];
let randomColor = Phaser.Utils.Array.GetRandom(colors);