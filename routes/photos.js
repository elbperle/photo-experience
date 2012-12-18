exports.photos = function(req, res){
    getDirectories("./public/images/photos/", function(directories) {
        res.render('photos', { title: 'Photos', activeNavItem: "photos", photoThemes: directories});
    });
};

function getDirectories(path, callback) {
    fs.readdir(path, function(err, entries) {
        var directories = [];
        var entriesToWaitFor = entries.length;
        for (var i=0; i<entries.length; i++) {
            (function(entry) {
                fs.stat(path + entry, function(err, stat) {
                    if (stat.isDirectory()) {
                        directories.push(entry);
                    }
                    if (--entriesToWaitFor === 0) {
                        callback(stripDotFiles(directories));
                    }
                })
            })(entries[i]);
        }
    });
}

function getFiles(path, callback) {
    fs.readdir(path, callback)
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