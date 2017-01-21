express = require('express');
path = require('path');

var isProduction = process.env.NODE_ENV === 'production';
var port = isProduction ? process.env.PORT : 3000;
var publicPath = path.resolve(__dirname, '../build');

app = express();

app.use('/public', express.static(publicPath));

app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname, './index.html'));
});

app.listen(port, function(err) {
    if (err) {
        console.log(err);
    }
    else {
        console.log("listening on port " + port);
    }
});