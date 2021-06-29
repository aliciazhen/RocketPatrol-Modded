let config = {
    type: Phaser.CANVAS,
    width: 640,
    height: 480,
    scene: [Menu, Play, Instructions],
}


let game = new Phaser.Game(config);

let borderUISize = game.config.height / 15;
let borderPadding = borderUISize / 3;

// modded a keyDOWN for instructions
let keyLEFT, keyRIGHT, keyDOWN, keyF, keyR, keyP;


// +--------------------------------------------------------+


// Alicia Zhen
// Rocket Patrol [Modded] | 6.29.2021 | 10 hours

//      POINTS BREAKDOWN       
// High Score Tracking - 5 pts
// Ability to control the Rocket after it's fired - 5 pts
// Own copyright-free background music to Play Scene - 5 pts
// New background - 5 pts
// 4 new explosion SFX that randomizes which one plays on impact - 10 pts
// Mouse control for player movement & mouse click to fire - 20 pts
// Timing / scoring mechanism that adds time to the clock for successful hits - 20 pts

// *Comments - Added an 'Instructions' scene for clarity!
//             Most of the coding was referenced from menu.js, but I'm hoping I can get 10 or 20 pts for it!