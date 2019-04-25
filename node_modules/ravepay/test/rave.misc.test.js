var misc = require('../lib/rave.misc');
var base = require('../lib/rave.base');
var Promise = require('bluebird');
var mocha = require('mocha');
var chai = require('chai');
var expect = chai.expect;
var chaiAsPromised = require('chai-as-promised');
var dotenv = require('dotenv');

chai.use(chaiAsPromised);

describe("#Rave misc services test", function() {
    describe("# rave get fees test", function() {
        it("should return a 200 response status", function(done) {
            this.timeout(10000);
            var ravebase = new base(process.env.PUBLIC_KEY, process.env.SECRET_KEY, "https://ravesandboxapi.flutterwave.com");
            var miscInstance = new misc(ravebase);
            var payload = {
                "amount": "3000",
                "card6": "543889"
            }
            var result = miscInstance.getFee(payload);
            expect(result).to.eventually.have.property('statusCode', 200).notify(done);
        })

        it("should return a data object with properties charge_amount, fee, merchantfee, and ravefee", function(done) {
            this.timeout(10000);
            var ravebase = new base(process.env.PUBLIC_KEY, process.env.SECRET_KEY, "https://ravesandboxapi.flutterwave.com");
            var miscInstance = new misc(ravebase);
            var payload = {
                "amount": "3000",
                "card6": "543889"
            }
            var result = miscInstance.getFee(payload).then(resp => {
                return resp.body.data;
            })
            expect(result).to.eventually.have.deep.nested.any.keys("charge_amount", "fee", "merchantfee", "ravefee").notify(done);
        })
    })

    describe("# rave get banks tests", function() {
        it("should return a 200 response status", function(done) {
            this.timeout(10000);
            var ravebase = new base(process.env.PUBLIC_KEY, process.env.SECRET_KEY, "https://ravesandboxapi.flutterwave.com");
            var miscInstance = new misc(ravebase);
            var payload = {};
            var result = miscInstance.getBanks(payload);
            expect(result).to.eventually.have.property('statusCode', 200).notify(done);
        })
    })
})