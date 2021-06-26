const Galery = require('../model/galery');
const filesservice = require('../service/filesService');

/**
 * 
 * Subir archivos para la galeria
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
const postUploadGalery = async(req, res) => {
    console.log("--------------- SUBIENDO EN GALERIA ------------------- ");
    console.log(req.files);
    console.log(req.body.type);
    console.log(req.body.filename);

    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).send('No files were uploaded.');
    }

    // guardar el archivo
    let result = await filesservice.createfile(req.files, req.headers.host);
    if (result.status != 200) {
        return res.status(result.status).send('Problemas al cargar el archivo al servidor.');
    }

    // Galery.saveData()
    // guardar datos en DB
    res.send(200);
}


module.exports = {
    postUploadGalery: postUploadGalery
};