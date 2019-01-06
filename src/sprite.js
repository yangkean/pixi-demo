/**
 * PIXI.Sprite 类用于控制图片对象的显示
 * 
 * Pixi 需要借助 WebGL 渲染图片，经过处理后与 WebGL 兼容的图片我们称为 texture
 */

import PIXI from './pixi.js';
import keyboard from './keyboard.js';

const loader = PIXI.loader;
const Sprite = PIXI.Sprite;
const TextureCache = PIXI.utils.TextureCache;
const Rectangle = PIXI.Rectangle;
const resources = loader.resources;
const Container = PIXI.Container;
const ParticleContainer = PIXI.particles.ParticleContainer;
// 继承自 Sprite
const Text = PIXI.Text;
const TextStyle = PIXI.TextStyle;

// 推荐加载方式
const loadCat = (container) => {
  console.time('loadCat');
  PIXI.loader
    // .add('src/assets/cat.png')
    .add('catImg', 'src/assets/cat.png')
    .on('progress', (loader, resource) => {
      console.log(`loading: ${resource.url}, progress: ${loader.progress}%`);
    })
    .load(() => {
      // 在加载好图片之后执行
      let cat = new PIXI.Sprite(
        // PIXI.loader.resources['src/assets/cat.png'].texture
        PIXI.loader.resources.catImg.texture
      );

      container.addChild(cat);
      console.timeEnd('loadCat');
    });
};

const loadPig = (container) => {
  const img = new Image();
  img.src = 'src/assets/pig.jpg';
  img.onload = () => {
    // 加载 JavaScript Image 对象
    const base = new PIXI.BaseTexture(img);
    const texture = new PIXI.Texture(base);
    const pig = new PIXI.Sprite(texture);

    // 设置缩放比例
    pig.scale.set(0.1);

    container.addChild(pig);
  };
};

const loadPig2 = (container) => {
  console.time('loadPig2');
  const pig = new PIXI.Sprite.fromImage('src/assets/pig.jpg');
  const cat = new PIXI.Sprite.fromImage('src/assets/cat.png');
  pig.scale.set(0.1);

  // 定位
  // pig.x = 200;
  // pig.y = 200;
  pig.position.set(177);

  pig.on('added', () => {
    pig.texture = cat.texture;
    pig.scale.set(1);

    // 设置 sprite 的大小
    // pig.width = 80;
    // pig.height = 80;

    // 设置 sprite 的旋转弧度（正值为顺时针转）
    pig.rotation = 0.5;

    // 设置旋转环绕的中心点相对整个 texture 的位置百分比，这个中心点同时也是 position 点即 (x, y)
    // (0, 0) 表示 top left 点，(0.5, 0.5) 表示 texture 的 center 点，(1, 1) 表示 bottom right 点，以此类推
    pig.anchor.set(0.5, 0.5);

    // 与 anchor 类似，不过设置的是相对 top left 点的坐标点，对于 80x80 的 sprite，(40, 40) 相当于 center 点
    // pig.pivot.set(32, 32);

    console.log('Change the texture the sprite is displaying!');
    console.timeEnd('loadPig2');
  });
  container.addChild(pig);
};

// 从精灵图中生成 sprite
const loadRocket = (container) => {
  loader
    .add('src/assets/tileset.png')
    .load(() => {
      const texture = TextureCache['src/assets/tileset.png'];
      // 创建用于提取子图片的 rectangle 对象
      const rectangle = new Rectangle(96, 64, 32, 32);
      // 将 texture 剪切为 rectangle 对象的尺寸
      texture.frame = rectangle;

      const rocket = new Sprite(texture);
      rocket.position.set(178, 60);
      container.addChild(rocket);
    });
};

// 从 texture atlas 中创建 sprite
const loadAtlas = (container) => {
  loader
    .add('src/assets/treasureHunter.json')
    .load(() => {
      const id = resources['src/assets/treasureHunter.json'].textures;
      const dungeon = new Sprite(id['dungeon.png']);
      const explorer = new Sprite(id['explorer.png']);
      const treasure = new Sprite(id['treasure.png']);

      explorer.position.set(68, dungeon.height / 2 - explorer.height / 2);
      treasure.position.set(dungeon.width - treasure.width - 48, dungeon.height / 2 - treasure.height / 2);
      container.addChild(dungeon, explorer, treasure);
    });
};

// 让 sprite 动起来
const moveCat = (app) => {
  const gameLoop = (cat, delta) => {
    cat.x += 1 + delta;
  };

  loader
    .add('src/assets/cat.png')
    .load(() => {
      const cat = new Sprite(resources['src/assets/cat.png'].texture);
      cat.position.set(0, 96);
      app.stage.addChild(cat);

      // 给 ticker 传入一个循环函数，每一秒更新 60 次
      // delta 表示 Scalar time value from last frame to this frame
      // delta is 1 if running at 100% performance
      // creates **frame-independent transformation**
      // 也可以用 requestAnimationFrame 实现一样的效果
      app.ticker.add(delta => gameLoop(cat, delta));
    });
};

// 键盘控制
const moveCatByKeyboard = (app) => {
  // 存储游戏的状态改变函数
  // 为啥这么做？教程作者说更具模块化:)
  let state;

  const cat = new Sprite.fromImage('src/assets/cat.png');
  cat.y = 96;

  // 定义这两个属性来表明横向和纵向的速度，他们并非原生属性
  // 为啥这么做？教程作者也说更具模块化:)
  cat.vx = 0;
  cat.vy = 0;
  app.stage.addChild(cat);

  // 定义键盘对象
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
    state(delta);
  }

  function play(delta) {
    cat.x += cat.vx;
    cat.y += cat.vy;
  }
};

// 成组控制
const groupSprites = (stage) => {
  const explorer = new Sprite.fromImage('src/assets/explorer.png');
  const door = new Sprite.fromImage('src/assets/door.png');
  const blob = new Sprite.fromImage('src/assets/blob.png');
  explorer.position.set(16, 16);
  door.position.set(32, 32);
  blob.position.set(64, 64);

  const treasure = new Container();
  treasure.addChild(explorer, door, blob);

  // 把 treasure 这个 container 加到所有的 sprite 的 root container 上
  stage.addChild(treasure);
  console.log(treasure.children, treasure.width, treasure.height)
  treasure.x = 100;

  // local position 是指相对父容器左上角的位置
  // global position 是指相对根容器（即 stage）左上角的位置，以下附了三种获取 global position 的方法
  console.log(`explorer local position: `, explorer.position, `explorer global position: `, treasure.toGlobal(explorer.position), door.parent.toGlobal(explorer.position), explorer.getGlobalPosition())

  // 计算 door **相对于explorer** 的 local position，在这里 explorer 就是父容器，谨记是相对父容器的
  // 在 toLocal 的源码中，如果父容器不是第二个参数，则会将第一个参数代表的 object 转换到同一个父容器中
  console.log(`the distance from door to the explorer: `, door.toLocal(door.position, explorer));
};

// 高性能成组控制 sprite
const highPerformanceGroupSprites = (stage) => {
  // 使用 ParticleContainer 将使其内部的 sprite 渲染的速度比在普通 Container 中快 2 - 5 倍
  // 但是其内部的 sprite 仅有 x、y、width、height、scale、pivot、alpha、visible 等属性，且不能嵌套孩子，对 mode 也有限制
  // 最重要的一点是，一个 ParticleContainer 只能有一个 base texture，即使你加载了多个 texture，也只会重复显示第一个样子的 texture，想显示多个图片可以用精灵图
  const superFastSprites = new ParticleContainer();
  const explorer = new Sprite.fromImage('src/assets/explorer.png');
  const door = new Sprite.fromImage('src/assets/door.png');
  const blob = new Sprite.fromImage('src/assets/blob.png');
  superFastSprites.addChild(explorer, door, blob);
  stage.addChild(superFastSprites);
};

const drawText = (container) => {
  // TextStyle 限定的样式属性有限
  const style = new TextStyle({
    fontFamily: 'Arial',
    fontSize: 36,
    fill: 'white',
    stroke: '#ff3300',
    strokeThickness: 4,
    dropShadow: true,
    dropShadowColor: "#000000",
    dropShadowBlur: 4,
    dropShadowAngle: Math.PI / 6,
    dropShadowDistance: 6,
  });
  const message = new Text('Hello Pixi!', style);
  message.position.set(250, 250);
  message.text = "Text changed!";
  message.style = {
    fill: "black",
    fontFamily: "PetMe64",
    fontSize: 16,
  };

  container.addChild(message);
};


export {
  loadCat,
  loadPig,
  loadPig2,
  loadRocket,
  loadAtlas,
  moveCat,
  moveCatByKeyboard,
  groupSprites,
  highPerformanceGroupSprites,
  drawText,
};