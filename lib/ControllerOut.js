/**
 * @module ControllerOut
 * @description Utility object for controller responses (wraps Sails response object)
 * @see {@link https://github.com/grokible/sails-tutorial-1/blob/master/TUTORIALS/TUTORIAL02.md}
 * @see {@link http://sailsjs.org/#/documentation/reference/res|Sails Response('res') Reference}
 * @example
 * // In Sails controller:
 * var ControllerOut = require ('Local/ControllerOut')
 * ...
 * someAction: function (req, res) {
 *     var co = new ControllerOut (res)
 *     ...
 *     if (err)
 *         return co.error (err)  // jsonify err and send via Sails response obj
 *     else if (err2)
 *         return co.error (err2, { code: 'math.wayTooBig', message: "too big" });
 *                             // ^ override error properties
 * }
 */

module.exports = ControllerOut;

function ControllerOut (response) {
    this.response = response;
}

ControllerOut.prototype.error = function (error, options) {

    // Options properties {code, message} override error's
    // After options, underbar takes precedence (_code or _message) override error's

    options = options || {};
    var code = options.code || error._code || error.code || 'general.unknown';

    // Attempt to pull out any conceivable error message that we can use

    var message = options.message || error._message || error.message || error.description ||
        error.title || error.summary || error.reason || 'No message, unknown error.';

    var rc = {
        code: code,
        message: message
    };

    // If we are in a sails dev environment, supply all the error details

    if (sails.config.environment == 'development') {
        rc._internal = error;
        return this.response.json ({ error: rc });
    }
};