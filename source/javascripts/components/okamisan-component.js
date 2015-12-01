import CounterSetup from '../canvas/counter-setup';
import Counter from '../canvas/counter';
import Env from '../env/env.js';
import C from '../common/constants';

// キャッシュをさせない（IEでは必須）
$.ajaxSetup({
  cache: false
});

// react
var OkamisanComponent = React.createClass({
  propTypes: {
  },
  getDefaultProps() {
    return {
      canvasId : 'counter-canvas'
    };
  },
  getInitialState() {
    return {
      results: []
    };
  },
  componentDidMount() {
  },
  reset(element) {
    $(element).velocity({
      translateY: '-1000px',
      rotateY: 360,
      opacity: 1
    }, {
      duration: 0
    });
  },
  okamisanAnimation(element) {
    $(element).velocity({
      translateY: '+=1000px',
      rotateY: 0
    }, {
      loop: false,
      duration: 1000,
      delay: 0,
      easing: 'easeInExpo',
      complete: (elements) => {
      }
    });
  },
  addCounterItem(data) {
    var rotateY = data.data.star * 360;
    var okamisan = $(this.refs.okamisan.getDOMNode());

    if (!okamisan.hasClass('velocity-animating')) {
      okamisan.velocity({
        rotateY: '+=' + rotateY + 'deg'
      }, {
        loop: false,
        duration: 700,
        delay: 0,
        easing: 'swing',
        complete: (elements) => {
        }
      });
    }

    Counter.addCounterItem(data.data.gachaId);
  },
  animationStart() {
    $.when(
      CounterSetup.preload(() => {})
    ).then(() => {
        createjs.Sound.play('bgm', 'none', 0, 0, -1, 0.5, 0);

        var okamisan = $(this.refs.okamisan.getDOMNode());
        this.reset(okamisan);
        this.okamisanAnimation(okamisan);

        Counter.init(this.props.canvasId);
      }, () =>{
        return;
      });
  },
  animationStop() {
  },
  render() {
    return (
      <div className="okamisan--wrapper">
        <header className="okamisan--header">
          <p className="okamisan--header--title"><img src="./images/okamisan/logo.png" wdith="286" height="224" alt=""/></p>
          <p className="okamisan--header--gacha-link"><a href="./ojisan" target="_blank"><img src="./images/okamisan/btn_menu.png" alt=""/></a></p>
        </header>
        <div className="okamisan--background">
          <p>
            <img src="./images/okamisan/background.png" width={C.okamisanWidth} height={C.okamisanHeight}/>
          </p>
        </div>
        <div className="okamisan--okamisan">
          <p ref="okamisan" className="okamisan--okamisan--character">
            <img src="./images/okamisan/okamisan.gif" width="264" height="644"/>
          </p>
        </div>
        <div className="okamisan--counter">
          <p>
            <img src="./images/okamisan/counter.png" width={C.okamisanWidth} height={C.okamisanHeight}/>
          </p>
        </div>
        <div className="okamisan--items">
          <canvas id={this.props.canvasId} width={C.okamisanWidth} height={C.okamisanHeight}></canvas>
        </div>
        <div className="okamisan--neco">
          <p className="okamisan--neco--shadow">
            <img src="./images/okamisan/neko_kage.png"/>
          </p>
          <p className="okamisan--neco--neco">
            <img src="./images/okamisan/neko.gif"/>
          </p>
        </div>
        <footer className="okamisan--footer">
          <p className="okamisan--footer--sns">
            <a href="https://twitter.com/share" className="twitter-share-button" data-via="hisasann">Tweet</a>
          </p>
        </footer>
      </div>
    );
  }
});

export default OkamisanComponent;
