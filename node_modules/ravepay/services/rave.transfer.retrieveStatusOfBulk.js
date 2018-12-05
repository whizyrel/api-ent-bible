var morx = require('morx');
var q = require('q');

//This allows you retrieve status of a bulk transfer

var spec =  morx.spec() 
				.build('flwref', 'required:false, eg:NGN') 
				.build('txref', 'required:false, eg:NGN') 
				.end();

function service(_rave, batch_id=""){

	var d = q.defer();

	q.fcall( () => {

		var validated = morx.validate(spec, _rave.MORX_DEFAULT);
        var params = validated.params; 
        _rave.params = params
        return _rave
	})
	.then( _rave  => {
		 
        _rave.params.seckey = _rave.getSecretKey(); 
        _rave.params.batch_id = batch_id; 
		_rave.params.method = "GET"; 
        return _rave.request('v2/gpx/transfers', _rave.params)
        
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


// service(R, batch_id=590).then((err, res) => {
// 	if(err){
// 		console.log(err)
// 	}else{
// 		console.log(res)
// 	}
// }).catch(err => {
// 	console.log(err)
// })