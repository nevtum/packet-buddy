import express from 'express';
import path from 'path';
import webpack from 'webpack';
import webpackMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';
import config from '../webpack.config';

let isProduction = process.env.NODE_ENV === 'production';
let port = isProduction ? process.env.PORT : 3000;

let app = express();

const compiler = webpack(config);

app.use(webpackMiddleware(compiler, {
    hot: true,
    noInfo: true,
    publicPath: config.output.publicPath
}));

app.use(webpackHotMiddleware(compiler));

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