function Formdata() { // Accept name and age in the constructor
    /*this.name = name || null;
    this.age = age || null;*/
}

Formdata.prototype.formatleaddata = function(data) {
    dataform = {};
    dataother = {};
    var elem = ""; // nombre campo de la tabla
    data.forEach(async(eldata) => {
        if (elem = lang_field(eldata.name)) {
            if (elem == 'phone_number') {
                dataform[elem] = eldata.values[0].slice(2);
                dataform['phone_code'] = eldata.values[0].slice(1, 3);
                dataform['country_code'] = eldata.values[0].slice(1, 3);
            } else if (elem == 'full_name') {
                dataform['first_name'] = eldata.values[0];
                dataform['last_name'] = '';
            } else {
                dataform[elem] = eldata.values[0];
            }
        } else {
            dataother[eldata.name] = eldata.values[0];
        }

        dataform['id'] = result_data.id;
        dataform['created_time'] = result_data.created_time;
        elem = "";
    });

    if (dataother) {
        dataform['dataother'] = JSON.stringify(dataother);
    }

    return dataform;
}

const lang_field = function(field) {

    // 'field name facebook' : 'field name database'
    names = {
        'phone_number': 'phone_number', // ingles
        'número_de_teléfono': 'phone_number', // español

        'full_name': 'full_name', // ingles
        'nombre_completo': 'full_name', // español

        'email': 'email', // ingles
        'correo_electrónico': 'email', // español

        'street_address': 'address1', // ingles
        'dirección': 'address1', // español

        'city': 'city', // ingles
        'ciudad': 'city', // español

        'state': 'state', // ingles
        'estado': 'state', // español

        'country': 'country', // ingles
        'país': 'country', // español

        'post_code': 'postal_code', // ingles
        'código_postal': 'postal_code', // español

        'date_of_birth': 'date_of_birth', // ingles
        'fecha_de_nacimiento': 'date_of_birth', // español

        'gender': 'gender', // ingles
        'sexo': 'gender', // español

        'gender': 'gender', // ingles
        'sexo': 'gender', // español

        'job_title': 'job_title', // ingles
        'cargo': 'job_title', // español

        'company_name': 'company_name', // ingles
        'nombre_de_la_empresa': 'company_name', // español

        'dni_(peru)': 'id_identity', // peru
        'dni_(mexico)': 'id_identity', // mexico

        'marital_status': 'marital_status', // ingles
        'estado_civil': 'marital_status', // español

        'relationship_status': 'relationship_status', // ingles
        'situación_sentimental': 'relationship_status', // español

        'military_status': 'military_status', // ingles
        'situación_militar': 'military_status', // español

        'work_phone_number': 'work_phone_number', // ingles
        'número_de_teléfono_del_trabajo': 'work_phone_number', // español

        'work_email': 'work_email', // ingles
        'correo_electrónico_del_trabajo': 'work_email', // español

    }
    return (typeof(names[field]) != 'undefined') ? names[field] : false;
}


module.exports = Formdata;