const fs = require("fs");
const path = require("path");
var $ = require("jsrender");
var __ = require("./util/func")
//var lessApi = require('less');

$.views.settings.allowCode(true);
//console.log($);
var $baseTmpl;

var parentFolder;
var baseFolder;
var baseHost;
var baseResourceFolder;
var basePath;
function prepare(conf) {
    parentFolder = path.resolve(conf.parentFolder);
    baseFolder = path.resolve(conf.baseFolder);
    baseHost = conf.baseHost;
    baseResourceFolder = conf.baseResourceFolder;
    basePath = conf.basePath;
    __.mkdirSyncRecursive(path.resolve(baseResourceFolder));
    __.mkdirSyncRecursive(path.resolve(conf.baseHtmlOutputFolder));
}

function build(templates) {
    for (var name in templates) {
        if (name.startsWith("_")) {
            var tpName = name;
            if (this[tpName] == undefined || tpName.startsWith("__")) {
                var p = path.resolve(parentFolder, templates[name]);
                var txt = fs.readFileSync(p);
                if (txt && txt.length > 0) {
                    try {
                        var $tmpl = $.templates(tpName, txt.toString());
                    }catch(e){
                    console.error(e);
                }
                    this[tpName] = $tmpl;
                }
            }
        }
    }
}

function buildAll(tmpl, templates) {
    var txt = fs.readFileSync(path.resolve(parentFolder, tmpl));
    if (txt && txt.length > 0) {
        try {
            $baseTmpl = $.templates("$baseTmpl", txt.toString());
        }catch(e){
            console.error(e);
        }
        for (var name in templates) {
            var item = templates[name];
            item.name = name;
            item.script = baseHost + basePath + "main.js";
            item.css = baseHost + basePath + "css-main.css";
            build(item);
            // print("")
            //this["$"+name]=item;
            var content = $baseTmpl.render(item);
            var file = path.resolve(baseFolder, name + ".html");
            __.writeToFile(content, file);
        }
    } else {
        console.log("wrong position to read template");
    }
}




function commonSetting(base, pos, title, func) {
    var def = __.clone(base);
    def.__body = path.resolve(parentFolder, pos);
    var p = path.dirname(def.__body);
    def.title = title;
    def.csses = __.lsAllByExtention(p, ".css");
    // if(fs.existsSync(path.resolve(p,"entry.less"))){
    //     def.less="entry.less";
    // }
    var less = __.lsAllByExtention(path.dirname(def.__body), ".less");
    def.csses = def.csses.concat(less);
    def.scripts = __.lsAllByExtention(p, ".js");
    typeof(func) == "function" ? func(def) : 0;
    return def;
}

module.exports = {
    //"clone": clone,
    "buildAll": buildAll,
    //"lsAllByExtention": lsAllByExtention,
    "commonSetting": commonSetting,
    "prepare": prepare
}