const jwt = require('jsonwebtoken');

const verifytoken = (req, res) => {
    res.sendStatus(200);
}

module.exports = {
    verifytoken: verifytoken,
};