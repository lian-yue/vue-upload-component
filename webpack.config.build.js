var webpack = require('webpack');

module.exports = require('./webpack.config.js');



module.exports.entry = {
    'vue-upload-component': './src/main.js',
}

module.exports.output.library = 'VueUploadComponent';
module.exports.output.libraryTarget = 'umd';
