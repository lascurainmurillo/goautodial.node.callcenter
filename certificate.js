// Certificate
const https = require('https');
const fs = require('fs');

let httpsServer = function(app) {

    const privateKey = fs.readFileSync('/etc/letsencrypt/live/callcenter.callmarket.cc/privkey.pem', 'utf8');
    const certificate = fs.readFileSync('/etc/letsencrypt/live/callcenter.callmarket.cc/cert.pem', 'utf8');
    const ca = fs.readFileSync('/etc/letsencrypt/live/callcenter.callmarket.cc/chain.pem', 'utf8');

    const credentials = {
        key: privateKey,
        cert: certificate,
        ca: ca
    };

    let httpsServer = https.createServer(credentials, app);
    return httpsServer;

}

module.exports = {
    httpsServer: httpsServer
}