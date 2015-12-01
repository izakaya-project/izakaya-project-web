import CounterSetup from './counter-setup';
import CounterImages from './counter-images';
import CounterSounds from './counter-sounds';
import CounterObject from './counter-object';
import C from '../common/constants'
import Env from '../env/env'

var canvas = undefined;
var stage = undefined;
var loader = undefined;
var container = undefined;
var stats = undefined;
var emitter = undefined;

function init(selector) {
  emitter = new EventEmitter2();
  loader = CounterSetup.getLoader();
  canvas = document.getElementById(selector);

  if (Env.envName == 'local') {
    setupStats(selector);
  }

  //check to see if we are running in a browser with touch support
  stage = new createjs.Stage(canvas);
  stage.autoClear = true;
  //stage.enableDOMEvents(true);
  stage.enableMouseOver();
  // this lets our drag continue to track the mouse even when it leaves the canvas:
  // play with commenting this out to see the difference.
  stage.mouseMoveOutside = true;

  // マルチタッチは有効にする
  createjs.Touch.enable(stage);

  createjs.Ticker.setFPS(24);
  createjs.Ticker.timingMode = createjs.Ticker.RAF;
  createjs.Ticker.addEventListener('tick', tick);

  //stage.on('stagemousedown', handleMouseDown);
  //stage.on('stagemouseup', handleMouseUp);

  $(window).on('resize', resize);
  resize();

  container = stage.addChild(new createjs.Container());

  CounterObject.container = container;
  CounterObject.stage = stage;
  CounterObject.loader = loader;
  CounterObject.emitter = emitter;
  CounterObject.init(CounterImages);

  setTimeout(() => {
    emitter.emit('canvasOnLoad');
  }, 100);

  stage.update();
}

function tick() {
  // tickでは何もしない
  // サーフェイスはパフォーマンスが出ないため、なるべく限定的なタイミングで処理をすること

  stage.update();
  if (Env.envName == 'local') {
    stats.update();
  }
}

function setupStats(selector) {
  // Stats
  stats = new Stats();
  stats.setMode(0);
  stats.domElement.style.position = 'fixed';
  stats.domElement.style.zIndex = 5000;
  stats.domElement.style.left = '5px';
  stats.domElement.style.top = '5px';
  document.body.appendChild(stats.domElement);
}

function handleMouseDown(event) {
  stage.addEventListener('stagemousemove', handleMouseMove);
}

function handleMouseMove(event) {
  stage.update();
}

function handleMouseUp(event) {
  stage.removeEventListener('stagemousemove', handleMouseMove);
}

function resize() {
  // 今回はwidthとheightを固定するのでコメントアウト
  // styleではなくwidth, heightに入れないとダメ！
  //canvas.width = $(window).width();
  //canvas.height = $(window).height();

  // 今回はcanvasは固定
  //canvas.width = C.okamisanWidth;
  //canvas.height = C.okamisanHeight;
}

class Counter {
  static init(selector) {
    init(selector);
  }

  static destroy() {
    createjs.Ticker.removeEventListener('tick', tick);
    if (stage) {
      stage.removeAllEventListeners();
    }

    $(window).off('resize', resize);

    canvas = undefined;
    stage = undefined;
    loader = undefined;
    container = undefined;
    stats = undefined;
    emitter = new EventEmitter2();
  }

  static addCounterItem(id) {
    CounterObject.addCounterItem(id);
  }

  static getEmitter() {
    return emitter;
  }
}

export default Counter;