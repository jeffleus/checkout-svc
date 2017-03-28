var AWS = require('aws-sdk');
AWS.config.region = 'us-west-2';
var sns = new AWS.SNS();

module.exports.sendText = function(message, number) {
	console.log('SMS.js sendText called from client');
	//need to data validation for message and number
	var params = {
		Message: message,
		MessageStructure: 'string',
		PhoneNumber: number
	};
	//wrap the message publish in a promise to all async work in Lambda functions
	var q = new Promise(function(resolve, reject) {
		console.log('SMS.js promise started and publish calling');
		//execute the promise method calling resolve/reject in callback
		sns.publish(params, function(err,data) {
			console.log('publish call returned');
			//reject if there was an error
			if (err) reject(err);
			//resolve w/ the repsonse data if all's well
			else resolve(data);
		});
	});
	//return the promise to client
	return q;
};