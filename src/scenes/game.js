import 'phaser';
let debugGraphics;
let helpText;
let showDebug = false;
let map;
let coinsCollected = 0;

function getHelpMessage ()
{
  return 'Zbieraj beczki z piwem!';
}

function updateText ()
{
  helpText.setText(
    'Zbieraj beczki z piwem!' +
    '\nZebrano: ' + coinsCollected
  );
}

function drawDebug ()
{
  debugGraphics.clear();
  
  if (showDebug) {
      // Pass in null for any of the style options to disable drawing that component
    map.renderDebug(debugGraphics, {
        tileColor: null, // Non-colliding tiles
        collidingTileColor: new Phaser.Display.Color(243, 134, 48, 200), // Colliding tiles
        faceColor: new Phaser.Display.Color(40, 39, 37, 255) // Colliding face edges
    });
  }
  
  helpText.setText(getHelpMessage());
}
export class Game extends Phaser.Scene {
  constructor() {
    super({ key: 'game' });

    this.velocity = 200;
  }

  preload() {
    this.load.spritesheet(
      'wolf',
      'sprite.png',
      { frameWidth: 30, frameHeight: 51.75, endFrame: 12 }
    );
    this.load.spritesheet(
      'coin',
      'keg.png',
      { frameWidth: 28, frameHeight: 32 }
    );
    this.load.tilemapTiledJSON('map', 'tile-col.json');
		this.load.image('ground_1x1', 'tile.png');
  }

  create() {
    map = this.make.tilemap({ key: 'map' });
    const groundTiles = map.addTilesetImage('ground_1x1');
    const coinTiles = map.addTilesetImage('coin');

    this.wallsLayer = map.createDynamicLayer('Background Layer', groundTiles, 0, 0);
    this.groundLayer = map.createDynamicLayer('Ground Layer', groundTiles, 0, 0);
    this.coinLayer = map.createDynamicLayer('Coin Layer', coinTiles, 0, 0);

    this.wallsLayer.setCollision(1);
    this.coinLayer.setTileIndexCallback(3, this.hitCoin, this);

    this.player = this.physics.add.sprite(100, 50, 'wolf', 1);
    const walkDown = {
      key: 'walkDown',
      frames: this.anims.generateFrameNumbers('wolf', { start: 0, end: 1, first: 2 }),
      frameRate: 15
    };
    const walkLeft = {
      key: 'walkLeft',
      frames: this.anims.generateFrameNumbers('wolf', { start: 6, end: 7, first: 8 }),
      frameRate: 15
    };
    const walkRight = {
      key: 'walkRight',
      frames: this.anims.generateFrameNumbers('wolf', { start: 3, end: 4, first: 5 }),
      frameRate: 15
    };
    const walkUp = {
      key: 'walkUp',
      frames: this.anims.generateFrameNumbers('wolf', { start: 9, end: 10, first: 11 }),
      frameRate: 15
    };
    
    this.physics.add.collider(this.player, this.wallsLayer);
    this.physics.add.overlap(this.player, this.coinLayer);
    this.cursors = this.input.keyboard.createCursorKeys();

    this.anims.create(walkDown);
    this.anims.create(walkLeft);
    this.anims.create(walkRight);
    this.anims.create(walkUp);

    debugGraphics = this.add.graphics();

    this.input.keyboard.on('keydown_C', function (event) {
        showDebug = !showDebug;
        drawDebug();
    });

    helpText = this.add.text(16, 16, getHelpMessage(), {
        fontSize: '22px',
        font: 'bold 20pt Courier',
        fill: '#FFF'
    });
    helpText.setScrollFactor(0);
  }

  update() {
    this.player.body.setVelocity(0);
    if (this.cursors.left.isDown) {
      this.player.body.setVelocityX(-this.velocity);
      this.player.anims.play('walkLeft', true);
    } else if (this.cursors.right.isDown) {
      this.player.body.setVelocityX(this.velocity);
      this.player.anims.play('walkRight', true);
    }

    else if (this.cursors.up.isDown) {
      this.player.body.setVelocityY(-this.velocity);
      this.player.anims.play('walkUp', true);
    } else if (this.cursors.down.isDown) {
      this.player.body.setVelocityY(this.velocity);
      this.player.anims.play('walkDown', true);
    }
  }

  hitCoin (sprite, tile)
  {
    this.coinLayer.removeTileAt(tile.x, tile.y);
    coinsCollected += 1;
    updateText();

    return false;
  }
}
