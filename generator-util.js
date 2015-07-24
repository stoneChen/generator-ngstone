'use strict';
var path = require('path');
var fs = require('fs');
var chalk = require('chalk');
var child_process = require('child_process');

function transformSlash(path) {// windows 下生成的路径是右斜杠
    return path.replace(/\\/g, '/');
}

function escapeRegExp(str) {
    return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, '\\$&');
}

function rewrite(args) {
    /* jshint -W044 */
    // check if splicable is already in the body text
    var re = new RegExp(args.splicable.map(function (line) {
        return '\\s*' + escapeRegExp(line);
    }).join('\n'));

    if (re.test(args.haystack)) {
        return args.haystack;
    }

    var lines = args.haystack.split('\n');

    var otherwiseLineIndex = 0;
    lines.forEach(function (line, i) {
        if (line.indexOf(args.needle) !== -1) {
            otherwiseLineIndex = i;
        }
    });

    var spaces = 0;
    while (lines[otherwiseLineIndex].charAt(spaces) === ' ') {
        spaces += 1;
    }

    var spaceStr = '';
    while ((spaces -= 1) >= 0) {
        spaceStr += ' ';
    }

    lines.splice(otherwiseLineIndex, 0, args.splicable.map(function (line) {
        return spaceStr + line;
    }).join('\n'));

    return lines.join('\n');
}

function rewriteFile(args) {
    args.path = args.path || process.cwd();
    var fullPath = path.join(args.path, args.file);

    args.haystack = fs.readFileSync(fullPath, 'utf8');
    var body = rewrite(args);

    fs.writeFileSync(fullPath, body);
}
function importLess(appPath,name,generatorInst) {
    var filePath = path.join(appPath, 'styles/all.less');
    var content = fs.readFileSync(filePath, 'utf8');
    content += "\n@import '" + name + "';"
    fs.writeFileSync(filePath, content);
    generatorInst.log(chalk.cyan('less imported into all.less: ') + name + '.less');
}
function addAppNameSuffix(appname) {
    return appname + 'App';
}
function addScriptSuffix(scriptName) {
    if(/^.+\.js$/.test(scriptName)){
        return scriptName;
    }else{
        return scriptName + '.js';
    }
}

function removeDirRecursiveSync(itemPath) {
    if (fs.statSync(itemPath).isDirectory()) {
        var fileList = fs.readdirSync(itemPath);
        fileList.forEach(function(childItemName) {
            removeDirRecursiveSync(path.join(itemPath, childItemName));
        })
        fs.rmdirSync(itemPath);
    } else {
        fs.unlinkSync(itemPath);
    }
}
function clearDir(path,skipBowerAndNpmDir) {
    if( !fs.existsSync(path) ) {
        return;
    }
    var skip = ['bower_components','node_modules'];
    var files = fs.readdirSync(path);
    files.forEach(function (path) {
        if(skipBowerAndNpmDir && (skip.indexOf(path) !== -1)){
            return;
        }
        removeDirRecursiveSync(path)
    });
}

function readFiles(directory,handler,context) {
    var files = fs.readdirSync(directory);
    files.forEach(function (f) {
        if(f.indexOf('.DS_Store') !== -1){
            return;
        }
        var fullPath = path.join(directory,f);
        if(fs.statSync(fullPath).isDirectory()){
            readFiles(fullPath,handler,context);
        }else{
            handler.call(context,f,fullPath);
        }
    })
}

function addScriptToIndex(appPath,script,generatorInst) {
    var fullPath = path.join(appPath, 'index.html');
    script = addScriptSuffix(script);
    rewriteFile({
        file: fullPath,
        needle: '<!-- endbuild -->',
        splicable: [
                '<script src="' + transformSlash(script) + '"></script>'
        ]
    });
    generatorInst.log(chalk.green('script tag added into index.html: ') + script);
}

function isDirEmpty(dir) {
    var files = fs.readdirSync(dir);
    return !files.length;
}
function isBadBusinessName(name) {
    return !(/^[a-z]+?[^sx0-9]$/i).test(name);//每位非数字，且最后一位不能含有s|x
}
module.exports = {
    transformSlash:transformSlash,
    rewrite: rewrite,
    rewriteFile: rewriteFile,
    addAppNameSuffix:addAppNameSuffix,
    addScriptSuffix:addScriptSuffix,
    importLess:importLess,
    clearDir:clearDir,
    readFiles:readFiles,
    isDirEmpty:isDirEmpty,
    addScriptToIndex:addScriptToIndex,
    isBadBusinessName:isBadBusinessName
};
