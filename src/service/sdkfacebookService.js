const { FB, FacebookApiException } = require('fb');

const getDataFormLead = async(form_id, access_token) => {

    FB.options({
        appId: process.env.APP_IP_FACE,
        appSecret: process.env.APP_SECRET_FACE,
        version: 'v10.0',
        timeout: 1500, //tiempo de espera
        accessToken: access_token,
    });

    try {
        var form = await FB.api("/" + form_id + "?fields=context_card,name,page,question_page_custom_headline");
    } catch (error) {
        if (error.form.error.code === 'ETIMEDOUT') {
            console.log('request timeout ETIMEDOUT');
        } else {
            console.log('error', error.message);
        }
        return false;
    }

    //obtener imagen
    if (form.context_card.cover_photo.id) {
        try {
            var form_image = await FB.api("/" + form.context_card.cover_photo.id + "?fields=images");
            console.log("obteniendo imagenes de form lead facebook ------------------------");
            // console.log(form_image);
            let image = form_image.images.filter((a) => { if (a.height == '600') return a; });
            form.image = image[0];
            console.log(form_image);
        } catch (error) {
            if (error.form_image.error.code === 'ETIMEDOUT') {
                console.log('request timeout ETIMEDOUT');
            } else {
                console.log('error', error.message);
            }
            // return false;
        }
    }
    console.log("data de form lead -------------------------");
    console.log(form);
    return form;

}

module.exports = {
    getDataFormLead: getDataFormLead
}