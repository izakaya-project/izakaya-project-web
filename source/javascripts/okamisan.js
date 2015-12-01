import OkamisanComponent from './components/okamisan-component';
import LoadingComponent from './components/loading-component';

console.log('ojisan');

var Okamisan = React.createClass({
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
    this.refs.okamisan.animationStart();
  },
  emitFromServer(data) {
    this.refs.okamisan.addCounterItem(data);
  },
  render() {
    return (
      <div>
        <OkamisanComponent ref="okamisan"
        />
        <LoadingComponent ref="loading"
          nextScene={this.init}
        />
      </div>
    );
  }
});

var component = React.render(
  <Okamisan />,
  document.getElementById('contents')
);

function init() {
  //component.init();
}

init();

console.log('okamisan');

// websocket
var socket = io();

socket.on('connect', function (data) {
  console.log('connect: client');
});

socket.on('disconnect', function(data) {
  location.reload();
});

socket.on('hi', function(msg){
  console.log('hi: ', msg);
});

socket.on('from-server', function(msg){
  console.log('from-server: ', msg);
  socket.emit('from-client', 'success get data');

  notifyMe(`レア度${msg.data.star}の${msg.data.gachaName}を引きました`, {
    tag: 'izakaya-project',
    body: '居酒屋プロジェクト',
    icon: './images/icon.png'
  });

  component.emitFromServer(msg);
});

if (navigator.userAgent.toLowerCase().indexOf('chrome') > -1) {
  var args = [
    '\n %c %c %c izakaya-project ' + '1.0.0' + ' - ✰ ' + 'from hisasann' + ' ✰  %c ' + ' %c ' + ' https://izakaya-project.herokuapp.com/  %c %c ♥%c♥%c♥ \n\n',
    'background: #ff66a5; padding:5px 0;',
    'background: #ff66a5; padding:5px 0;',
    'color: #ff66a5; background: #030307; padding:5px 0;',
    'background: #ff66a5; padding:5px 0;',
    'background: #ffc3dc; padding:5px 0;',
    'background: #ff66a5; padding:5px 0;',
    'color: #ff2424; background: #fff; padding:5px 0;',
    'color: #ff2424; background: #fff; padding:5px 0;',
    'color: #ff2424; background: #fff; padding:5px 0;'
  ];

  window.console.log.apply(console, args);
}

function notifyMe(message, props) {
  var notification = undefined;

  // Let's check if the browser supports notifications
  if (!("Notification" in window)) {
    console.log("This browser does not support desktop notification");
  }

  // Let's check whether notification permissions have alredy been granted
  else if (Notification.permission === "granted") {
    // If it's okay let's create a notification
    notification = new Notification(message, props);
  }

  // Otherwise, we need to ask the user for permission
  else if (Notification.permission !== 'denied') {
    Notification.requestPermission(function (permission) {
      // If the user accepts, let's create a notification
      if (permission === "granted") {
        notification = new Notification(message, props);
      }
    });
  }

  // notification close
  setTimeout(() => {
    // https://developer.mozilla.org/ja/docs/Web/API/notification
    notification.close();
  }, 2000);
}
