const Fastify = require('fastify');
const fastify = Fastify({ logger: true });
const fs = require('fs');
const yaml = require('js-yaml');
const path = require('path');
const port = 3000

function generateStaticHandler(static_prefix, url){
    // closure
    var static_prefix = static_prefix;
    var url = url;
    return (req,res)=> res.sendFile(static_prefix + url);
}

try {
    const config = yaml.load(fs.readFileSync('devserver-config.yaml', 'utf8'), { schema: yaml.JSON_SCHEMA });
    console.log(JSON.stringify(config));
    var validRunmodes = ["source", "inline", "gz"]

    if (!(validRunmodes.indexOf(config.mode) > -1)) {
        console.log("Make sure to include mode parameter in deveserver-config.yaml file");
        return;
    }
    switch (config.mode) {
        case "source":
            serve_source(config);
            break;
        case "inline":
            serve_inline(config);
            break;
        case "gz":
            serve_gz(config);
        default:
            console.log("NOT IMPLEMENTED");
    }
} catch (e) {
    console.log(e);
}

function routeActions(config, static_prefix) {
    if (config.proxy_enabled) {
        fastify.register(require('fastify-reply-from'), { base: config.proxy_address });
        for (url of config.action_urls) {
            console.log('/' + url);
            fastify.route({
                path : '/'+url, 
                method : ['GET','POST'],
                handler : (req, res) => res.from(req.raw.url, {method: req.raw.method})
            })
        }
    } else {
        for (url of config.action_urls) {
            console.log('/' + url + "  -> " + path.resolve('src/' + url));
            fastify.get('/' + url, generateStaticHandler(static_prefix, url));
            fastify.post('/' + url, generateStaticHandler(static_prefix, url));
        }
    }
}

function serve_source(config) {
    fastify.register(require('fastify-static'), {
        root: path.join(__dirname, 'src')
    });
    routeActions(config, '')
    runserver('Devserver in SOURCE MODE');
}

function serve_inline(config) {
    fastify.register(require('fastify-static'), { root: __dirname, serve: false });
    fastify.get('/', (req, res) => {
        res.redirect("index.html");
    });
    fastify.get('/index.html', (req, res) => {
        res.sendFile('dist/index.html');
    });
    routeActions(config, 'src/')
    runserver('Devserver in INLINE MODE');
}

function serve_gz(config) {
    var gzfile_name = path.resolve("dist/index.html.gz");
    var gzfile_length = fs.statSync(gzfile_name)["size"];
    var last_modified = new Date().toUTCString();

    fastify.register(require('fastify-static'), { root: __dirname, serve: false });
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
    routeActions(config, 'src/')
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