import "babel-runtime/regenerator/runtime";

import Env from '../env/env.js';
import C from '../common/constants';

// react
var LoadingComponent = React.createClass({
  propTypes: {
  },
  getDefaultProps() {
    return {
    };
  },
  getInitialState() {
    return {
    };
  },
  componentDidMount() {
    this.animationStart();
  },
  animationStart() {
    var loading = $(this.refs.logo.getDOMNode());
    var wrapper = $(this.refs.wrapper.getDOMNode());

    $(loading).velocity({
      opacity: 1
    }, {
      loop: false,
      duration: 3000,
      delay: 0,
      easing: 'easeInOutCubic',
      complete: (elements) => {
        $(loading).velocity({
          opacity: 0
        }, {
          loop: false,
          duration: 3000,
          delay: 0,
          easing: 'easeInOutCubic',
          complete: (elements) => {
          }
        });

        $(wrapper).velocity({
          opacity: 0
        }, {
          loop: false,
          duration: 3000,
          delay: 0,
          easing: 'easeInOutCubic',
          complete: (elements) => {
            $(wrapper).hide();
          }
        });
      }
    });

    const delay = t => new Promise(resolve => setTimeout(resolve, t));
    var self = this;
    async function nextScene() {
      console.log('start');
      await delay(6000);
      self.props.nextScene();
      console.log('end');
    }
    nextScene();
  },
  animationStop() {
  },
  render() {
    return (
      <div ref="wrapper" className="loading--wrapper">
        <div ref="logo" className="loading--logo">
          <img src="./images/ojisan/logo_splash.png" width="240" height="165" />
        </div>
      </div>
    );
  }
});

export default LoadingComponent;
