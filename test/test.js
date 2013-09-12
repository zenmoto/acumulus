var expect = require('chai').expect;
var acumulus = require('../acumulus');

describe('acumulus()', function () {
    it('is defined', function () {
        expect(acumulus).to.be.a('function');
        var a = acumulus();
        expect(a).to.be.an('object');
        expect(a.sample_interval).to.be.a('function');
        expect(a.sample_interval(750)).to.be.an('object');
        expect(a.sample_interval()).to.equal(750);
    });
});
