express = require('express');
path = require('path');

var isProduction = process.env.NODE_ENV === 'production';
var port = isProduction ? process.env.PORT : 3000;

app = express();

var publicPath = path.resolve(__dirname, './public');
app.use(express.static(publicPath));

app.listen(port, function(err) {
    if (err) {
        console.log(err);
    }
    else {
        console.log("listening on port " + port);
    }
});