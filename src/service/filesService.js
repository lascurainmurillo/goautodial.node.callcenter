const help = require('../helpers/help');

const createfile = async(file, host) => {

    let sampleFile;
    let uploadPath;

    // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
    sampleFile = file.file;

    let tipo = sampleFile.mimetype.split('/');

    let make_string = help.makeString(10);
    var punto_final = sampleFile.name.split('.');
    let type_file = punto_final[punto_final.length - 1];
    // uploadPath = __dirname + '../../../public/assets/temp_files/' + make_string + "_" + Date.now() + "." + type_file;
    var name = make_string + "_" + Date.now() + "." + type_file
    uploadPath = __dirname + '../../../public/assets/whatsapp-files/' + name;

    // Use the mv() method to place the file somewhere on your server
    let miPrimeraPromise = new Promise((resolve, reject) => {

        sampleFile.mv(uploadPath, function(err) {
            if (err) {
                console.log(err);
                //res.status(500).send(err);
                resolve({ status: 500 });
            }
            // resolve({ status: 200, url_file: 'https://' + host + '/assets/whatsapp-files/' + name, tipo_file: tipo[0] });
            resolve({ status: 200, url_file: 'https://c180f78489a5.ngrok.io/assets/whatsapp-files/' + name, tipo_file: tipo[0] });
            /*'https://www.dzoom.org.es/wp-content/uploads/2017/07/seebensee-2384369-810x540.jpg'*/
            /*'https://c180f78489a5.ngrok.io/assets/whatsapp-files/'*/
        });

    });

    return miPrimeraPromise;
}


module.exports = {
    createfile: createfile
}