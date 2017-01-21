express = require('express');
path = require('path');

app = express();

var isProduction = process.env.NODE_ENV === 'production';
var port = isProduction ? process.env.PORT : 3000;
var publicPath = path.resolve(__dirname, 'build');

app.use(express.static(publicPath));

app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname, './index.html'))
});

app.post('/api/parse', function(req, res) {

});

app.listen(port, function(err) {
    if (err) {
        console.log(err);
    }
    else {
        console.log("listening on port " + port);
    }
});