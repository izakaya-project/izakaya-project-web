import "babel-runtime/regenerator/runtime";

import GachaCanvas from '../pixi/gacha-background';
import Gacha from '../canvas/gacha';
import C from '../common/constants'
import Env from '../env/env';

var GachaComponent = React.createClass({
  getInitialState() {
    return {
      gachaImage: ''
    };
  },
  propTypes: {
  },
  getDefaultProps() {
    return {
    };
  },
  componentDidMount() {
    $(this.refs.gachaWrapper.getDOMNode()).hide();

    GachaCanvas.init();
  },
  gachaStart() {
    this.requestGacha((data) => {
      var star = data.data.star;
      console.log('レア度：', star, data.data.gachaName);

      this.setState({
        gachaImage: `./images/gacha/${data.data.gachaId}_l.png`
      });
      this.reset(this.refs.resultStar2.getDOMNode());
      this.reset(this.refs.resultStar3.getDOMNode());
      this.reset(this.refs.resultStar4.getDOMNode());

      setTimeout(() => {
        GachaCanvas.showEmitter();
      }, 900);

      $(this.refs.gachaWrapper.getDOMNode()).fadeIn(() => {
        this.animation(this.refs['resultStar' + star].getDOMNode());
      });
    });

    const delay = t => new Promise(resolve => setTimeout(resolve, t));
    var self = this;
    async function gachaSceneHide() {
      await delay(8000);
      GachaCanvas.hideEmitter();
      $(self.refs.gachaWrapper.getDOMNode()).fadeOut();
    }
    gachaSceneHide();
  },
  requestGacha(cb) {
    var xhr = $.ajax({
      url:Env.serverDomain + this.props.source,
      type: 'POST',
      crossDomain: true,
      data: {},
      dataType: 'json'
    });

    xhr
      .done((data) => {
        if (data.error) {
          console.log(data.error);
          return;
        }

        console.log(data);
        cb(data);

        //Gacha.init('make-gacha', data);
      })
      .fail((jqXHR, textStatus, errorThrown) => {
        console.log(jqXHR, textStatus, errorThrown);
      });
  },
  reset(element) {
    var result = $(element);
    var item = result.find('.item--li');
    $(item).velocity({
      translateY: '-1000px',
      rotateZ: 360
    }, {
      duration: 0
    }).css({
      left: 0
    });

    var star = result.find('.star--li');
    $(star).velocity({
      scale: 0,
      opacity: 0,
      rotateZ: 720
    }, {
      duration: 0
    });

    var message = result.find('.message--li');
    $(message).velocity({
      scale: 0,
      opacity: 0,
      rotateZ: 720
    }, {
      duration: 0
    });

    var g = result.find('.get--li');
    $(g).velocity({
      scale: 0,
      opacity: 0,
      rotateZ: 720
    }, {
      duration: 0
    });
  },
  animation(element) {
    var result = $(element);
    var item = result.find('.item--li');
    $(item).velocity({
      translateY: '+=1000px',
      rotateZ: 0
    }, {
      loop: false,
      duration: 1000,
      delay: 0,
      easing: 'spring',
      complete: (elements) => {
      }
    });

    var star = result.find('.star--li');
    setTimeout(() => {
      _.forEach(star, (element, index) => {
        $(element).velocity({
          scale: 1.5,
          opacity: 1,
          rotateZ: 0
        }, {
          loop: false,
          duration: 500,
          delay: 150 * index,
          easing: 'easeInExpo',
          complete: (elements) => {
            $(element).velocity({
              scale: 1
            }, {
              loop: false,
              duration: 500,
              delay: 100 * index,
              easing: 'easeInExpo',
              complete: (elements) => {
              }
            });
          }
        });
      });
    }, 1000);

    var message = result.find('.message--li');
    setTimeout(() => {
      _.forEach(message, (element, index) => {
        $(element).velocity({
          scale: 1.5,
          opacity: 1,
          rotateZ: 0
        }, {
          loop: false,
          duration: 500,
          delay: 150 * index,
          easing: 'easeInExpo',
          complete: (elements) => {
            $(element).velocity({
              scale: 1
            }, {
              loop: false,
              duration: 500,
              delay: 100 * index,
              easing: 'easeInExpo',
              complete: (elements) => {
              }
            });
          }
        });
      });
    }, 2500);

    var g = result.find('.get--li');
    setTimeout(() => {
      $(g).velocity({
        scale: 1.0,
        opacity: 1,
        rotateZ: 0
      }, {
        loop: false,
        duration: 1000,
        delay: 0,
        easing: 'swing',
        complete: (elements) => {
        }
      });
    }, 3500);
  },
  _beforeScene(e) {
    this.props.beforeScene(e);
  },
  render() {
    return (
      <div ref="gachaWrapper" className="gacha--wrapper">
        <div className="gacha--background">
          <p>
            <img src="./images/ojisan/background.png" width={C.ojisanWidth} height={C.ojisanHeight}/>
          </p>
        </div>
        <div className="gacha--canvas--wrapper">
          <canvas ref="makeGacha" id="gacha-canvas" className="gacha--canvas" width={C.ojisanWidth} height={C.ojisanHeight} />
        </div>
        <div className="gacha--object">
          <div ref="resultStar2" className="gacha--object--star2">
            <ul className="gacha--object--star2--stars">
              <li className="gacha--object--star2--stars-li star--li"><img src="./images/ojisan/star.png" width="78" height="76" /></li>
              <li className="gacha--object--star2--stars-li star--li"><img src="./images/ojisan/star.png" width="78" height="76" /></li>
            </ul>
            <ul className="gacha--object--star2--item">
              <li className="gacha--object--star2--item-li item--li"><img src={this.state.gachaImage} width="600" height="415"/></li>
            </ul>
            <ul className="gacha--object--star2--message">
              <li className="gacha--object--star2--message-li message--li"><img src="./images/ojisan/txt3.png" width="75" height="75" /></li>
              <li className="gacha--object--star2--message-li message--li"><img src="./images/ojisan/txt4.png" width="75" height="75" /></li>
            </ul>
            <ul className="gacha--object--star2--get">
              <li className="gacha--object--star2--get-li get--li"><img src="./images/ojisan/txt5.png" width="289" height="121" /></li>
            </ul>
          </div>
          <div ref="resultStar3" className="gacha--object--star3">
            <ul className="gacha--object--star3--stars">
              <li className="gacha--object--star3--stars-li star--li"><img src="./images/ojisan/star.png" width="78" height="76" /></li>
              <li className="gacha--object--star3--stars-li star--li"><img src="./images/ojisan/star.png" width="78" height="76" /></li>
              <li className="gacha--object--star3--stars-li star--li"><img src="./images/ojisan/star.png" width="78" height="76" /></li>
            </ul>
            <ul className="gacha--object--star3--item">
              <li className="gacha--object--star3--item-li item--li"><img src={this.state.gachaImage} width="600" height="415"/></li>
            </ul>
            <ul className="gacha--object--star3--message">
              <li className="gacha--object--star3--message-li message--li"><img src="./images/ojisan/txt2.png" width="75" height="75" /></li>
              <li className="gacha--object--star3--message-li message--li"><img src="./images/ojisan/txt3.png" width="75" height="75" /></li>
              <li className="gacha--object--star3--message-li message--li"><img src="./images/ojisan/txt4.png" width="75" height="75" /></li>
            </ul>
            <ul className="gacha--object--star3--get">
              <li className="gacha--object--star3--get-li get--li"><img src="./images/ojisan/txt5.png" width="289" height="121" /></li>
            </ul>
          </div>
          <div ref="resultStar4" className="gacha--object--star4">
            <ul className="gacha--object--star4--stars">
              <li className="gacha--object--star4--stars-li star--li"><img src="./images/ojisan/star.png" width="78" height="76" /></li>
              <li className="gacha--object--star4--stars-li star--li"><img src="./images/ojisan/star.png" width="78" height="76" /></li>
              <li className="gacha--object--star4--stars-li star--li"><img src="./images/ojisan/star.png" width="78" height="76" /></li>
              <li className="gacha--object--star4--stars-li star--li"><img src="./images/ojisan/star.png" width="78" height="76" /></li>
            </ul>
            <ul className="gacha--object--star4--item">
              <li className="gacha--object--star4--item-li item--li"><img src={this.state.gachaImage} width="600" height="415"/></li>
            </ul>
            <ul className="gacha--object--star4--message">
              <li className="gacha--object--star4--message-li message--li"><img src="./images/ojisan/txt1.png" width="75" height="75" /></li>
              <li className="gacha--object--star4--message-li message--li"><img src="./images/ojisan/txt2.png" width="75" height="75" /></li>
              <li className="gacha--object--star4--message-li message--li"><img src="./images/ojisan/txt3.png" width="75" height="75" /></li>
              <li className="gacha--object--star4--message-li message--li"><img src="./images/ojisan/txt4.png" width="75" height="75" /></li>
            </ul>
            <ul className="gacha--object--star4--get">
              <li className="gacha--object--star4--get-li get--li"><img src="./images/ojisan/txt5.png" width="289" height="121" /></li>
            </ul>
          </div>
        </div>
      </div>
    );
  }
});

export default GachaComponent;
