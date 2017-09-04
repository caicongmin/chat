var app = require('http').createServer(handler),
    io = require('socket.io').listen(app),
    url = require('url'),
    path = require('path'),
    fs = require('fs')

    app.listen(7000, "127.0.0.1");
    
    function handler (req, res) {
        // fs.readFile(__dirname + '/index.html', function (err, data) {
        //     if (err) {
        //         res.writeHead(500);
        //         return res.end("Error Loading index.html");
        //     }
        //     res.writeHead(200, {'Conten-Type': 'text/html'});
        //     res.end(data);
        // })
        var pathname = url.parse(req.url).pathname;
        console.log("请求的url =>", pathname);
        fs.readFile(pathname.substr(1), function(err ,data) {
            if (err) {
                console.log(err);
                res.writeHead(404, {'Content-Type': 'text/html'});
            } else {
                switch(path.extname(pathname)){
                    case ".html":
                        res.writeHead(200, {"Content-Type": "text/html"});
                        break;
                    case ".js":
                        res.writeHead(200, {"Content-Type": "text/javascript"});
                        break;
                    case ".css":
                        res.writeHead(200, {"Content-Type": "text/css"});
                        break;
                    case ".gif":
                        res.writeHead(200, {"Content-Type": "image/gif"});
                        break;
                    case ".jpg":
                        res.writeHead(200, {"Content-Type": "image/jpeg"});
                        break;
                    case ".png":
                        res.writeHead(200, {"Content-Type": "image/png"});
                        break;
                    default:
                        res.writeHead(200, {"Content-Type": "application/octet-stream"});
                }
                res.write(data.toString());
            }
            res.end();
        })
        // var pathname=__dirname+url.parse(req.url).pathname;
        // if (path.extname(pathname)=="") {
        //     pathname+="/";
        // }
        // if (pathname.charAt(pathname.length-1)=="/"){
        //     pathname+="index.html";
        // }
        // path.exists(pathname,function(exists){
        //     if(exists){
        //         switch(path.extname(pathname)){
        //             case ".html":
        //                 res.writeHead(200, {"Content-Type": "text/html"});
        //                 break;
        //             case ".js":
        //                 res.writeHead(200, {"Content-Type": "text/javascript"});
        //                 break;
        //             case ".css":
        //                 res.writeHead(200, {"Content-Type": "text/css"});
        //                 break;
        //             case ".gif":
        //                 res.writeHead(200, {"Content-Type": "image/gif"});
        //                 break;
        //             case ".jpg":
        //                 res.writeHead(200, {"Content-Type": "image/jpeg"});
        //                 break;
        //             case ".png":
        //                 res.writeHead(200, {"Content-Type": "image/png"});
        //                 break;
        //             default:
        //                 res.writeHead(200, {"Content-Type": "application/octet-stream"});
        //         }
        //         fs.readFile(pathname,function (err,data){
        //             res.end(data);
        //         });
        //     } else {
        //         res.writeHead(404, {"Content-Type": "text/html"});
        //         res.end("<h1>404 Not Found</h1>");
        //     }
        // });
    }
