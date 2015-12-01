import C from '../common/constants'
import UA from '../common/ua'

class CounterObject {
  constructor() {
    this.container = undefined;
    this.stage = undefined;
    this.hitContainer = undefined;
    this.counterContainer = undefined;
    this.loader = undefined;
    this.emitter = undefined;
    this.counterImages = undefined;
  }

  init(counterImages) {
    this.counterImages = counterImages;

    this.setupCounterObject();

    //this.hitEventSetter();
  }

  hitEventSetter() {
    this.hitContainer = this.stage.addChild(new createjs.Container());

    // パターン1
    // via http://jsfiddle.net/sebastian_derossi/5ASU2/5/
    var boundingBox = new createjs.Shape();
    boundingBox.graphics.setStrokeStyle(0).beginStroke('#000').drawRect(0, 0, C.okamisanWidth, C.okamisanHeight);
    boundingBox.alpha = 0;

    var hit = new createjs.Shape();
    hit.graphics.beginFill('#000').drawRect(0, 0, C.okamisanWidth, C.okamisanHeight);
    boundingBox.hitArea = hit;
    this.hitContainer.addChild(boundingBox);

    // パターン2
    // via http://qiita.com/calmbooks/items/fd3054d1aa7ec5164744
    //var hitAreaShape = new createjs.Shape();
    //
    //hitAreaShape.set({
    //  x        : 0,
    //  y        : 0,
    //  graphics : new createjs.Graphics().beginFill('#FFF').drawRect(0, 0, 375, 667)
    //});
    //
    //this.hitContainer.set({
    //  hitArea : hitAreaShape
    //});
    //this.hitContainer.hitArea = hit;

    boundingBox.on('mousedown', _.bind(this.draggerMousedown, this, boundingBox));
  }

  setupCounterObject() {
    this.counterContainer = this.stage.addChild(new createjs.Container());
    // dragするコンテナは0の座標にしないとdragしたときの座標がずれる
    this.counterContainer.y = 0;

    this.container.addChild(this.counterContainer);
  }

  addCounterItem(id) {
    createjs.Sound.play('drop', 'none', 0, 0, 0, 0.5, 0);

    var counterObject = _.find(this.counterImages, {id: id});

    var image = this.makeCounterObject(
      counterObject.id,
      _.random(200, C.okamisanWidth - 200), // neko分引いておく
      _.random(780, 810),
      counterObject.rotate,
      'tap',
      C.counterItemRect,
      C.counterItemRect,
      0.2
    );

    this.counterContainer.addChild(image);
  }

  makeCounterObject(id, x, y, rotate, name, width, height, scale) {
    var image = new createjs.Bitmap(this.loader.getResult(id));

    image.set({
      sourceRect : new createjs.Rectangle(0, 0, width, height)
    });

    image.name = name;
    image.regX = width / 2;
    image.regY = height / 2;
    image.x = x;
    image.y = -100;
    image.scaleX = 0.0;
    image.scaleY = 0.0;
    image.rotation = rotate;

    createjs.Tween.get(image, {loop: false})
      .wait()
      .to({
        x: x,
        y: y,
        scaleX: scale,
        scaleY: scale
      }, 300, createjs.Ease.backOut)
      .call(() => {
        setTimeout(() => {
          createjs.Tween.get(image, {loop: false})
            .wait()
            .to({
              y: -100
            }, 300, createjs.Ease.backIn)
            .call(() => {
              this.counterContainer.removeChild(image);
            });
        }, 5 * 60 * 1000);
      });

    return image;
  }

  draggerMousedown( boundingBox, evt) {
    //var image = evt.currentTarget;
  }

  destroy() {
    this.allRemoveObject(this.counterContainer);
    this.allRemoveObject(this.hitContainer);
  }

  removeObject(image, container) {
    image.removeAllEventListeners();

    // なぜか、timerを挟まないとremoveがうまく動かない
    setTimeout(() => {
      container.removeChild(image);
    }, 0);
  }

  allRemoveObject(container) {
    if (!container) {
      return;
    }

    var dl = container.children.length;
    for (let i = 0; i < dl; i++) {
      this.removeObject(container.getChildAt(i), container);
    }
  }
}

export default new CounterObject();