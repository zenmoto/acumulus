var expect = require('chai').expect;
var acumulus = require('../acumulus');

describe('acumulus', function () {
    it('is defined', function () {
        expect(acumulus).to.be.a('function');
        var a = acumulus();
        expect(a).to.be.an('object');
        expect(a.sample_interval).to.be.a('function');
        expect(a.sample_interval(50)).to.be.an('object');
        expect(a.sample_interval()).to.equal(50);
    });

    it('has a length', function(done) {
        var a = acumulus().sample_interval(10);
        expect(a.length).to.equal(1);
        setTimeout(function() {
            expect(a.length).to.equal(2);
            done();
        }, a.sample_interval() + 5);
    });

    it("allows accumulation and retreival by key", function() {
        var a = acumulus();
        expect(a.add("foo", 5)).to.equal(5);
        expect(a.add("foo")).to.equal(6);
        expect(a.get("foo")).to.equal(6);
    });

    it("allows retreival of a series of values", function(done) {
        var a = acumulus().sample_interval(10);
        a.add("foo");
        setTimeout(function() {
            a.add("foo", 3);
            expect(a.series("foo")).to.eql([1,3]);
            done();
        }, 15);
    });

    it("allows retrieval of sparse values (those which didn't receive an update during a tick)", function(done) {
        var a = acumulus().sample_interval(10);
        a.add("foo");
        setTimeout(function() {
            a.add("foo");
            expect(a.series("foo")).to.eql([1, 0, 1]);
            done();
        }, 25);
    });

    it("allows for retrieval of a sum across all stored values", function(done) {
        var a = acumulus().sample_interval(10);
        a.add("foo");
        setTimeout(function() {
            a.add("foo");
            expect(a.sum("foo")).to.equal(2);
            expect(a.length).to.equal(3);
            done();
        }, 25);
    });


});
