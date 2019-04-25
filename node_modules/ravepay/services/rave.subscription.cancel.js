var morx = require('morx');
var charge = require('./rave.charge');
var q = require('q');

var spec = morx.spec()
                .build('id', 'required:false,validators:isNumeric, eg:7345')
                .build('ref', 'required:false, eg:7345')
                .build('amount', 'required:true, eg:100')
				.build('action', 'required:false, eg:void')
                .end();
                

function service(_rave, subscription_id){

	var d = q.defer();
	q.fcall( () => {

		var validated = morx.validate(spec, _rave.MORX_DEFAULT);
		var params = validated.params;
        _rave.params = params
		return  (_rave);
    })

    .then((_rave) => {
        _rave.params.seckey = _rave.getSecretKey();
        var uri = 'v2/gpx/subscriptions/'+subscription_id+'/cancel'
		return _rave.request(uri, _rave.params)
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

