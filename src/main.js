/*
NAME: Rebecca Zhao
GAME TITLE: Color Blob
APPROXIMATE HOURS: 30+ hours
CREATIVE TILT: 
    Technical: I used tweens to animate the "Game Over" text which took a bit of research to figure out. I'm also proud of how I implemented
                the bricks, specifically detecting what color it is and making sure there is always a same colored platform the player can 
                jump on. This was much harder than I expected because I needed to research how to randomize colors, change animations to follow
                the new player's color, figure out how to use an atlas, and research a bit about groups and how to use them to detect collision.
    
    Visual: I drew out all the artwork from scratch and made each frame for the animations so I'm really proud of how they turned out.

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