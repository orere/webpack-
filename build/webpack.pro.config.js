const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const webpack = require("webpack");
const entryJSON = require('./entry.json');

var argv = require('yargs').argv; // runenv,packname

let env, sPublicPath;
if (argv.runenv == 'build') {
    env = require('../config/pro.env')
    sPublicPath = '//rss.leaplearner.com/assets/act/'
} else if (argv.runenv == 'tst') {
    env = require('../config/tst.env')
    sPublicPath = '../'
}

let entryList = {},
    HtmlPluginList = [],
    packName = argv.packname;
for (const i in entryJSON) {
    if (argv.packname == entryJSON[i].name) {
        entryList = entryJSON[i].entry;
        for (const j in entryJSON[i].htmlList) {
            HtmlPluginList.push(new HtmlWebpackPlugin({
                chunks: entryJSON[i].htmlList[j].chunks,
                title: entryJSON[i].htmlList[j].title,
                template: entryJSON[i].htmlList[j].template,
                filename: entryJSON[i].htmlList[j].filename,
            }))
        }
    }
}

module.exports = {
    entry: entryList,
    output: {
        filename: '[name]/js/[name].[chunkHash:5].js',
        path: path.resolve(__dirname, '../dist'),
        publicPath: sPublicPath
    },
    module: {
        rules: [{
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
                        name: '[name].[ext]',
                        // outputPath: '../'+packName,
                        // publicPath: '../images/',
                        publicPath: function (url) {
                            return path.resolve(__dirname, '../dist/' + packName + '/images', url).replace(/\\/g, '/')
                        },
                        useRelativePath: true,
                        context: 'src/pages',
                        limit: 4096
                    }
                }]
            },
            {
                test: /\.js$/,
                loader: 'babel-loader',
                exclude: path.resolve(__dirname, 'node_modules'), //编译时，不需要编译哪些文件
                include: path.resolve(__dirname, 'src'),//在config中查看 编译时，需要包含哪些文件
                query: {
                    presets: ['latest'] //按照最新的ES6语法规则去转换
                }
            }
        ]
    },
    plugins: [
        new CleanWebpackPlugin('dist', {
            root: path.join(__dirname, '../')
        }),
        new ExtractTextPlugin({
            filename: '[name]/css/ais.css',
        }),
        new webpack.ProvidePlugin({
            $: "jquery",
            jQuery: 'jquery',
            'window.jQuery': 'jquery',
            'window.$': 'jquery',
        }),
        new webpack.DefinePlugin({
            'process.env': env
        }),
        //   new WebpackHtmlPlugin({
        //     filename: item,
        //     template: 'html-withimg-loader!'+path.resolve(__dirname, 'src/html/index.html'),
        //     chunks: ['js/common', name]
        //   })
    ].concat(HtmlPluginList)
};