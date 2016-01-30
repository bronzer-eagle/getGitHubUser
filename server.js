var child_process = require('child_process');
var express = require('express');
var http = require('http');
var static = require('node-static');
var async = require('async');
var file = new static.Server('.');

var repository;

child_process.exec('start http://localhost:8080', function (err, stdout, stderr) {});

http.createServer(function (req, res) {
    if (req.method == 'POST') {
        var body;
        req.on('data', function (data) {
            body = JSON.parse(data);
            for (var i = 0; i < body.length; i++) {
                body[i] = body[i].value;
            }
            body.length = body.length - 1;            
            async.mapSeries(body,
                function (address, callback) {                          
                    child_process.exec('git clone ' + address,
                        function (err, stdout, stderr) {
                            repository = address.slice(address.lastIndexOf('/') + 1, address.length);
                            child_process.exec('git log --pretty=format:"%ae ||| [%an] |||"',
                                {cwd: repository},
                                function (err, stdout, stderr) {                                    
                                    child_process.exec('rd ' + repository + ' /s /q', function (err, stdout, stderr) {});
                                    callback(null, stdout);
                                }
                            )
                        })
                }
                ,
                function (err, results) {
                    if (err) {
                        console.log('A file failed to process');
                    }
                    else {
                        console.log('Send data to client');
                        res.end(JSON.stringify(results));
                    }
                }
            );
        });
        res.writeHead(200, {'Content-Type': 'application/json'});
    }
    else {
        file.serve(req, res);
    }
}).listen(8080);

console.log('Server running on port 8080');
