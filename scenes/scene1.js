class Scene1 extends Phaser.Scene {
  controls;
  cursors;
  player;

  constructor() {
    super("Scene1");
  }

  preload() {
    // this.load.setBaseURL("http://127.0.0.1:8080");
    this.load.image("tiles", "https://raw.githubusercontent.com/pjt3591oo/phaser-tilemap-practice/main/assets/tileset/tuxmon-sample-32px.png");
    this.load.tilemapTiledJSON("map", "https://raw.githubusercontent.com/pjt3591oo/phaser-tilemap-practice/main/assets/tileset/tilemap/tuxmon-sample-32px.json");
    this.load.atlas("atlas", "https://raw.githubusercontent.com/pjt3591oo/phaser-tilemap-practice/main/assets/atlas.png", "https://raw.githubusercontent.com/pjt3591oo/phaser-tilemap-practice/main/assets/atlas.json");
  }

  create() {
    const map = this.make.tilemap({ key: "map" });
    // 첫 번째 인자는 tile editor에서 불러온 tilesets 이름이고, 두 번째 인자는 this.load(tiles)로 가져온 타일 정보를 가진 스프라이트 시트 이미지
    const tileset = map.addTilesetImage("tuxmon-sample-32px", "tiles");
    
    // 첫 번째 인자는 time editor에서 layer, object 이름에 해당한다
    const belowLayer = map.createLayer("background", tileset, 0, 0);
    const worldLayer = map.createLayer("world", tileset, 0, 0);
  
    worldLayer.setCollisionByProperty({ collides: true });
  
    const spawnPoint = map.findObject("spawn", obj => obj.name === "spawn point1");
    this.player = this.physics.add
      .sprite(spawnPoint.x, spawnPoint.y, "atlas", "misa-front")
      .setSize(30, 40)
      .setOffset(0, 24);
  
    this.physics.add.collider(this.player, worldLayer);

    const anims = this.anims;
    anims.create({
      key: "misa-left-walk",
      frames: anims.generateFrameNames("atlas", { prefix: "misa-left-walk.", start: 0, end: 3, zeroPad: 3 }),
      frameRate: 10,
      repeat: -1
    });
    anims.create({
      key: "misa-right-walk",
      frames: anims.generateFrameNames("atlas", { prefix: "misa-right-walk.", start: 0, end: 3, zeroPad: 3 }),
      frameRate: 10,
      repeat: -1
    });
    anims.create({
      key: "misa-front-walk",
      frames: anims.generateFrameNames("atlas", { prefix: "misa-front-walk.", start: 0, end: 3, zeroPad: 3 }),
      frameRate: 10,
      repeat: -1
    });
    anims.create({
      key: "misa-back-walk",
      frames: anims.generateFrameNames("atlas", { prefix: "misa-back-walk.", start: 0, end: 3, zeroPad: 3 }),
      frameRate: 10,
      repeat: -1
    });
  
    const camera = this.cameras.main;
    
    camera.startFollow(this.player); // 카메라가 플레이어를 따라 다니도록 한다.
    this.cursors = this.input.keyboard.createCursorKeys();
    
    const { left, right, up, down} = this.cursors;
    this.controls = new Phaser.Cameras.Controls.FixedKeyControl({
      camera,
      left, right, up, down,
      speed: 0.5,
    });
  
    camera.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
  }

  update(time, delta) {
    const speed = 176;
    const prevVelocity = this.player.body.velocity.clone();
    this.player.body.setVelocity(0);
    this.controls.update(delta);
  
     // Horizontal movement
     if (this.cursors.left.isDown) {
      this.player.body.setVelocityX(-speed);
    } else if (this.cursors.right.isDown) {
      this.player.body.setVelocityX(speed);
    }
  
    // Vertical movement
    if (this.cursors.up.isDown) {
      this.player.body.setVelocityY(-speed);
    } else if (this.cursors.down.isDown) {
      this.player.body.setVelocityY(speed);
    }
  
    // Normalize and scale the velocity so that this.player can't move faster along a diagonal
    this.player.body.velocity.normalize().scale(speed);
  
    // Update the animation last and give left/right animations precedence over up/down animations
    if (this.cursors.left.isDown) {
      this.player.anims.play("misa-left-walk", true);
    } else if (this.cursors.right.isDown) {
      this.player.anims.play("misa-right-walk", true);
    } else if (this.cursors.up.isDown) {
      this.player.anims.play("misa-back-walk", true);
    } else if (this.cursors.down.isDown) {
      this.player.anims.play("misa-front-walk", true);
    } else {
      this.player.anims.stop();
  
      // If we were moving, pick and idle frame to use
      if (prevVelocity.x < 0) this.player.setTexture("atlas", "misa-left");
      else if (prevVelocity.x > 0) this.player.setTexture("atlas", "misa-right");
      else if (prevVelocity.y < 0) this.player.setTexture("atlas", "misa-back");
      else if (prevVelocity.y > 0) this.player.setTexture("atlas", "misa-front");
    }
  }
}