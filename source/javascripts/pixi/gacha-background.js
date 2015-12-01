import C from '../common/constants';

class O {
  static init() {
    /* the window.onload is ABSOLUTELY essential, otherwise opening and closing Iframes does not work;*/
    var myView = document.getElementById('gacha-canvas');
    var renderer = PIXI.autoDetectRenderer(375, 667, {view: myView, transparent: true});
    //document.body.appendChild(renderer.view);

    // create the root of the scene graph
    var stage = new PIXI.Container();

    // create a new background sprite
    //var background = new PIXI.Sprite.fromImage('./images/ojisan/BGrotate2.jpg');
    //stage.addChild(background);

    var emitterContainer = new PIXI.ParticleContainer();
    emitterContainer.setProperties({
      scale: true,
      position: true,
      rotation: true,
      uvs: true,
      alpha: true
    });
    stage.addChild(emitterContainer);

    this.emitter = new cloudkid.Emitter(
      emitterContainer,
      [PIXI.Texture.fromImage('./images/gacha/particle.png')],
      {
        "alpha": {
          "start": 1,
          "end": 0
        },
        "scale": {
          "start": 0.5,
          "end": 1.0,
          "minimumScaleMultiplier": 1
        },
        "color": {
          "start": "#e4f9ff",
          "end": "#3fcbff"
        },
        "speed": {
          "start": 500,
          "end": 800
        },
        "acceleration": {
          "x": 0,
          "y": 50
        },
        "startRotation": {
          "min": 0,
          "max": 360
        },
        "rotationSpeed": {
          "min": 0,
          "max": 0
        },
        "lifetime": {
          "min": 0.2,
          "max": 1.0
        },
        "blendMode": "normal",
        "frequency": 0.005,
        "emitterLifetime": -1,
        "maxParticles": 400,
        "pos": {
          "x": C.ojisanWidth / 2,
          "y": C.ojisanHeight / 2
        },
        "addAtBack": false,
        "spawnType": "circle",
        "spawnCircle": {
          "x": 0,
          "y": 0,
          "r": 0
        }
      }
    );

    // Calculate the current time
    var elapsed = Date.now();

    // Update function every frame
    var update = () => {

      // Update the next frame
      requestAnimationFrame(update);

      var now = Date.now();

      // The emitter requires the elapsed
      // number of seconds since the last update
      this.emitter.update((now - elapsed) * 0.001);
      elapsed = now;

      // Should re-render the PIXI Stage
      renderer.render(stage);
    };

    this.emitter.emit = false;

    // Start the update
    update();
  }

  static showEmitter() {
    this.emitter.emit = true;
  }

  static hideEmitter() {
    this.emitter.emit = false;
  }
}

export default O;

