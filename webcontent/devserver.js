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
    default:
        console.log("NOT IMPLEMENTED");
}
return;


function serve_source(){
    app.get('/', (req, res) => {
        res.redirect("index.html");
    });
    app.get('/index.html', (req, res) => {
        res.sendFile(path.resolve('src/index.html'));
    });
    app.get('/main.js', (req, res) => {
        res.sendFile(path.resolve('src/main.js'));
    });
    app.get('/styles.css', (req, res) => {
        res.sendFile(path.resolve('src/styles.css'));
    });
    app.get('/data.json', (req, res) => {
        res.sendFile(path.resolve('src/data.json'));
    });
    app.listen(port, () => console.log(`Devserver in SOURCE MODE listening on port ${port}!`));
}


gzfile_name = path.resolve('../css-gulp-hexencode/static/thermostaat.html.gz');


var staticfiles
// var gzfile = binary = fs.readFileSync(gzfile_name, 'binary');
var gzfile_length = fs.statSync(gzfile_name)["size"];
var last_modified = new Date().toUTCString();

app.get('/', (req, res) => res.send('Hello World!'));
app.get('/thermostaat.html', (req, res) => {
    console.log('handling request for thermostaat.html')
    if (req.headers["if-modified-since"] === last_modified) {
        console.log("sending html statuscode 304")
        res.sendStatus(304);
    } else {
        console.log("sending gzipped contents")
        res.set({
            'Content-Encoding': 'gzip',
            'Content-Type': 'text/html',
            "Last-Modified": last_modified,
            'Content-Length': gzfile_length,
        })
        res.status(200).sendFile(gzfile_name);
    }
});
app.get('/testvalues1.json', (req, res) => {
    console.log('sending testvalues1.json');
    res.sendFile(path.resolve('../css-gulp-hexencode/testvalues1.json'));
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`))
