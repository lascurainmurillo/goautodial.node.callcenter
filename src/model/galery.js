const moment = require('moment');
const GaleryCollection = require('./galerySchema');

function Galery() {
    this.users = [];
}


Galery.prototype.saveData = function(data) {
    var newJoin = new GaleryCollection(data);
    newJoin.save();
}

module.exports = Galery;