var express = require('express');
var router = express.Router();
//var db = require('../database');
var _ = require('lodash');
var gachaSimulator = require('./common/gacha-simulator');

router.get('/', function(req, res, next) {
  //var json = JSON.parse(req.body.json);

  var hitItem = gachaSimulator.gacha();

  global.io.emit('from-server', {data: hitItem});
  res.json({isSuccess: true, message: 'push successed', data: hitItem});
});

router.post('/', function(req, res, next) {
  //var json = JSON.parse(req.body.json);

  var hitItem = gachaSimulator.gacha();

  global.io.emit('from-server', {data: hitItem});
  res.json({isSuccess: true, message: 'push successed', data: hitItem});
});

module.exports = router;