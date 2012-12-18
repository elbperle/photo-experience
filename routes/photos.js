var Step = require("step");
var path = require('path');

exports.photos = function(req, res){
    tree("./public/images/photos", function(err, directory) {
        res.render('photos', { title: 'Photos', activeNavItem: "photos", photoTree: directory.children, path: path });
    });
};

exports.photosDetailView = function(req, res){
    tree(req.query.path, function(err, directory) {
        res.render('photosDetailView', { title: getDetailViewTitle(req.query.path), activeNavItem: "photos", photos : directory.children, path: path });
    });
};

function tree(dir, done) {
  var results = {
        "path": dir,
        "children": [],
        "isDirectory": true
      };
  fs.readdir(dir, function(err, list) {
    if (err) { return done(err); }
    list = stripDotFiles(list);
    var pending = list.length;
    if (!pending) { return done(null, results); }
    list.forEach(function(file) {
      fs.stat(dir + '/' + file, function(err, stat) {
        if (stat && stat.isDirectory()) {
          tree(dir + '/' + file, function(err, res) {
            
            results.children.push(res);
            results.isDirectory = true;
            if (!--pending){ done(null, results); }
          });
        } else {
          results.children.push({"path": dir + "/" + file});
          if (!--pending) { done(null, results); }
        }
      });
    });
  });
};

function getDetailViewTitle(dirPath) {
    // TODO: instead of split-string use path.sep in node.js > 0.8
    var pathArr = path.relative('public/images/photos', dirPath).split('/');
    return pathArr.join(' &gt; ')
}

function stripDotFiles(files) {
    var strippedFiles = [];
    for( var i = 0; i < files.length; i++){
        if (files[i].charAt(0) !== '.') {
            strippedFiles.push(files[i]);
        }        
    }  
    return strippedFiles;
}