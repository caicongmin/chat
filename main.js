var app = require('http').createServer(handler),
    io = require('socket.io').listen(app),
    fs = require('fs')

    app.listen(7000);
    
    function handler (req, res) {
        fs.readFile(__dirname + '/index.html', function (err, data) {
            if (err) {
                res.writeHead(500);
                return res.end("Error Loading index.html");
            }
            res.writeHead(200, {'Conten-Type': 'text/html'});
            res.end(data);
        })
    }
