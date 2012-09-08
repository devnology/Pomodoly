/*jslint node:true */
	
var http = require('http')
	, fs = require('fs')
	, mime = require('mime');

http.createServer(function (req, res) {
		var url = "." + (req.url === "/" ? "/index.html" : req.url.split('?')[0]);
		fs.readFile(url, function (err, data) {
			if (err) {
				res.writeHead(500);
				return res.end(err.message + "\n" + err.stack);
			}
			res.writeHead(200, { 'Content-Type': mime.lookup(url) });
			res.end(data);
		});
	}).listen(2020);
