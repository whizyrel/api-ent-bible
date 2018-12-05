var morx = require('morx');
var charge = require('./rave.charge');
var q = require('q');

//This helps you get your balance for transfers

var spec =  morx.spec()
                .build('currency', 'required:required,eg:NGN')
                .end();


function service(data, _rave){

    var d = q.defer();
    q.fcall( () => {

        var validated = morx.validate(data, spec, _rave.MORX_DEFAULT);
        var params = validated.params;
        console.log(params)
        // params.country = params.country || "NG";
        _rave.params = params
        return  (_rave);

    })
    .then((_rave) => {
        _rave.params.seckey = _rave.getSecretKey();  
        return _rave.request('v2/gpx/balance', _rave.params)
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
// 	"currency": "NGN",
// 	"seckey": "FLWSECK-6577e947f692e979e2d306ab4ce0a282-X"
// }

// service(payload, R).then((err, res) => {
// 	if(err){
// 		console.log(err)
// 	}else{
// 		console.log(res)
// 	}
// }).catch(err => {
// 	console.log(err)
// })