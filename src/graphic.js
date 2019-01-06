/**
 * PIXI.Graphics 类用于绘制诸如线段、圆、长方形等原始图形，其 API 与 canvas drawing API 基本一致
 * 
 * **需要格外注意的是，Graphics 的 drawXX 方法的前面两个参数一般是 (x, y)，**
 * **这个坐标对 graphics object 来说会在绘制图形时起作用，但是并不会改变 graphics**
 * **object 的 x 和 y 属性，google 了很久暂时不知道为何这样设计，fuck**
 * 
 * **另外，所有涉及到颜色值时，必须写完整写法，即使是含有重复值的颜色值**
 */

import PIXI from './pixi.js';

const Graphics = PIXI.Graphics;
const Point = PIXI.Point;

const drawShaps = (container) => {
  const retangle = new Graphics;
  retangle.beginFill(0xffccff);
  retangle.lineStyle(4, 0xff3300, 1, 1);
  retangle.drawRect(0, 0, 100, 50);
  retangle.endFill();

  const circle = new Graphics();
  circle.beginFill(0x9966ff);
  // (x, y, radius)，(x, y) 是圆心坐标
  circle.drawCircle(150, 150, 50);
  circle.endFill();

  const ellipse = new Graphics();
  ellipse.beginFill(0xffff00);
  // (x, y, width, height)，(x, y) 是椭圆的中心坐标
  ellipse.drawEllipse(300, 50, 100, 50);
  ellipse.endFill();

  // 带圆角的矩形
  const roundBox = new Graphics();
  roundBox.lineStyle(4, 0x99ccff, 1, 0);
  roundBox.beginFill(0xff9933);
  // (x, y, width, height, cornerRadius)，cornerRadius 表示圆角的像素数
  roundBox.drawRoundedRect(0, 300, 100, 50, 10);
  roundBox.endFill();

  const line = new Graphics();
  line.lineStyle(4, 0xffffff, 1);
  line.moveTo(0, 0);
  line.lineTo(80, 80);
  line.position.set(50, 50);

  // polygon
  const triangle = new Graphics();
  const path = [
    new Point(0, 0),
    new Point(150, 120),
    new Point(120, 150),
  ];
  triangle.beginFill(0x66ff33);
  triangle.drawPolygon(path);
  triangle.endFill();
  triangle.position.set(500, 0);

  container.addChild(
    retangle,
    circle,
    ellipse,
    roundBox,
    line,
    triangle,
  );
};

export {
  drawShaps,
};