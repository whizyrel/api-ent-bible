var morx = require('morx');
var charge = require('./rave.charge');
var q = require('q');
// var r = require('../lib/rave.base');
// var R = new r("", "", false);

//This allows you initiate a transfer

var spec =  morx.spec()
                .build('account_bank', 'required:true, eg:044')
				.build('account_number', 'required:true,validators:isNumeric, eg:06900021')
                .build('amount', 'required:true, eg:10')
				.build('narration', 'required:false,eg:New transfer')
                .build('currency', 'required:required,eg:NGN')
                .build('reference', 'required:required,eg:mk-902837-jk')
                .end();
                

function service(data, _rave){

	var d = q.defer();
	q.fcall( () => {

		var validated = morx.validate(data, spec, _rave.MORX_DEFAULT);
		var params = validated.params;
        _rave.params = params
		return  (_rave);

    })
    .then((_rave) => {
		_rave.params.seckey = _rave.getSecretKey();  
		return _rave.request('v2/gpx/transfers/create', _rave.params)
	})
	.then( resp => {

		d.resolve(resp);

	})
	.catch( err => {

		d.reject(err);

	});

	return d.promise;

}
service.morxspc = spec;
module.exports = service;


// payload = {
// 	"account_bank": "044",
// 	"account_number": "0017704603",
// 	"amount": 500,
// 	"seckey": "",
// 	"narration": "DSTV bill",
// 	"currency": "NGN",
// 	"reference": "mk-18089e7-jk"
//   }

// service(payload, R).then((err, res) => {
// 	if(err){
// 		console.log(err)
// 	}else{
// 		console.log(res)
// 	}
// }).catch(err => {
// 	console.log(err)
// })
