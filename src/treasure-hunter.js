/**
 * 实战游戏
 */

import PIXI from './pixi.js';
import keyboard from './keyboard.js';
import { hitTestRectangle } from './collision-detection.js';

const Application = PIXI.Application;
const Container = PIXI.Container;
const loader = PIXI.loader;
const resources = PIXI.loader.resources;
const Graphics = PIXI.Graphics;
const TextureCache = PIXI.utils.TextureCache;
const Sprite = PIXI.Sprite;
const Text = PIXI.Text;
const TextStyle = PIXI.TextStyle;

const app = new Application({
  width: 512,
  height: 512,
  antialias: true,
});

function runTreasureHunter() {
  document.body.appendChild(app.view);

  loader
    .add('src/assets/treasureHunter.json')
    .load(setup);
}

let state, explorer, treasure, blobs, chimes, exit, player, dungeon,
  door, healthBar, message, gameScene, gameOverScene, enemies, id;

function setup() {
  // initialize the game sprites, set the game `state` to `play`
  // and start the `gameLoop`

  gameScene = new Container();
  app.stage.addChild(gameScene);

  id = resources['src/assets/treasureHunter.json'].textures;

  dungeon = new Sprite(id['dungeon.png']);
  gameScene.addChild(dungeon);

  door = new Sprite(id['door.png']);
  door.position.set(32, 0);
  gameScene.addChild(door);

  explorer = new Sprite(id['explorer.png']);
  explorer.position.set(
    68,
    gameScene.height / 2 - explorer.height / 2
  );
  explorer.vx = 0;
  explorer.vy = 0;
  gameScene.addChild(explorer);

  treasure = new Sprite(id['treasure.png']);
  treasure.position.set(
    gameScene.width - treasure.height - 48,
    gameScene.height / 2 - treasure.height / 2
  );
  gameScene.addChild(treasure);

  const numberOfBlobs = 6;
  const spacing = 48;
  // 第一个 blob 的 x 轴向偏移
  const xOffset = 150;
  const speed = 2;
  let direction = 1;

  // an array to store all the blob monsters
  blobs = [];

  for (let i = 0; i < numberOfBlobs; i++) {
    const blob = new Sprite(id['blob.png']);
    const x = spacing * i + xOffset;
    // random y position
    const y = randomInt(0, app.stage.height - blob.height);
    blob.position.set(x, y);
    blob.vy = speed * direction;
    direction *= -1;
    blobs.push(blob);
    gameScene.addChild(blob);
  }

  healthBar = new Container();
  healthBar.position.set(app.stage.width - 170, 4);
  gameScene.addChild(healthBar);

  // 黑背景条
  const innerBar = new Graphics();
  innerBar.beginFill(0x000);
  innerBar.drawRect(0, 0, 128, 8);
  innerBar.endFill();
  healthBar.addChild(innerBar);

  // 红血条
  const outerBar = new Graphics();
  outerBar.beginFill(0xff3300);
  outerBar.drawRect(0, 0, 128, 8);
  outerBar.endFill();
  healthBar.addChild(outerBar);

  healthBar.outer = outerBar;

  gameOverScene = new Container();
  app.stage.addChild(gameOverScene);
  gameOverScene.visible = false;

  const style = new TextStyle({
    fontFamily: 'Futura',
    fonSize: 64,
    fill: 0xffffff,
  });
  message = new Text('The End!', style);
  message.position.set(120, app.stage.height / 2 - 32);
  gameOverScene.addChild(message);

  const left = keyboard('ArrowLeft');
  const up = keyboard('ArrowUp');
  const right = keyboard('ArrowRight');
  const down = keyboard('ArrowDown');

  left.press = () => {
    explorer.vx = -5;
    explorer.vy = 0;
  };
  left.release = () => {
    if (!right.isDown && explorer.vy === 0) {
      explorer.vx = 0;
    }
  };

  up.press = () => {
    explorer.vy = -5;
    explorer.vx = 0;
  };
  up.release = () => {
    if (!down.isDown && explorer.vx === 0) {
      explorer.vy = 0;
    }
  };

  right.press = () => {
    explorer.vx = 5;
    explorer.vy = 0;
  };
  right.release = () => {
    if (!left.isDown && explorer.vy === 0) {
      explorer.vx = 0;
    }
  };

  down.press = () => {
    explorer.vy = 5;
    explorer.vx = 0;
  };
  down.release = () => {
    if (!up.isDown && explorer.vx === 0) {
      explorer.vy = 0;
    }
  };

  // set the game state
  state = play;

  // start the game loop
  app.ticker.add(delta => gameLoop(delta));
}

function gameLoop(delta) {
  // runs the current game `state` in a loop and renders the sprites

  state(delta);
}

function play(delta) {
  // all the game logic goes here

  explorer.x += explorer.vx;
  explorer.y += explorer.vy;

  // 将探险者限制在地牢范围内
  contain(explorer, { x: 28, y: 10, width: 488, height: 480 });

  // 标记探险者是否被怪物碰到
  let explorerHit = false;

  blobs.forEach(blob => {
    blob.y += blob.vy;
    const blobHitsWall = contain(blob, { x: 28, y: 10, width: 488, height: 480 });

    if (blobHitsWall === 'top' || blobHitsWall === 'bottom') {
      blob.vy *= -1;
    }

    if (hitTestRectangle(explorer, blob)) {
      explorerHit = true;
    }
  });

  if (explorerHit) {
    explorer.alpha = 0.5;
    healthBar.outer.width -= 1;
  } else {
    explorer.alpha = 1;
  }

  if (hitTestRectangle(explorer, treasure)) {
    treasure.x = explorer.x + 8;
    treasure.y = explorer.y + 8;
  }

  if (healthBar.outer.width < 0) {
    state = end;
    message.text = 'You lost!';
  }

  if (hitTestRectangle(treasure, door)) {
    state = end;
    message.text = 'You won!';
  }
}

function end() {
  // all the code that should run at the end of the game
  
  gameScene.visible = false;
  gameOverScene.visible = true;
}

/* Helper functions */

/**
 * 将 sprite 限制在 container 的区域
 * 
 * @param {PIXI.Sprite} sprite
 * @param {PIXI.Container} container
 * @returns {'left'|'right'|'top'|'bottom'}
 */
function contain(sprite, container) {
  let collision;

  if (sprite.x < container.x) {
    sprite.x = container.x;
    collision = 'left';
  }

  if (sprite.y < container.y) {
    sprite.y = container.y;
    collision = 'top';
  }

  if (sprite.x + sprite.width > container.width) {
    sprite.x = container.width - sprite.width;
    collision = 'right';
  }

  if (sprite.y + sprite.height > container.height) {
    sprite.y = container.height - sprite.height;
    collision = 'bottom';
  }

  return collision;
}

/**
 * **非严格**地返回 [min, max] 之间的任意值 
 *
 * @param {number} min
 * @param {number} max
 * @returns {number}
 */
function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export {
  runTreasureHunter,
}