'use strict';
var express = require('express');
var uuid = require('uuid');

var router = express.Router();


router.get('/', function(req, res) {
	res.render('index', {
		url: 'ws://127.0.0.1:8080',
		server: 'c569b750-1350-11e6-b828-09b27c2e7440'
	});
});
router.get('/connect/:id', function(req, res) {
	var id = req.params.id;
	res.render('index', {
		url: 'ws://127.0.0.1:8080',
		server: id
	});
});
module.exports = router;