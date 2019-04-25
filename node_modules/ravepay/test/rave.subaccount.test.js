// var account = require('../lib/rave.subaccount');
// var base = require('../lib/rave.base');
// var Promise = require('bluebird');
// var mocha = require('mocha');
// var chai = require('chai');
// var expect = chai.expect;
// var chaiAsPromised = require('chai-as-promised');

// chai.use(chaiAsPromised);

// describe("#Rave Subaccount test", function() {
//     // var createResp, fetchResp, listResp;
//     var chargeResp, validationResp;
//     var ravebase = new base("FLWPUBK-3899c4a996764a5d061ede002fa390f3-X", "FLWSECK-ff7445bbd6971fabbf987975afdc85ea-X", false);
//     var subaccountInstance = new subaccount(ravebase);
//     describe("#Rave Subaccount create leg test", function () {
//         it("should return a success status response", function(done) {
//             this.timeout(10000);
//             var payload = {
//                 "account_bank": "044",
//                 "account_number": "0690000035",
//                 "business_name": "JK Services",
//                 "business_email": "jk@services.com",
//                 "business_contact": "Seun Alade",
//                 "business_contact_mobile": "08174111222",
//                 "business_mobile": "09087930450",
//                 "meta": [{"metaname": "MarketplaceID", "metavalue": "ggs-920900"}],
//                 "seckey": "FLWSECK-ff7445bbd6971fabbf987975afdc85ea-X"
//             }
//             createResp=[];
//             subaccountInstance.subaccount(payload).then(resp => {
//                 // createResp = resp;
//                 if (resp.status == "success") {
//                     done();
//                 }
                
//             }).catch(err => {
//                 done(err);
//             })
//         })
//     })
// })
