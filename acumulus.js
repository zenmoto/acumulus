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
        var settings = {
            sample_interval: 1000
        };

        function get_or_set(key, value) {
            if (value == undefined) {
                return settings[key];
            } else {
                if (settings.hasOwnProperty(key)) {
                    settings[key] = value;
                    return obj;
                }
            }
        }

        Object.keys(settings).forEach(function(setting_name) {
            obj[setting_name] = function(val) {
                return get_or_set(setting_name, val);
            }
        })

        obj.add = function (key, value) {

        };

        return obj;
    }
})(this);
