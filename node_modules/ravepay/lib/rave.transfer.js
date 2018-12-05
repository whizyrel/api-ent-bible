var initiateTransfer = require('../services/rave.transfer.initiate');
var bulkTransfer = require('../services/rave.transfer.bulk');
var fetchTransfer = require('../services/rave.transfer.fetch');
var listTransfer = require('../services/rave.transfer.list');
var getApplicableFee = require('../services/rave.transfer.getApplicableFee');
var getBalance = require('../services/rave.transfer.getBalance');
var retrieveTransferStatus = require('../services/rave.transfer.retrieveStatusOfBulk');
var accountVerification = require('../services/rave.transfer.accountVerification');


function Transfer(RaveBase){

	this.initiate = function(data){
		return initiateTransfer(data, RaveBase)
	}

	this.bulk = function(data){
		return bulkTransfer(data, RaveBase)
	}

	this.fetch = function (data) {
		return fetchTransfer(data, RaveBase);
	}

	this.list = function(data){
		return listTransfer(data, RaveBase)
	}

	this.getApplicableFee = function(data){
		return getApplicableFee(data, RaveBase)
	}

	this.getBalance = function(data){
		return getBalance(data, RaveBase)
	}

	this.retrieveStatusOfBulk = function(data){
		return retrieveTransferStatus(data, RaveBase)
	}

	this.accountVerification = function(data){
		return accountVerification(data, RaveBase)
	}

}
module.exports = Transfer;