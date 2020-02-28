const fastify = require('fastify')({
    logger: true
})
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
    fastify.register(require('fastify-static'), {
        root: path.join(__dirname, 'src')
    })
    runserver('Devserver in SOURCE MODE');
}

function serve_inline() {
    fastify.register(require('fastify-static'), { root: __dirname, serve: false });
    fastify.get('/', (req, res) => {
        res.redirect("index.html");
    });
    fastify.get('/index.html', (req, res) => {
        res.sendFile('dist/index.html');
    });
    fastify.get('/data.json', (req, res) => {
        res.sendFile('src/data.json');
    });
    runserver('Devserver in INLINE MODE');
}

function serve_gz() {
    var gzfile_name = path.resolve("dist/index.html.gz");
    var gzfile_length = fs.statSync(gzfile_name)["size"];
    var last_modified = new Date().toUTCString();

    fastify.get('/', (req, res) => {
        res.redirect("index.html");
    });
    fastify.get('/index.html', (req, res) => {
        if (req.headers["if-modified-since"] === last_modified) {
            console.log("sending html statuscode 304")
            res.code(304).send();
        } else {
            res.headers({
                'Content-Encoding': 'gzip',
                'Content-Type': 'text/html',
                "Last-Modified": last_modified, // sendFile will take care of this
                'Content-Length': gzfile_length,
            });
            const stream = fs.createReadStream(path.resolve(gzfile_name))
            res.send(stream);
        }
    });


    fastify.get('/data.json', (req, res) => {
        const stream = fs.createReadStream(path.resolve('src/data.json'))
        res.send(stream);
        // res.sendFile(path.resolve('src/data.json'));
    });
    runserver('Devserver in GZ MODE');
}

function runserver(msg) {
    const port = 3000
    fastify.listen(port, function (err, address) {
        if (err) {
            fastify.log.error(err)
            process.exit(1)
        }
        fastify.log.info(msg + ` | listening on ${address}`)
    })
}