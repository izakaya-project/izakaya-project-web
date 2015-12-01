import OjisanComponent from './components/ojisan-component';
import GachaComponent from './components/gacha-component';
import LoadingComponent from './components/loading-component';

console.log('ojisan');

var Ojisan = React.createClass({
  getInitialState() {
    return {
    };
  },
  propTypes: {
  },
  getDefaultProps() {
    return {
    };
  },
  componentDidMount() {
  },
  init() {
    this.refs.ojisan.animationStart();
  },
  nextScene() {
    this.refs.gacha.gachaStart();
  },
  beforeScene(e) {
    e.preventDefault();
  },
  render() {
    return (
      <div>
        <OjisanComponent ref="ojisan"
          nextScene={this.nextScene}
        />
        <GachaComponent ref="gacha"
          beforeScene={this.beforeScene}
          source="/gacha"
        />
        <LoadingComponent ref="loading"
          nextScene={this.init}
        />
      </div>
    );
  }
});

var component = React.render(
  <Ojisan />,
  document.getElementById('contents')
);

function init() {
  //component.init();

  // 画面の要素を選択できないようにする
  $('body').on('selectstart', function(e) {
    e.preventDefault();
  });
}

init();
