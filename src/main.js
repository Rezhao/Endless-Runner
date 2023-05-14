/*
https://airum82.medium.com/working-with-texture-atlases-in-phaser-3-25c4df9a747a 


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
            debug: true,
            gravity: {
                x: 0,
                y: 0
            }
        }
    },
    scene: [Load, Title, Play],
}

let game = new Phaser.Game(config);

let centerX = game.config.width/2;
let randomColor;
let colors = ['yellow', 'purple', 'pink', 'green', 'orange', 'red', 'blue'];