var express = require('express');
var router = express.Router();
//var db = require('../database');
var _ = require('lodash');

/* GET home page. */
router.get('/', function(req, res, next) {
  console.log('preview: ', 'ok');

  res.render('ojisan', {title: '居酒屋プロジェクト'});
});

module.exports = router;
