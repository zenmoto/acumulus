/*! acumulus v0.0.0 - MIT license */

'use strict';

/**
 * Module dependencies
 */

/**
 * Module exports
 */

(function () {

    if (module) {
        module.exports = acumulus;
    } else {
        this.acumulus = acumulus;
    }

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
            while (data.length > settings.max_samples) {
                data.shift();
            }
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

        obj.stop = stop;
        obj.start = start;
        obj.clear = restart;

        obj.sample_interval = function(value) {
            if (value == undefined) {
                return settings.sample_interval;
            } else {
                settings.sample_interval = value;
                restart();
                return obj;
            }
        };

        obj.max_samples = function(value) {
            if (value == undefined) {
                return settings.max_samples;
            } else {
                settings.max_samples = value;
                return obj;
            }
        };

        obj.add = function (key, value) {
            current[key] = (current[key] || 0) + (typeof value === 'number' ? value : 1);
            return current[key];
        };

        obj.get = function(key) {
            return get_value(current, key);
        };

        obj.series = function(key, num_elems) {
            // TODO: Figure out how to factor out this function creation
            var dataset = num_elems ? data.slice(num_elems * -1) : data;
            return dataset.map(function(e) {
                return get_value(e, key);
            })
        };

        obj.sum = function(key, num_elems) {
            return sum(obj.series(key, num_elems));
        };

        function top_reduction_fun(total, elem) {
            for (var e in elem) {
                if (elem.hasOwnProperty(e)) {
                    if (total[e]) {
                        total[e] += elem[e];
                    } else {
                        total[e] = elem[e];
                    }
                }
            }
            return total;
        }

        obj.sum_all = function() {
            var values = data.reduce(top_reduction_fun, {});
            return Object.keys(values).map(function(v) {
                return {series: v, value: values[v]};
            }).sort(function(a, b) {
                if (a.value < b.value) {
                    return 1;
                }
                if (b.value < a.value) {
                    return -1;
                }
                return 0;
            });
        };

        obj.top = function(elems) {
            return obj.sum_all().slice(0, elems);
        };

        start();

        return obj;
    }
})();
