var morx = require('morx');
var q = require('q');

var spec =  morx.spec() 
				.build('flwref', 'required:false,map:flwref, eg:NGN') 
				.build('txref', 'required:false,map:txref, eg:NGN') 
				.build('last_attempt', 'required:false, eg:NGN')
				.build('only_successful', 'required:false, eg:NGN')
				.end();

function service(data, _rave){

	var d = q.defer();

	q.fcall( () => {

		var validated = morx.validate(data, spec, _rave.MORX_DEFAULT);
		var params = validated.params;

		if(!params.flwref && !params.txref) throw new Error('You must pass either flwref or txref');

		return params;

	})
	.then( params  => {

		 
		params.SECKEY = _rave.getSecretKey();  
		return _rave.request('flwv3-pug/getpaidx/api/v2/xrequery', params)
	})
	.then( response => {

		//console.log(response);
		d.resolve(response);

	})
	.catch( err => {

		d.reject(err);

	})

	return d.promise;
	
	

}
service.morxspc = spec;
module.exports = service;