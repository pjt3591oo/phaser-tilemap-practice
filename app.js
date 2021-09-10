const config = {
  type: Phaser.AUTO, // WebGL or Canvas중 어떤걸 쓸건지(AUTO는 웹 브라우저가 지원하는 방법을 선택)
  width: 800, 
  height: 600, 
  parent: "game-container", // 해당 ID 요소를 찾아서 사용
  scene: {
    preload: preload,
    create: create,
    update: update
  },
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 0 } // 중력을 넣지 않는다.
    }
  }
};

const game = new Phaser.Game(config);
let controls;
let cursors;
let player;

function preload() {
  // this.load.setBaseURL("http://127.0.0.1:8080");
  this.load.image("tiles", "https://raw.githubusercontent.com/pjt3591oo/phaser-tilemap-practice/main/assets/tileset/tuxmon-sample-32px.png");
  this.load.tilemapTiledJSON("map", "https://raw.githubusercontent.com/pjt3591oo/phaser-tilemap-practice/main/assets/tileset/tilemap/tuxmon-sample-32px.json");
  this.load.atlas("atlas", "https://raw.githubusercontent.com/pjt3591oo/phaser-tilemap-practice/main/assets/atlas.png", "https://raw.githubusercontent.com/pjt3591oo/phaser-tilemap-practice/main/assets/atlas.json");
}

function create() {
  const map = this.make.tilemap({ key: "map" });
  // 첫 번째 인자는 tile editor에서 불러온 tilesets 이름이고, 두 번째 인자는 this.load(tiles)로 가져온 타일 정보를 가진 스프라이트 시트 이미지
  const tileset = map.addTilesetImage("tuxmon-sample-32px", "tiles");
  
  // 첫 번째 인자는 time editor에서 layer, object 이름에 해당한다
  const belowLayer = map.createLayer("background", tileset, 0, 0);
  const worldLayer = map.createLayer("world", tileset, 0, 0);
  // const spawnObject = map.createObj("world", tileset, 0, 0);

  worldLayer.setCollisionByProperty({ collides: true });
  // const debugGraphics = this.add.graphics().setAlpha(0.75);
  // worldLayer.renderDebug(debugGraphics, {
  //   tileColor: null, // Color of non-colliding tiles
  //   collidingTileColor: new Phaser.Display.Color(243, 134, 48, 255), // Color of colliding tiles
  //   faceColor: new Phaser.Display.Color(40, 39, 37, 255) // Color of colliding face edges
  // });

  const spawnPoint = map.findObject("spawn", obj => obj.name === "spawn point1");
  player = this.physics.add
    .sprite(spawnPoint.x, spawnPoint.y, "atlas", "misa-front")
    .setSize(30, 40)
    .setOffset(0, 24);

  this.physics.add.collider(player, worldLayer);
  // this.physics.add.overlap(player, worldLayer, (player, worldObject) => {
  //   console.log('overlap')
  // });

  // player animations
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
  
  camera.startFollow(player); // 카메라가 플레이어를 따라 다니도록 한다.
  cursors = this.input.keyboard.createCursorKeys();
  const { left, right, up, down} = cursors;
  controls = new Phaser.Cameras.Controls.FixedKeyControl({
    camera,
    left, right, up, down,
    speed: 0.5,
  });

  camera.setBounds(0, 0, map.widthInPixels, map.heightInPixels);


}

function update(time, delta) {
  const speed = 176;
  const prevVelocity = player.body.velocity.clone();
  player.body.setVelocity(0);
  controls.update(delta);

   // Horizontal movement
   if (cursors.left.isDown) {
    player.body.setVelocityX(-speed);
  } else if (cursors.right.isDown) {
    player.body.setVelocityX(speed);
  }

  // Vertical movement
  if (cursors.up.isDown) {
    player.body.setVelocityY(-speed);
  } else if (cursors.down.isDown) {
    player.body.setVelocityY(speed);
  }

  // Normalize and scale the velocity so that player can't move faster along a diagonal
  player.body.velocity.normalize().scale(speed);

  // Update the animation last and give left/right animations precedence over up/down animations
  if (cursors.left.isDown) {
    player.anims.play("misa-left-walk", true);
  } else if (cursors.right.isDown) {
    player.anims.play("misa-right-walk", true);
  } else if (cursors.up.isDown) {
    player.anims.play("misa-back-walk", true);
  } else if (cursors.down.isDown) {
    player.anims.play("misa-front-walk", true);
  } else {
    player.anims.stop();

    // If we were moving, pick and idle frame to use
    if (prevVelocity.x < 0) player.setTexture("atlas", "misa-left");
    else if (prevVelocity.x > 0) player.setTexture("atlas", "misa-right");
    else if (prevVelocity.y < 0) player.setTexture("atlas", "misa-back");
    else if (prevVelocity.y > 0) player.setTexture("atlas", "misa-front");
  }
}