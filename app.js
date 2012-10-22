var express = require('express');
var app = express();

var express_config = require('./lib/express_config');
express_config(app, express);

var routes  = require('./lib/routes');
routes(app);
 
app.listen(3000);
console.log('Server running at localhost:3000');




