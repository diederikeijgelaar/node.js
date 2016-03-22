// mock heroesDB
var heroesDB = [
  { "id": 11, "name": "Mr. Nice" },
  { "id": 12, "name": "Narco" },
  { "id": 13, "name": "Bombasto" },
  { "id": 14, "name": "Celeritas" },
  { "id": 15, "name": "Magneta" },
  { "id": 16, "name": "RubberMan" },
  { "id": 17, "name": "Dynama" },
  { "id": 18, "name": "Dr IQ" },
  { "id": 19, "name": "Magma" },
  { "id": 20, "name": "Tornado" },
  { "id": 21, "name": "Destructo"}
];

var id = 21;

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

console.log("Starting Heroes Server - NoSQL version on port " + port + "");

http.createServer(function (req, res) {
  // approve XHR-requests
  res.setHeader("Access-Control-Allow-Origin","*");
  res.setHeader("Access-Control-Allow-Headers", "Content-type");
  res.setHeader("Access-Control-Request-Method","GET POST");

  // set up some routes
  switch (req.url) {
    case "/hero":
      switch (req.method) {
        case "GET":
          // getting heroes
          console.log(new Date().myFormat() + " [200] Request: list of heroes");
          res.writeHead(200, "OK", {'Content-Type': 'application/json'});
          res.end(JSON.stringify(heroesDB));
          break;

        case "OPTIONS":
          // pre-flight request (XHR)
          console.log(new Date().myFormat() + " [200] Request: XHR Options");
          res.writeHead(200, "OK", {'Content-Type': 'text/plain'});
          res.end('Allow: GET POST');
          break;

        case "POST":
          // posting a new hero
          var body = '';
          var result = {};

          // get a chunk of the body
          req.on("data", function(chunk) {
            body += chunk;
          })

          // body finished
          req.on("end", function () {
            // parse the hero
            var hero = JSON.parse(body);

            // select operation
            switch(hero.operation) {
              case 'delete':
                // search id from HeroesDB
                var aid = heroesDB.filter(function (val) {
                  return val.id === hero.id;
                });

                // remove from HeroesDB, if found
                if (aid[0].id) {
                  heroesDB.splice(aid[0].id, 1);
                  result = "deleted";
                }
                break;

              case 'update':
                // search id from HeroesDB
                var aid = heroesDB.filter(function (val) {
                  return val.id === hero.id;
                });

                // update hero, if found
                if (aid[0].id) {
                  heroesDB[aid[0]] = hero;
                  result = "updated";
                }
                break;

              case 'insert':
                // insert hero into heroesDB
                hero.id = id++;
                heroesDB.push(hero);
                result = {"inserted": hero};
            }

            // give feedback
            console.log(new Date().myFormat() +
              " [200] Request: POSTback of hero details, result: " + hero.operation);
            console.log(new Date().myFormat() +
              " [200] Sending back result: " + JSON.stringify(result));
            res.writeHead(200, "OK", {'Content-Type': 'application/json'});
            res.end(JSON.stringify(result));
          });
          break;

          default:
            // other methods are not implemented
            console.log(new Date().myFormat() +
              " [501] Request: unknown method " + req.method);
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
