var express = require('express');
var path = require('path');

let isProduction = process.env.NODE_ENV === 'production';
let port = isProduction ? process.env.PORT : 3000;

let app = express();

let publicPath = path.resolve(__dirname, './public');
app.use(express.static(publicPath));

app.listen(port, function(err) {
    if (err) {
        console.log(err);
    }
    else {
        console.log("listening on port " + port);
    }
});