'use strict';
var express = require('express');
var _ = require('underscore');

var router = express.Router();


router.get('/', function(req, res) {
	var server_list = _.pluck(process.rooms.server, 'id');
	console.log(process.rooms.server);
	res.render('home', {
		server_list: server_list
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