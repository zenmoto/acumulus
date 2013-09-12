/*! acumulus v0.0.0 - MIT license */

'use strict';

/**
 * Module dependencies
 */

/**
 * Module exports
 */

(function (global) {

    if (module) {
        module.exports = acumulus;
    } else {
        this.acumulus = acumulus;
    }

    /**
     * @param {}
     * @return {}
     * @api public
     */


    function acumulus() {
        var obj = {};
        var current = {};
        var data = [current];
        obj.length = data.length;
        var interval_num;

        var settings = {
            sample_interval: 1000,
            max_samples: 60
        };

        function update() {
            current = {};
            data.push(current);
            obj.length = data.length;
        }

        function start() {
            interval_num = setInterval(update, settings.sample_interval);
        }

        function stop() {
            clearInterval(interval_num);
        }

        function restart() {
            data = []; // We may have changed intervals, data may be invalid.  Start over.
            current = {};
            data.push(current);
            stop();
            start();
        }

        function get_value(obj, name) {
            return obj.hasOwnProperty(name) ? obj[name] : 0;
        }
        function add(one, two) {
            return one + two;
        }

        function sum(ary) {
            return ary.reduce(add, 0);
        }

        obj.sample_interval = function(value) {
            if (value == undefined) {
                return settings.sample_interval;
            } else {
                settings.sample_interval = value;
                restart();
                return obj;
            }
        }

        obj.add = function (key, value) {
            current[key] = (current[key] || 0) + (typeof value === 'number' ? value : 1);
            return current[key];
        };

        obj.get = function(key) {
            return get_value(current, key);
        };

        obj.series = function(key) {
            // TODO: Figure out how to factor out this function creation
            return data.map(function(e) {
                return get_value(e, key);
            })
        };

        obj.sum = function(key) {
            return sum(obj.series(key));
        };


        start();

        return obj;
    }
})(this);
