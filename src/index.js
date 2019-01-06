import PIXI from './pixi.js';
import {
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
} from './sprite.js';
import {
  drawShaps,
} from './graphic.js';
import {
  moveCatWithCollisionDetection,
} from './collision-detection.js';
import {
  runTreasureHunter,
} from './treasure-hunter.js';

// PIXI.Application 类会自动生成一个 <canvas> 元素并将要显示的内容显示在 canvas 区域中
const app = new PIXI.Application({
  width: 256,
  height: 256,
  // 让 canvas 的背景呈透明状态，这样就可以看到 body 元素的 background 了
  transparent: true,
  // 平滑化 graphics 的边缘，只在某些平台中有效，如 Chrome
  antialias: true,
  // backgroundColor: 0x1099bb,
});

// 确保 canvas 元素能调整大小到适应分辨率
app.renderer.autoResize = true;
// 通过渲染器的方法调整 canvas 元素大小至整个窗口
app.renderer.resize(window.innerWidth, window.innerHeight);

// `app.stage` 是一个根容器 (root container)，所有需要显示的东西都要加到这个容器里面
// 与普通 container 不同的是，stage 的 width 和 height 不是容器的宽高，而是物体占据区域的宽高
app.stage.onChildrenChange = () => {
  console.log(app.stage.width, app.stage.height);
};

// 加载 Sprite
// loadCat(app.stage);
// loadPig2(app.stage);
// loadRocket(app.stage);
// loadAtlas(app.stage);
// moveCat(app);
// moveCatByKeyboard(app);
// groupSprites(app.stage);
// highPerformanceGroupSprites(app.stage);

// 绘制 graphics
// drawShaps(app.stage);

// 绘制文字
// drawText(app.stage);

// 碰撞检测
// moveCatWithCollisionDetection(app);

runTreasureHunter();

// 把 <canvas> 元素添加到 HTML 中
document.body.appendChild(app.view);