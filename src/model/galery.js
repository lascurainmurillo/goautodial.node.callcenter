const moment = require('moment');
const GaleryCollection = require('./galerySchema');

function Galery() {
    this.users = [];
}


Galery.prototype.saveData = async(data) => {
    var newGal = new GaleryCollection(data);
    var doc = await newGal.save();
    // console.log(doc);
    return doc;
}

Galery.prototype.getFilesGroups = async(data) => {
    // return await GaleryCollection.find({}).sort({ created_at: 'desc' });
    return await GaleryCollection.aggregate([

        {
            "$sort": {
                "created_at": -1
            }
        },
        {
            "$group": {
                "_id": {
                    "tipo": "$tipo",
                },
                "data": { $push: "$$ROOT" },
            }
        },
        {
            "$project": {
                "_id": 0,
                "tipo": "$_id.tipo",
                "data": "$data",
            }
        }

    ]);

}

Galery.prototype.deleteData = async(id) => {
    // var newGal = new GaleryCollection();
    var doc = await GaleryCollection.deleteOne({ "_id": id });
}

module.exports = Galery;