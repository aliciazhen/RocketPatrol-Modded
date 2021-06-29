class Play extends Phaser.Scene{
    constructor(){
        super("playScene");
    }

    preload() {
        this.load.image("starfield", "./assets/starfield.png");
        this.load.image("background", "./assets/galaxy.png");
        this.load.image("rocket", "./assets/rocket.png");
        this.load.image("spaceship", "./assets/spaceship.png");
        this.load.spritesheet('explosion', './assets/explosion.png', {frameWidth: 64, frameHeight: 32, startFrame: 0, endFrame: 9});
    }

    create(){

        
        // mouse controls
        this.input.on('pointermove', function (pointer) {
            this.p1Rocket.x = pointer.x
        }, this);

        this.input.on('pointerdown', function (pointer) {
            this.p1Rocket.isFiring = true
            this.p1Rocket.sfxRocket.play()
        }, this);

        // audio variables
        let explosion_sfx1 = this.sound.add('explosion_sfx1');
        let explosion_sfx2 = this.sound.add('explosion_sfx2');
        let explosion_sfx3 = this.sound.add('explosion_sfx3');
        let explosion_sfx4 = this.sound.add('explosion_sfx4');

        // music
        let backgroundMusic = this.sound.add('background_music');
        backgroundMusic.play()

        // background
        this.galaxy = this.add.tileSprite(
            0,0,640,480, 'background', 
        ).setOrigin(0,0);

        // rocket
        this.p1Rocket = new Rocket(
            this, 
            game.config.width/2,
            game.config.height - borderUISize - borderPadding,
            'rocket'
        );

        // spaceships
        this.ship1 = new Ship(
            this,
            100,
            200,
            'spaceship'
        )
        

        this.ship2 = new Ship(
            this,
            300,
            240,
            'spaceship'
        )

        this.ship3 = new Ship(
            this,
            380,
            150,
            'spaceship'
        )

        // white UI background
        this.add.rectangle(
            0, 
            borderUISize + borderPadding, 
            game.config.width, 
            borderUISize * 2,
            0xFFFFFF,
            ).setOrigin(0,0);

        // white borders
        this.add.rectangle(0, 0, game.config.width, borderUISize, 0xFFFFFF).setOrigin(0 ,0);
	    this.add.rectangle(0, game.config.height - borderUISize, game.config.width, borderUISize, 0xFFFFFF).setOrigin(0 ,0);
	    this.add.rectangle(0, 0, borderUISize, game.config.height, 0xFFFFFF).setOrigin(0 ,0);
	    this.add.rectangle(game.config.width - borderUISize, 0, borderUISize, game.config.height, 0xFFFFFF).setOrigin(0 ,0);
    
        // define keys
        keyF = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F);
        keyR = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);
        keyP = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.P);
        keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);

        // animation
        this.anims.create({
            key: 'explode',
            frames: this.anims.generateFrameNumbers('explosion', { start: 0, end: 9, first: 0}),
            frameRate: 30
        });
      
        this.p1Score = 0;
        let scoreConfig = {
            fontFamily: 'Courier',
            fontSize: '28px',
            backgroundColor: '#F3B141',
            color: '#843605',
            align: 'right',
            padding: {
            top: 5,
            bottom: 5,
            },
            fixedWidth: 100
        }
        this.scoreLeft = this.add.text(borderUISize + borderPadding, borderUISize + borderPadding*2, this.p1Score, scoreConfig);

        // game over
        this.gameOver = false;

        // timer
        scoreConfig.fixedWidth = 0;
        this.clock = this.time.delayedCall(game.settings.gameTimer, () => {
            this.add.text(game.config.width/2, game.config.height/2, 'GAME OVER', scoreConfig).setOrigin(0.5);
            this.add.text(game.config.width/2, game.config.height/2 + 64, 'Press (R) to Restart', scoreConfig).setOrigin(0.5);
            this.gameOver = true;
        }, null, this);
        
    }    

    update() {
        if (this.gameOver && Phaser.Input.Keyboard.JustDown(keyR)) {
            this.scene.restart();
        }
        
        if (this.gameOver && Phaser.Input.Keyboard.JustDown(keyLEFT)) {
            this.scene.start("menuScene");
        }
        this.galaxy.tilePositionX += 4;

        this.p1Rocket.update();
        this.ship1.update();
        this.ship2.update();
        this.ship3.update();

        // check collisions
        if(this.checkCollision(this.p1Rocket, this.ship3)) {
            this.p1Rocket.reset();
            this.shipExplode(this.ship3);   
        }
        if (this.checkCollision(this.p1Rocket, this.ship2)) {
            this.p1Rocket.reset();
            this.shipExplode(this.ship2);
        }
        if (this.checkCollision(this.p1Rocket, this.ship1)) {
            this.p1Rocket.reset();
            this.shipExplode(this.ship1);
        }

        if (!this.gameOver) {               
            this.p1Rocket.update();         // update rocket sprite
            this.ship1.update();           // update spaceships (x3)
            this.ship2.update();
            this.ship3.update();
        } 
    }

    checkCollision(rocket, ship) {
        if (rocket.x < ship.x + ship.width && 
            rocket.x + rocket.width > ship.x && 
            rocket.y < ship.y + ship.height &&
            rocket.height + rocket.y > ship. y) {
                return true;
        } else {
            return false;
        }
    }

    shipExplode(ship) {
        ship.alpha = 0;                         
        let boom = this.add.sprite(ship.x, ship.y, 'explosion').setOrigin(0, 0);
        boom.anims.play('explode');
        boom.on('animationcomplete', () => {
          ship.reset();
          ship.alpha = 1;
          boom.destroy();
        });

        this.p1Score += 1;
        this.scoreLeft.text = this.p1Score;       
        this.sound.play(Phaser.Math.RND.pick(['explosion_sfx1', 'explosion_sfx2', 'explosion_sfx3', 'explosion_sfx4']));
        this.clock += 1000;  
    } 

    //speed-up mechanic
    speedUpShips(){
        if (this.clock = 3000) {
            game.settings = {
                spaceshipSpeed: 5
            }
        }
    }
}
