const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const webpack = require("webpack");
const entryJSON = require('./entry.json');
const env = require('../config/dev.env')

let entryList = {},
    HtmlPluginList = []
for (const i in entryJSON) {
    entryList = Object.assign(entryList, entryJSON[i].entry);
    for (const j in entryJSON[i].htmlList) {
        HtmlPluginList.push(new HtmlWebpackPlugin({
            chunks: entryJSON[i].htmlList[j].chunks,
            title: entryJSON[i].htmlList[j].title,
            template: entryJSON[i].htmlList[j].template,
            filename: entryJSON[i].htmlList[j].filename,
        }))
    }
}
module.exports = {
    entry: entryList,
    output: {
        filename: '[name]/js/[name].[chunkHash:5].js',
        path: path.resolve(__dirname, 'dist'),
        publicPath: process.env.API_RSS
    },
    module: {
        rules: [
            {
                test: /\.(html)$/,
                use: [{
                    loader: 'html-loader',
                    options: {
                        attrs: ['img:src', 'source:src', 'video:poster']
                    }
                }]
            },
            {
                test: /\.css$/,
                use: ExtractTextPlugin.extract({
                    fallback: "style-loader",
                    use: "css-loader"
                })
            },
            {
                test: /\.(png|svg|jpg|gif|mp4|JPG)$/,
                use: [{
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
    plugins: [
        new CleanWebpackPlugin(['dist']),
        new ExtractTextPlugin({
            filename: '[name]/css/ais.css'
        }),
        new webpack.ProvidePlugin({
            $: "jquery",
            jQuery: 'jquery',
            'window.jQuery': 'jquery',
            'window.$': 'jquery',
        }),
        new webpack.DefinePlugin({
            'process.env': env
        })
    ].concat(HtmlPluginList),
    devServer: {
        contentBase: "./src", //本地服务器所加载的页面所在的目录
        historyApiFallback: true, //不跳转
        inline: true //实时刷新
    }
};