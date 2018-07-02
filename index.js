"use strict";

var sms = require("./lib/sms");

var appKey = "appKey";
var appSecret = "appSecret";

var templateId = 300000;
var phoneNumber = "18700890000";
var codeLen = 4;

var authCode = "7695";

var sender = new sms.SmsAuthSender(appKey, appSecret);

/**
 * 发送验证码
 */
sender.send(templateId, codeLen, phoneNumber, function(error, response, responseData){
	if (error) {
		console.log(error);
	} else {
		if (responseData.code == 200) {
			console.log('发送成功');
			console.log('验证码为' + responseData.obj);
		}
		
	}
});


/**
 * 校验验证码
 */
sender.verify(authCode, phoneNumber, function(error, response, responseData){
	if (error) {
		console.log(error);
	} else {
		if (responseData.code == 200) {
			console.log('验证码正确');
		} else {
			console.log('验证码错误');
		}
		
	}
});