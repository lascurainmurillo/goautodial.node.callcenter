const received_updates = []; // muestras los object recibidos de webhook 

/**
 *
 * route GET / route principal
 * getWebhook
 * @param req request route
 * @param res response route
 * 
 */
const getIndex = (req, res) => {
    // console.log(req);
    res.send('<pre>' + JSON.stringify(received_updates, null, 2) + '</pre>');
}


module.exports = {
    getIndex: getIndex,
    received_updates: received_updates
}