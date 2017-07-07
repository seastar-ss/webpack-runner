/**
 * Created by shawn on 2017/6/9.
 */
const fs = require("fs");
const path = require("path");
function clone(obj) {
    var copy;
    // Handle the 3 simple types, and null or undefined
    if (null == obj || "object" != typeof obj) return obj;
    // Handle Date
    if (obj instanceof Date) {
        copy = new Date();
        copy.setTime(obj.getTime());
        return copy;
    }
    // Handle Array
    if (obj instanceof Array) {
        copy = [];
        for (var i = 0, len = obj.length; i < len; i++) {
            copy[i] = clone(obj[i]);
        }
        return copy;
    }
    // Handle Object
    if (obj instanceof Object) {
        copy = {};
        for (var attr in obj) {
            if (obj.hasOwnProperty(attr)) copy[attr] = clone(obj[attr]);
        }
        return copy;
    }
    throw new Error("Unable to copy obj! Its type isn't supported.");
}

function lsAllByExtention(p, ext) {
    var files = fs.readdirSync(p);
    var ret = [];
    //console.log("files",files," ",ext);
    for (var i = 0, n = files.length; i < n; ++i) {
        var item = files[i];

        //console.log("ext compare:",ext," ",extname)
        if (item) {
            var extname = path.extname(item);
            var name = path.basename(item);
            if (extname == ext && !name.startsWith("_")) ret.push(name);
        }
    }
    //console.log("final files",ret);
    return ret;
}

function mkdirSyncRecursive(directory) {
    var path = directory.replace(/\\/g, "/").replace(/\/$/, '').split('/');
    //console.log("paths:",path);
    for (var i = 1; i <= path.length; i++) {
        var segment = path.slice(0, i).join('/');
        ('' != segment && !fs.existsSync(segment) ) ? fs.mkdirSync(segment) : console.log(segment);
    }
}

function writeToFile(content,file) {
    //ext = ext || ".html";

    // var cur = file;
    try {

        var parent = path.dirname(file);
        try {
            fs.accessSync(parent);
        } catch (e) {
            mkdirSyncRecursive(parent);
        }
        fs.accessSync(parent);
        fs.writeFileSync(file, content);

    } catch (e) {
        console.error(e);
    }
}

module.exports={
    clone:clone,
    lsAllByExtention:lsAllByExtention,
    mkdirSyncRecursive:mkdirSyncRecursive,
    writeToFile:writeToFile
};