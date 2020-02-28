const express = require('express')
const app = express()
const fs = require('fs');
const path = require('path');
const port = 3000


var argv = require('minimist')(process.argv.slice(2));

var validRunmodes = ["source", "inline", "gz"]
if (!(validRunmodes.indexOf(argv.mode) > -1)) {
    console.log("Make sure to include mode parameter:\n --mode source\n --mode inline\n --mode gz\n");
    return;
}
switch (argv.mode) {
    case "source":
        serve_source();
        break;
    case "inline":
        serve_inline();
        break;
    case "gz":
        serve_gz();
    default:
        console.log("NOT IMPLEMENTED");
}
return;


function serve_source() {
    // TODO: add liveserver/live update functionality
    app.use('/', express.static('src'))
    // app.get('/', (req, res) => {
    //     res.redirect("index.html");
    // });
    // app.get('/index.html', (req, res) => {
    //     res.sendFile(path.resolve('src/index.html'));
    // });
    // app.get('/main.js', (req, res) => {
    //     res.sendFile(path.resolve('src/main.js'));
    // });
    // app.get('/styles.css', (req, res) => {
    //     res.sendFile(path.resolve('src/styles.css'));
    // });
    // app.get('/data.json', (req, res) => {
    //     res.sendFile(path.resolve('src/data.json'));
    // });
    app.listen(port, () => console.log(`Devserver in SOURCE MODE listening on port ${port}!`));
}

function serve_inline() {
    app.get('/', (req, res) => {
        res.redirect("index.html");
    });
    app.static('/',)
    app.get('/index.html', (req, res) => {
        res.sendFile(path.resolve('dist/index.html'));
    });
    app.get('/data.json', (req, res) => {
        res.sendFile(path.resolve('src/data.json'));
    });
    app.listen(port, () => console.log(`Devserver in INLINE MODE listening on port ${port}!`));
}

function serve_gz() {
    var gzfile_name = path.resolve("dist/index.html.gz");
    var gzfile_length = fs.statSync(gzfile_name)["size"];
    app.get('/', (req, res) => {
        res.redirect("index.html");
    });
    app.get('/index.html', (req, res) => {
        res.set({
            'Content-Encoding': 'gzip',
            'Content-Type': 'text/html',
            // "Last-Modified": last_modified, // sendFile will take care of this
            'Content-Length': gzfile_length,
        })
        res.status(200).sendFile(gzfile_name);
    });


    app.get('/data.json', (req, res) => {
        res.sendFile(path.resolve('src/data.json'));
    });
    app.listen(port, () => console.log(`Devserver in GZ MODE listening on port ${port}!`));
}
