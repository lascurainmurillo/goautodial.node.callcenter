function Formdata() { // Accept name and age in the constructor
    /*this.name = name || null;
    this.age = age || null;*/
}

Formdata.prototype.formatleaddata = function(data) {
    dataform = {};
    var elem = "";
    data.forEach(async(eldata) => {
        if (elem = lang_phonenumber /*eldata.name == 'phone_number' || eldata.name == 'número_de_telefono'*/ ) {
            dataform[elem] = eldata.values[0].slice(2);
        } else if (eldata.name == 'full_name') {
            dataform['first_name'] = eldata.values[0];
            dataform['last_name'] = '';
        } else {
            dataform[eldata.name] = eldata.values[0];
        }

        dataform['id'] = result_data.id;
        dataform['created_time'] = result_data.created_time;
        elem = "";
    });

    return dataform;
}

const lang_phonenumber = function(field) {
    names = {
        'phone_number': true,
        'número_de_telefono': true,
    }
    return (typeof(names[field]) != 'undefined') ? 'phone_number' : false;
}

module.exports = Formdata;