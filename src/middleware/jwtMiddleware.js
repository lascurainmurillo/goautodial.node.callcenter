const jwt = require('jsonwebtoken');

/**
 * Verificar token de acceso
 * @param {*} token 
 */
const verifytoken = (req, res, next) => {
    // console.log("Estoy en el middleware de verifytoken");
    const token = req.get('JWT-TOKEN');
    try {
        var decoded = jwt.verify(token, process.env.KEY_JWT, { algorithms: ['HS256'] });
    } catch (err) {
        res.status(401).send('Error de authenticación de token');
    }
    next();
}


module.exports = {
    verifytoken: verifytoken
}