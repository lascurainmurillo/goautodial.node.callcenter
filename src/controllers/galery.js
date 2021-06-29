const Galery = require('../model/galery');
const galerymodel = new Galery(); // crear instancia de galery
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
    console.log(req.body);

    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).send('No files were uploaded.');
    }

    // guardar el archivo
    let filee = await filesservice.createfile(req.files, req.headers.host);
    if (filee.status != 200) {
        return res.status(filee.status).send('Problemas al cargar el archivo al servidor.');
    }

    // guardar datos en DB
    var data = req.body
    data.file = filee.url_file;
    var result = await galerymodel.saveData(data);

    // let result = Object.assign(req.body, filee);
    res.send({ ok: true, data: result });
}


const index = async(req, res) => {
    var data = await galerymodel.getFilesGroups(req.body);
    res.send(data);
}

const deletefile = (req, res) => {
    var id = req.params.id;
    var data = galerymodel.deleteData(id);
    res.send({ ok: true, data: {} });
}


module.exports = {
    postUploadGalery: postUploadGalery,
    index: index,
    deletefile: deletefile,
};