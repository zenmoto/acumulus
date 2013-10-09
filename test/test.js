var expect = require('chai').expect;
var acumulus = require('../acumulus');

describe('acumulus', function () {
    var a;
    beforeEach(function() {
        a = acumulus().sample_interval(10);  // Really short sample interval for testing.
    });
    afterEach(function() {
        a.stop();
        a = null;
    });
    it('is defined', function () {
        expect(acumulus).to.be.a('function');
        var a = acumulus();
        expect(a).to.be.an('object');
        expect(a.sample_interval).to.be.a('function');
        expect(a.sample_interval(50)).to.be.an('object');
        expect(a.sample_interval()).to.equal(50);
    });

    it('has a length', function(done) {
        expect(a.length).to.equal(1);
        setTimeout(function() {
            expect(a.length).to.equal(2);
            done();
        }, a.sample_interval() + 5);
    });

    it("allows accumulation and retreival by key", function() {
        expect(a.add("foo", 5)).to.equal(5);
        expect(a.add("foo")).to.equal(6);
        expect(a.get("foo")).to.equal(6);
    });

    it("allows retrieval of a series of values", function(done) {
        a.add("foo");
        setTimeout(function() {
            a.add("foo", 3);
            expect(a.series("foo")).to.eql([1,3]);
            done();
        }, 15);
    });

    it("allows retrieval of sparse values (those which didn't receive an update during a tick)", function(done) {
        a.add("foo", 2);
        setTimeout(function() {
            a.add("foo");
            expect(a.series("foo")).to.eql([2, 0, 1]);
            expect(a.series("foo", 2)).to.eql([0, 1]);
            done();
        }, 25);
    });

    describe("sum", function() {
        it("allows for retrieval of a sum across all values or a range", function(done) {
            a.add("foo");
            setTimeout(function() {
                a.add("foo");
                expect(a.sum("foo")).to.equal(2);
                expect(a.sum("foo", 2)).to.equal(1);
                expect(a.length).to.equal(3);
                done();
            }, 25);
        });

    });

    it("allows for a maximum number of samples", function(done) {
        a.max_samples(5);
        setTimeout(function() {
            expect(a.length).to.equal(5);
            done();
        }, 70);
    });

    it("allows for sums of all values", function() {
        a.add("foo", 5);
        a.add("bar", 3);
        a.add("baz", 4);
        var t = a.sum_all();
        expect(t[0].series).to.equal("foo");
        expect(t[1].series).to.equal("baz");
        expect(t[2].series).to.equal("bar");
        expect(t[0].value).to.equal(5);
        expect(t[2].value).to.equal(3);
    });

    it("allows for pulling top values", function() {
        a.add("foo", 10);
        a.add("bar", 3);
        a.add("baz", 1);
        var t = a.top(2);
        expect(t.length).to.equal(2);
        // Ensure that they come out with the biggest first
        expect(t[0].series).to.equal("foo");
        expect(t[0].value).to.equal(10);
        expect(t[1].series).to.equal("bar");
    });


//    it("allows for a moving average over a configurable window", function(done) {
//        a.add("foo", 100);
//        setTimeout(function() {
//            a.add("foo");
//        }, 11);
//        setTimeout(function() {
//            a.add("foo");
//            expect(a.moving_average("foo", 2)).to.equal(1);
//            done();
//        }, 22);
//    });


});
