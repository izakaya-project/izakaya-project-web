var _ = require('lodash');
var C = require('./constants');

var GachaSimulator = {};

var gachas = C.gachas;

GachaSimulator.gacha = function() {
  var sumRate = 0;

  var _gachas = _.cloneDeep(gachas);

  _.forEach(_gachas, function(element, index) {
    sumRate += element.gachaRate;
  });
  sumRate -= 1;

  console.log('sumRate: ', sumRate, _.random(0, sumRate));
  var hitRand = _.random(0, sumRate);
  console.log('hitRand: ', hitRand);

  var tmpRate = 0;
  var hitItem;
  _.forEach(_gachas, function(element, index) {
    tmpRate += element.gachaRate;

    if (hitRand < tmpRate) {
      hitItem = element;
      return false;
    }
  });
  console.log(hitItem);

  return hitItem;
};

module.exports = GachaSimulator;
