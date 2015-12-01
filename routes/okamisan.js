var express = require('express');
var router = express.Router();
//var db = require('../database');
var _ = require('lodash');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('okamisan', {title: '居酒屋プロジェクト'});
  console.log(2);
});

module.exports = router;
