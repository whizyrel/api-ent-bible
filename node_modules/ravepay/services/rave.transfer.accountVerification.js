var morx = require('morx');
var charge = require('./rave.charge');
var q = require('q');


//This allows you verify an account to transfer to

var spec =  morx.spec()
                .build('recipientaccount', 'required:required,eg:0690000034')
                .build('destbankcode', 'required:required,eg:044')
                .build('PBFPubKey', 'required:required,eg:FLWPUBK-3899c4a996764a5d061ede002fa390f3-X')
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
        _rave.params.PBFPubKey = _rave.getPublicKey();
        return _rave.request('flwv3-pug/getpaidx/api/resolve_account', _rave.params);
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
//     "recipientaccount": "0690000034",
//     "destbankcode": "044",
//     "PBFPubKey": "FLWPUBK-4e9d4e37974a61157ce8ca4f43c84936-X"
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