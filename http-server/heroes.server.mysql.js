// date format function for the log
Date.prototype.myFormat = function() {
  var yy = this.getFullYear();
  var mm = ("0" + (this.getMonth() + 1)).slice(-2);
  var dd = ("0" + this.getDate()).slice(-2);
  var hh = ("0" + this.getHours()).slice(-2);
  var mn = ("0" + this.getMinutes()).slice(-2);
  var ss = ("0" + this.getSeconds()).slice(-2);
  var ms = ("00" + this.getMilliseconds()).slice(-3);

  return yy + "." + mm + "." + dd + " - " + hh + ":" + mn + ":" + ss + "." + ms;
 };

var http = require('http');
var port = (process.argv[2]) ? process.argv[2] : "3002";
var mysql = require('mysql');

console.log("Starting Heroes Server - MySQL version on port " + port + "");

http.createServer(function (req, res) {
  // approve XHR-requests
  res.setHeader("Access-Control-Allow-Origin","*");
  res.setHeader("Access-Control-Allow-Headers", "Content-type");
  res.setHeader("Access-Control-Request-Method","GET POST");

  // setup the connection to the mysql-server
  var conn = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'heroes'
  });

  // set up some routes
  switch (req.url) {
    case "/hero":
      switch (req.method) {
        case "GET":
          // getting heroes
          conn.connect();
          conn.query('select * from heroes', function(err,results,fields) {
            if (err) {
              console.log(new Date().myFormat() + " [500] Request: list of heroes");
              console.log(new Date().myFormat() + ' [500] *** Error while retrieving heroes: ' + err)
              res.writeHead(500, "Server error", {'Content-Type': 'text/html'});
              res.end("<html><head><title>Server Error</title></head><body>The server borked: " + err + "</body></html>");

            } else {
              console.log(new Date().myFormat() + " [200] Request: list of heroes");
              res.writeHead(200, "OK", {'Content-Type': 'application/json'});
              res.end(JSON.stringify(results));
            }
          })
          break;

        case "OPTIONS":
          // pre-flight request (XHR)
          console.log(new Date().myFormat() + " [200] Request: XHR Options");
          res.writeHead(200, "OK", {'Content-Type': 'text/plain'});
          res.end('Allow: GET POST');
          break;

        case "POST":
          // posting a new hero
          var body;
          var sql;

          // get a chunk of the body
          req.on("data", function(chunk) {
            body += chunk;
          })

          // body finished
          req.on("end", function () {
            // parse the hero
            var hero = JSON.parse(body);

            // decide operation and construct SQL
            switch (hero.operation) {
              case "delete":
                sql = 'delete from heroes where id=' + hero.id;
                hero.deleted = true;
                break;
              case 'update':
                sql = 'update heroes set name=' + hero.name + 'where id=' + hero.id;
                break;
              case 'insert':
                sql = 'insert into heroes (name) values (' + hero.name + ')';
            }

            // query MySQL
            conn.connect();
            conn.query(sql, function(err, results) {
              if (err) {
                console.log(new Date().myFormat() + " [500] Request: POSTback of new hero");
                console.log(new Date().myFormat() + ' [500] *** Error while processing hero: ' + err)
                res.writeHead(500, "Server error", {'Content-Type': 'text/html'});
                res.end("<html><head><title>Server Error</title></head><body>The server borked: " + err + "</body></html>");
              } else {
                newHero.id = results.insertId;
                console.log(new Date().myFormat() + " [200] Request: POSTback of hero, operation : " + hero.operation);
                console.log(new Date().myFormat() + " [200] Sending back hero: " + JSON.stringify(hero));
                res.writeHead(200, "OK", {'Content-Type': 'application/json'});
                res.end(JSON.stringify(hero));
              }
            })
          });
          break;

          default:
            // other methods are not implemented
            console.log(new Date().myFormat() + " [501] Request: unknown method " + req.method);
            res.writeHead(501, "Not implemented", {'Content-Type': 'text/html'});
            res.end('<html><head><title>501 - Not implemented</title></head><body><h1>Not implemented!</h1></body></html>');
            break;
      }
      break;

    default:
      // return not found on all other routes
    console.log(new Date().myFormat() + " [404] Request: Unknown URI " + req.url);
      res.writeHead(404, "Not found", {'Content-Type': 'text/html'});
      res.end("<html><head>404 Not Found</head><body><h1>Not Found</h1>The requested url was not found.</body></html>");
  };
}).listen(port); // listen on tcp (all interfaces)
