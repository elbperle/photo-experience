var Step = require("step");

exports.photos = function(req, res){
    getDirectories("./public/images/photos/", function(directories) {
        console.log(directories);
        res.render('photos', { title: 'Photos', activeNavItem: "photos", photoThemes: directories});
    });
};

function getDirectories(path, callback) {
    Step(
        function readDirectory() {
            fs.readdir(path, this);
        },
        
        function cleanDotEntries(err, entries) {
            return stripDotFiles(entries);
        },
        
        function getStats(err, entries) {
            var group =  this.group();
            this.entries = entries;
            for (var i=0; i<entries.length; i++) {
                fs.stat(path + entries[i], group());
            }
        },
        
        function filterDirectories(err, stats) {
            console.log(this.entries)
            this.directories = [];
            for (var i=0; i<stats.length; i++) {
                if (stats[i].isDirectory()) {
                    this.directories.push(this.entries[i]);
                }
            }
            return true;
        },
        
        function readSubDirectories(err) {
            var group = this.group();
            for(var i=0; i < this.directories.length; i++) {
                fs.readdir(path + this.directories[i], group());
            }
        },
        
        function filterEmptyDirectories(err, subDirsContents) {
            var cleanDirs = [];
            for (var i=0; i < subDirsContents.length; i++) {
                if(stripDotFiles(subDirsContents[i]).length > 0) {
                    cleanDirs.push(this.directories[i]);
                }                
            }
            callback(cleanDirs);
        }
    );
}

function getFiles(path, callback) {
    fs.readdir(path, callback);
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