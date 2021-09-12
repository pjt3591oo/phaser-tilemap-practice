const config = {
  type: Phaser.AUTO, // WebGL or Canvas중 어떤걸 쓸건지(AUTO는 웹 브라우저가 지원하는 방법을 선택)
  width: 800, 
  height: 600, 
  parent: "game-container", // 해당 ID 요소를 찾아서 사용
  scene: [Scene1],
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 0 } // 중력을 넣지 않는다.
    }
  }
};

const game = new Phaser.Game(config);
