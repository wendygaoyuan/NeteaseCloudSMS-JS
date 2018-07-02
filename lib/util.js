"use strict";

/**
 * Module dependencies.
 * @ignore
 */

var crypto = require("crypto");
var querystring = require('querystring');
var https = require("https");


/**
 * Module exports
 * @ignore
 */

exports.getRandom = getRandom;
exports.getSignature = getSignature;
exports.request = request;
exports.getCurrentTime = getCurrentTime;

/**
 * 获取随机数
 *
 * @return {number}
 * @public
 */
function getRandom() {
    return Math.round(Math.random() * 99999);
}

/**
 * 获取unix时间戳
 *
 * @return {number}
 * @public
 */
function getCurrentTime() {
    return Math.floor(Date.now()/1000);
}

/**
 * 生成签名
 *
 * @param  {string}  appSecret - 密钥
 * @param  {string}  random - 随机数
 * @param  {number}  curTime - 时间戳
 * @return {string}
 * @public
 */
function getSignature(appSecret, random, curTime) {

    var signStr = crypto.createHash("sha1").update(
            appSecret + random + curTime, 'utf8'
        ).digest("hex");

    return signStr.toLowerCase();

}

/**
 * 请求加回调
 *
 * @param  {object}    options - 请求参数
 * @param  {function}  callback - request handler, method signature: function(error, response, responseData)
 * @public
 */
function request(options, callback) {
    var body;
    if (options.body) {
        body = options.body;
        delete options.body;
    }

    var req = https.request(options, function(res) {
        res.setEncoding("utf-8");
        var resData = "";

        res.on("data", function(data) {
            resData += data;
        });

        res.on("error", function(err) {
            callback(err, res, undefined);
        });

        res.on("end", function() {
            callback(undefined, res, JSON.parse(resData));
        });
    });

    req.on("error", function(err) {
        callback(err, undefined, undefined);
    });

    if (body) {
        req.write(querystring.stringify(body));
    }
    req.end();
}
