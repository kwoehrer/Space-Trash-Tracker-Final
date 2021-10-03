window.CESIUM_BASE_URL = '../node_modules/cesium/CesiumUnminified';
  require('../node_modules/cesium/CesiumUnminified/Cesium.js');
  require('../node_modules/cesium/Cesium/Widgets/widgets.css');
  var Cesium = window.Cesium;

  var viewer = new Cesium.Viewer('cesiumContainer');

  var HtmlPlugin = require('html-webpack-plugin');
    
module.exports = {
    entry: "./app.js",
    output: {
        path: __dirname + '/public',
        filename: "bundle.js"
    },
    plugins: [
        new HtmlPlugin({
            template: 'index.html',
            inject : true
        })
    ],
    devServer: {
        contentBase: './public',
    },
    module: {
        loaders: [
            { test: /\.css$/, loader: "style!css" },
            {
                test: /\.(png|gif|jpg|jpeg)$/,
                loader: 'file-loader'
            },
            { test: /Cesium\.js$/, loader: 'script' }
        ]
    }
};