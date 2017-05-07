var path = require('path')
var webpack = require('webpack')

module.exports = {
  entry: {
    example: ['./example'],
  },

  output: {
    path: './dist',
    publicPath: '/dist/',
    filename: "[name].js",
    // target: 'node',
  },


  resolve: {
    root: path.join(__dirname, 'node_modules'),
    extensions: ['', '.js', '.vue', '.json'],
  },

  module: {
    loaders: [
      {
        test: /\.vue$/,
        loader: 'vue'
      },
      {
        test: /\.js$/,
        loader: 'babel',
        exclude: /node_modules/
      },
      {
        test: /\.json$/,
        loader: 'json'
      },
      {
        test: /\.html$/,
        loader: 'vue-html'
      },
      {
        test: /\.(png|jpg|gif|svg)$/,
        loader: 'url',
        query: {
          limit: 10000,
          name: '[name].[ext]?[hash]'
        }
      }
    ]
  },

  babel: {
    presets: ['es2015', 'stage-0'],
    plugins: ['transform-runtime'],
  },

  devServer: {
    historyApiFallback: true,
    noInfo: true
  },
  devtool: 'eval-source-map'
}

if (process.env.NODE_ENV === 'production') {
  module.exports.devtool = 'source-map'
  // http://vuejs.github.io/vue-loader/workflow/production.html
  module.exports.plugins = (module.exports.plugins || []).concat([
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: '"production"'
      }
    }),

    new webpack.optimize.OccurenceOrderPlugin()
  ])
}
