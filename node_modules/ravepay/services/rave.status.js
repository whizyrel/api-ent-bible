var morx = require('morx');
var q = require('q');

var spec =  morx.spec() 
				.build('flwref', 'required:false, eg:Flw001') 
				.build('txref', 'required:false, eg:MC-001') 
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
		return _rave.request('flwv3-pug/getpaidx/api/v2/verify', params)
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