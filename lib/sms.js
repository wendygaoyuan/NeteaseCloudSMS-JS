"use strict";

var url = require("url");
var util = require("./util");


/**
 * Module exports
 * @ignore
 */
exports.SmsAuthSender = SmsAuthSender;


/**
 * SmsAuthSender
 *
 * @param  {string}  appKey
 * @param  {string}  appSecret
 * @constructor
 */
function SmsAuthSender(appKey, appSecret) {
    this.appKey = appKey;
    this.appSecret = appSecret;
};

/**
 * 发送验证码
 *
 * @param  {number}    templateId - 短信模板ID
 * @param  {number}    codeLen - 验证码长度
 * @param  {string}    phoneNumber -  手机号
 * @param  {function}  callback - 请求回调, method signature: function(error, response, responseData)
 * @public
 */
SmsAuthSender.prototype.send = function(templateId, codeLen, phoneNumber, callback) {
    console.log("send")
    var reqUrl = url.parse("https://api.netease.im/sms/sendcode.action");

    var random = util.getRandom();
    var now = util.getCurrentTime();
    var sign = util.getSignature(this.appSecret, random, now);

    var options = {
        host: reqUrl.host,
        path: reqUrl.path,
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            "charset": "utf-8",
            "AppKey": this.appKey,
            "Nonce": random,
            "CurTime": now,
            "CheckSum": sign
        },
        body: {
            "templateid" : templateId,
            "mobile" : phoneNumber,
            "codeLen" : codeLen
        }
    };

    util.request(options, callback);
};


/**
 * 校验验证码
 *
 * @param  {string}    authCode - 验证码
 * @param  {string}    phoneNumber - 手机号
 * @param  {function}  callback - 请求回调, signature: function(error, response, responseData)
 * @public
 */
SmsAuthSender.prototype.verify = function(authCode, phoneNumber, callback) {

    var reqUrl = url.parse("https://api.netease.im/sms/verifycode.action");

    var random = util.getRandom();
    var now = util.getCurrentTime();
    var sign = util.getSignature(this.appSecret, random, now);

    var options = {
        host: reqUrl.host,
        path: reqUrl.path,
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            "charset": "utf-8",
            "AppKey": this.appKey,
            "Nonce": random,
            "CurTime": now,
            "CheckSum": sign
        },
        body: {
            "mobile" : phoneNumber,
            "code" : authCode
        }
    };

    util.request(options, callback);
};
