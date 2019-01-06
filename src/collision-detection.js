/**
 * 碰撞检测
 */

import PIXI from './pixi.js';
import keyboard from './keyboard.js';

const Sprite = PIXI.Sprite;
const Graphics = PIXI.Graphics;
const Text = PIXI.Text;

const message = new Text('No collision', {
  fill: '0xfff'
})

/**
 * 检测两个物体是否碰撞
 * @param {PIXI.Container} r1
 * @param {PIXI.Container} r2
 * @returns {boolean}
 */
function hitTestRectangle(r1, r2) {
  let hit, combinedHalfWidths, combinedHalfHeights, vx, vy;

  // if there's a collision
  hit = false;

  // find the center points of each sprite
  r1.centerX = r1.x + r1.width / 2;
  r1.centerY = r1.y + r1.height / 2;
  r2.centerX = r2.x + r2.width / 2;
  r2.centerY = r2.y + r2.height / 2;

  //find the half-widths and half-heights of each sprite
  r1.halfWidth = r1.width / 2;
  r1.halfHeight = r1.height / 2;
  r2.halfWidth = r2.width / 2;
  r2.halfHeight = r2.height / 2;

  // calculate the distance vector between the objects
  vx = r1.centerX - r2.centerX;
  vy = r1.centerY - r2.centerY;

  // figure out the combined half-widths and half-heights
  combinedHalfWidths = r1.halfWidth + r2.halfWidth;
  combinedHalfHeights = r1.halfHeight + r2.halfHeight;

  if (Math.abs(vx) < combinedHalfWidths
      && Math.abs(vy) < combinedHalfHeights) {
    // collision
    hit = true;
  }
  return hit;
}

function play(cat, box, delta) {
  cat.x += cat.vx;
  cat.y += cat.vy;

  if (hitTestRectangle(cat, box)) {
    // there's a collision, change the message text

    message.text = 'Hit!';
    // 给 box 应用新的颜色
    box.tint = 0xff3300;
  } else {
    message.text = 'No collision';
    box.tint = 0xff9933;
  }
}

function moveCatWithCollisionDetection(app) {
  let state;

  const box = new Graphics();
  box.lineStyle(1, 0xff3399, 1);
  box.beginFill(0xff9933, 0.8);
  box.drawRect(0, 0, 60, 60);
  box.position.set(300, 300);
  box.endFill();

  const cat = new Sprite.fromImage('src/assets/cat.png');
  cat.y = 96;

  cat.vx = 0;
  cat.vy = 0;
  app.stage.addChild(cat, box, message);

  const left = keyboard('ArrowLeft');
  const up = keyboard('ArrowUp');
  const right = keyboard('ArrowRight');
  const down = keyboard('ArrowDown');

  left.press = () => {
    cat.vx = -5;
    cat.vy = 0;
  };
  left.release = () => {
    if (!right.isDown && cat.vy === 0) {
      cat.vx = 0;
    }
  };

  up.press = () => {
    cat.vy = -5;
    cat.vx = 0;
  };
  up.release = () => {
    if (!down.isDown && cat.vx === 0) {
      cat.vy = 0;
    }
  };

  right.press = () => {
    cat.vx = 5;
    cat.vy = 0;
  };
  right.release = () => {
    if (!left.isDown && cat.vy === 0) {
      cat.vx = 0;
    }
  };

  down.press = () => {
    cat.vy = 5;
    cat.vx = 0;
  };
  down.release = () => {
    if (!up.isDown && cat.vx === 0) {
      cat.vy = 0;
    }
  };

  state = play;

  app.ticker.add(delta => gameLoop(delta));

  function gameLoop(delta) {
    state(cat, box, delta);
  }
}

export {
  moveCatWithCollisionDetection,
  hitTestRectangle,
};