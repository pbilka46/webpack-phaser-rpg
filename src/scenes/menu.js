export class Menu extends Phaser.Scene {
  constructor() {
    super({ key: 'menu' });
  }

  preload() {
    this.load.image(
      'bg',
      'bg2.png'
    );
  }

  create() {
    this.image = this.add.image(400, 400, 'bg');
    this.add.text(100, 700, 'Press x to start', { fontSize: '3.25rem', fill: '#0f0' });
    this.input.keyboard.on('keydown_X', function (event) {
      this.scene.start('game');
    }, this);
  }

  update() {
  }
}
