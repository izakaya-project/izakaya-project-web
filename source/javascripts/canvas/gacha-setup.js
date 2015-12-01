import GachaImages from './gacha-images';
import GachaSounds from './gacha-sounds';
import C from '../common/constants'
import Env from '../env/env'
import UA from '../common/ua'

class GachaSetup {
  constructor() {
    this.loader = undefined;
    this.loadManifest = undefined;
  }

  static getLoader() {
    return this.loader;
  }

  static preload(cb=function(){}) {
    let dfd = $.Deferred();


    // 引数にfalseを指定するとXHRを使わずtagによる読み込みを行います
    // Android4.2以下のBrowserだと、trueでは動かないのでfalseにしておく
    this.loader = new createjs.LoadQueue(false);
    this.loadManifest = _.union(GachaImages, GachaSounds);

    // Android4.2以下のBrowserだと、mp3再生ができないためデフォルトはoggを使うようにして、
    // oggが再生できない場合はmp3を使うようにしておく
    // via http://createjs.com/docs/soundjs/classes/Sound.html
    // Android Browserの場合、WebAudioPluginに対応していないと音が出ないので、
    // createjs.Sound.registerPluginsに渡す時点で分岐しておく
    // これをしないと、以下のようにAndroid Browserで音が出ない
    //iPhone5 7.1.2
    //  Safari ◯
    //iPhone6 8.3
    //  Safari ◯
    //
    //GALAXY S 4.4.2
    //  Browser ◯
    //  Chrome ◯
    //ARROWS NX 4.2.2
    //  Browser ◯
    //  Chrome ◯
    //htc 4.4.2
    //  Browser ☓
    //  Chrome ◯
    //XPERIA
    //  Browser ☓
    //  Chrome ◯
    if (UA.isIPhone() || UA.isIPad()) {
      createjs.Sound.registerPlugins([createjs.WebAudioPlugin, createjs.HTMLAudioPlugin]);
    } else {
      createjs.Sound.registerPlugins([createjs.HTMLAudioPlugin]);
    }
    createjs.Sound.alternateExtensions = ['mp3'];
    this.loader.installPlugin(createjs.Sound);

    // http1.1の仕様だと、
    // Safari mobile	6
    // Android browser	4
    // Chrome mobile	6
    // Firefox mobile	4
    // しか同時にリクエストできないため、6にしておく
    // via http://www.mobify.com/blog/domain-sharding-bad-news-mobile-performance/
    this.loader.setMaxConnections(6);

    // それぞれがロードされたタイミング
    this.loader.addEventListener('fileload', function(event) {
      //console.log('fileload: ', event);
    });

    // すべてのロードが終わったタイミング
    this.loader.addEventListener('complete', function(event) {
      console.log('fileload complete', event);

      dfd.resolve();

      cb();
    });

    this.loader.loadManifest(this.loadManifest);
    return dfd.promise();
  }
}

export default GachaSetup;
