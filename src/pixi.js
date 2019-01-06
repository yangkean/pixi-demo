import '/node_modules/pixi.js/dist/pixi.min.js';

// pixi 内部的导出是遵循 node 风格的，要转换为浏览器风格的导出以适用浏览器风格的导入
const PIXI = window.PIXI;

export default PIXI;
