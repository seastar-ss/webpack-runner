/**
 * Created by shawn on 2017/6/3.
 */
//const Uglify=require('uglifyjs-webpack-plugin');
//const WebpackShellPlugin = require('webpack-shell-plugin');
/**
 * path: path.join(__dirname, "js"),
 filename: "[name].js"
 */
var webpack=require("webpack");
//var oss = require('ali-oss');

var path = require('path');
var ExtractTextPlugin = require("extract-text-webpack-plugin");
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');

var plugins = [];
var ts = require('./build_script/def.js');
var __ = require('./build_script/util/func')
console.log(ts);

//console.log(inout);
//plugins.push(new WebpackShellPlugin({
//    onBuildStart: ['node views/def.js'],
//    onBuildEnd: ['echo "done"']
//}));
// var extractcss = new ExtractTextPlugin("[name].css");
const extractStyles = new ExtractTextPlugin({
    filename: (getPath) => {
        return getPath('css-[name].css');
    },
    disable: process.env.NODE_ENV === "development",
    ignoreOrder: true
});
const extractHtmls = new ExtractTextPlugin({
    filename: (getPath) => {
        return getPath('html-[name].html');
    },
    disable: process.env.NODE_ENV === "development"
});
var rules= [
    {test: /\.ts$/, use: 'ts-loader'},
    {
        test: /\.txt$/,
        use: 'raw-loader'
    },
    {
        test: /\.(jpg|jpeg|png)$/i,
        use: [
            // "file-loader",
            "url-loader?limit=8192&name=../../asset/img/i[hash:32].[ext]",
            {
                loader: 'img-loader',
                options: {
                    enabled: true,
                    gifsicle: {
                        interlaced: false
                    },
                    mozjpeg: {
                        progressive: true,
                        arithmetic: false
                    },
                    optipng:false,
                    // optipng: {
                    //     optimizationLevel:3
                    // },
                    pngquant: {
                        floyd: 0.5,
                        speed: 2
                    },
                    // svgo: {
                    //     plugins: [
                    //         { removeTitle: true },
                    //         { convertPathData: false }
                    //     ]
                    // }
                }
            }
        ]
    },
    {
        test: /\.(ttf|otf|svg|eot|woff(2)?)(\?[a-z0-9]+)?$/,
        use: [{loader: 'file-loader?name=../../asset/svg/i[hash:32].[ext]'}]
    },
    {
        test: /\.(le|c)ss$/,
        use: extractStyles.extract({
            //fallback: "style-loader",
            use: [
                //"style-loader",
                {
                    loader: "css-loader",
                    options:{
                        minimize:true
                    }
                }, {
                    loader: 'svg-fill-loader/encodeSharp'
                }, {
                    loader: "less-loader"
                }
            ],
        })
    },
    {
        test: /\.html$/,
        use: extractHtmls.extract({
                use: [
                    {
                        loader: 'html-loader',
                        options: {
                            minimize: true,
                            removeComments: true,
                            collapseWhitespace: true,
                            minifyCSS: true,
                            minifyJS: true
                        }
                    },
                    {
                        loader: 'markup-inline-loader',
                        options: {
                            svgo: {
                                plugins: [
                                    {
                                        removeTitle: true,
                                    }, {
                                        removeUselessStrokeAndFill: false,
                                    }, {
                                        removeUnknownsAndDefaults: false,
                                    }, {
                                        removeDoctype: true,
                                    }, {
                                        removeDimensions: true,
                                    },
                                ],
                            },
                        },
                    }
                ],
            }
        )
    }
];
// plugins.push(extractcss);
plugins.push(extractStyles);
plugins.push(extractHtmls);
plugins.push(new UglifyJSPlugin({
    mangle: {
        // Skip mangling these
        except: ['$super', '$', 'exports', 'require']
    }
}));
//var conf = {
//    entry: inout.input,
//    output: inout.output,
//    plugins: plugins,
//    module: {
//        rules:rules
//    },
//    //devServer: {
//    //    // proxy: { // proxy URLs to backend development server
//    //    //     '/api': 'http://localhost:3000'
//    //    // },
//    //    contentBase: path.join(__dirname, 'dist'), // boolean | string | array, static file location
//    //    compress: true, // enable gzip compression
//    //    historyApiFallback: true, // true for index.html upon 404, object for multiple paths
//    //    hot: true, // hot module replacement. Depends on HotModuleReplacementPlugin
//    //    https: false, // true for self-signed, object for cert authority
//    //    noInfo: true, // only errors & warns on hot reload
//    //    // ...
//    //}
//};
/*
var upload=function(){
    var store = oss({
        accessKeyId: 'your access key',
        accessKeySecret: 'your access secret',
        bucket: 'your bucket name',
        region: 'oss-cn-hangzhou'
    });
}
*/
var res=function (ts) {
    var ret = {
        input: {},
        output: {},
        distFolder: path.resolve(ts.conf.baseHtmlOutputFolder)
    };
    var resourceFolder = ts.conf.baseResourceFolder;
    var baseFolder = path.resolve(ts.conf.baseFolder);

    for (var x in ts.templates) {
        var templateItem = ts.templates[x];
        var scripts = templateItem.scripts;
        var csses = templateItem.csses;
        var common=templateItem.commonEntry;
        var pos = path.dirname(templateItem.__body);
        //var htmls=__.lsAllByExtention(pos,".html");
        var s = [path.resolve(baseFolder, x + ".html")];
        for(var i in common){
            s.push(path.join(__dirname,common[i]));
        }
        for (var y in scripts) {
            var name = path.basename(scripts[y]);
            s.push(path.resolve(pos, name));
            //s.push(path.resolve(pos)+"/");
        }
        for (var c in csses) {
            var name = path.basename(csses[c]);
            s.push(path.resolve(pos, name));
        }


        ret.output.path = path.join(__dirname, resourceFolder,x);
        ret.output.filename = "[name].js";
        //if (s.length > 0)
        //    ret.input[x] = s;

        var conf = {
            entry: s,
            output: ret.output,
            plugins: plugins,
            module: {
                rules:rules
            },
        };
        //console.log("run:",s);
        (function(x,conf) {
            webpack(conf, function (err, stats) {
                const info = stats.toJson();
                console.log("handled:" + x, conf.entry, "error:", err);
                if (stats.hasErrors()) {
                    console.log("has error:");
                    console.error(info.errors);
                }
                console.log("---------------------------");
            });
        })(x,conf);
    }
    upload();
    return ret;
};
res(ts);
//console.log(webpack);
module.exports =res;