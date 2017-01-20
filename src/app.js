express = require('express');
path = require('path');

app = express();

app.use(express.static('public'));

app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname, './index.html'))
});

app.post('/api/parse', function(req, res) {

});

var portNr = 5000;
app.listen(portNr, function(err) {
    if (err) {
        console.log(err);
    }
    else {
        console.log("listening on port " + portNr);
    }
});