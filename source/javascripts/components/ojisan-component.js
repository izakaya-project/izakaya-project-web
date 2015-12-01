import GachaSetup from '../canvas/gacha-setup';
import OjisanCanvas from '../pixi/ojisan-background';
import Env from '../env/env.js'
import C from '../common/constants';

// キャッシュをさせない（IEでは必須）
$.ajaxSetup({
  cache: false
});

// react
var OjisanComponent = React.createClass({
  propTypes: {
    source: React.PropTypes.string.isRequired
  },
  getDefaultProps() {
    return {
      source: ''
    };
  },
  getInitialState() {
    return {
      results: []
    };
  },
  componentDidMount() {
  },
  _startGacha(e) {
    createjs.Sound.play('drop', 'none', 0, 0, 0, 0.8, 0);

    this.props.nextScene(e);
  },
  reset(element) {
    $(element).velocity({
      translateY: '-1000px',
      opacity: 1
    }, {
      duration: 0
    });
  },
  ojisanAnimation(element) {
    $(element).velocity({
      translateY: '+=1000px'
    }, {
      loop: false,
      duration: 1000,
      delay: 0,
      easing: 'easeInExpo',
      complete: (elements) => {
        var ui = $(this.refs.ui.getDOMNode());
        $(ui).fadeIn(1000);
      }
    });
  },
  animationStart() {
    $.when(
      GachaSetup.preload(() => {})
    ).then(() => {
        var ojisan = $(this.refs.ojisan.getDOMNode());
        this.reset(ojisan);
        this.ojisanAnimation(ojisan);

        OjisanCanvas.init();
      }, () =>{
        return;
      });
  },
  animationStop() {
  },
  render() {
    return (
      <div className="ojisan--wrapper">
        <div className="ojisan--background">
          <p>
            <img src="./images/ojisan/background.png" width={C.ojisanWidth} height={C.ojisanHeight}/>
          </p>
        </div>
        <div className="ojisan--canvas">
          <p>
            <canvas id="ojisan-canvas" width={C.ojisanWidth} height={C.ojisanHeight}></canvas>
          </p>
        </div>
        <div className="ojisan--ojisan">
          <p ref="ojisan" className="ojisan--ojisan--character">
            <img src="./images/ojisan/ojisan.png" width="243" height="226"/>
          </p>
        </div>
        <div className="ojisan--counter">
          <p>
            <img src="./images/ojisan/counter.png" width={C.ojisanWidth} height={C.ojisanHeight}/>
          </p>
        </div>
        <div className="ojisan--message">
          <p className="ojisan--message--title">
            <img src="./images/ojisan/logo.png" width="240" height="165"/>
          </p>
        </div>
        <div className="ojisan--ui">
          <ul ref="ui" className="ojisan--ui--button">
            <li className="ojisan--ui--button--li"><p className="ojisan--ui--button__koban"></p></li>
            <li className="ojisan--ui--button--li"><button className="ojisan--ui--button__gacha" onClick={this._startGacha}></button></li>
          </ul>
        </div>
      </div>
    );
  }
});

export default OjisanComponent;
