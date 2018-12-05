var createSubaccount = require('../services/rave.subaccount.create');
var listSubaccount = require('../services/rave.subaccount.list');
var fetchSubaccount = require('../services/rave.subaccount.fetch')

function Subaccount(RaveBase){

	this.create = function (data) {

		return createSubaccount(data, RaveBase);

	}

	this.list = function (data) {

		return listSubaccount(data, RaveBase);

    }
    
    this.fetch = function (data) {
        return fetchSubaccount(data, RaveBase)
    }


}
module.exports = Subaccount;