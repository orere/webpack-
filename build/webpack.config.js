const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const webpack = require("webpack");

module.exports = {
  entry: {
      pc1: './src/pages/pc1/app.js',
      pc2: './src/pages/pc2/app.js',
  },
  output: {
    filename: '[name]/js/[name].[chunkHash:5].js',
    path: path.resolve(__dirname, 'dist'),
    publicPath:process.env.API_RSS
  },
  module:{
      rules:[
          {
                test:/\.css$/,
                use: ExtractTextPlugin.extract({
                    fallback: "style-loader", 
                    use: "css-loader"
                })
          },
          {
              test:/\.(png|svg|jpg|gif)$/,
              use:[{
                loader: 'file-loader',
                options: {
                    outputPath: './',
                    publicPath: '../../images/',
                    useRelativePath: true,
                }
            }]
          }
      ]
  },
  plugins:[
      new CleanWebpackPlugin(['dist']),
      new ExtractTextPlugin({
          filename:'[name]/css/ais.css'
      }),
      new webpack.ProvidePlugin({
        $: "jquery",
        jQuery: 'jquery',
        'window.jQuery': 'jquery',
        'window.$': 'jquery',
      }),
  ]
};