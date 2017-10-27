'use strict';
var Checkout = require('./Checkout');
//temp mocks for getting the demo running smooth
var mockDaily = require('./mockDaily');
var mockUnarchived = require('./mockUnarchived');
var mockArchived = require('./mockArchived');
var SMS = require('./SMS');
const AWS = require('aws-sdk');
AWS.config.region = 'us-west-2';
var sns = new AWS.SNS();

var moduleName = 'checkout-svc';

module.exports.get = (event, context, callback) => {
  context.callbackWaitsForEmptyEventLoop = false;
  var response = {
    statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin" : "*", // Required for CORS support to work
        "Access-Control-Allow-Credentials" : true // Required for cookies, authorization headers with HTTPS 
      },
      body: JSON.stringify({
      message: 'GET from the checkout microservice for FuelStationApp'
    })
  };
    //check the event path params for an employee id to use during lookup
    var id = (event.pathParameters && event.pathParameters.cid) ? event.pathParameters.cid : null;
    var filter = ((event.queryStringParameters != null) && (event.queryStringParameters.filter != null))?	
		event.queryStringParameters.filter.split(','):null;
    console.log(moduleName, 'filter created - ' + JSON.stringify(filter));
    Checkout.get(id,filter).then(function(result) {
        if (result.count == 0) response.statusCode = 404;
        response.body = JSON.stringify({
            message: 'Successful get command found: ' + result.count,
            checkouts: result.checkouts
        });
        callback(null, response);
    }).catch(function(err) {
        console.log(moduleName, 'there was an error during the get call');
        console.error(err);
    }).finally(function() {
        console.info(moduleName, 'completed the employee model get');
    });
};

module.exports.create = (event, context, callback) => {
  context.callbackWaitsForEmptyEventLoop = false;
  var response = {
    statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin" : "*", // Required for CORS support to work
        "Access-Control-Allow-Credentials" : true // Required for cookies, authorization headers with HTTPS 
      },
      body: JSON.stringify({
      message: 'POST from the checkout microservice for FuelStationApp'
    })
  };
    
    var json = JSON.parse(event.body);
    var checkout;
    
    Checkout.create(json).then(function(c) {
        console.log(moduleName, 'checkout created, sending sms alert to confirm');
        checkout = c;	//stash the checkout in a function scoped variable
//        var msg = moduleName + ': successfully created a new checkout - ' + checkout.CheckoutID;
//        return SMS.sendText(msg, '+13108771151');
//    }).then(function(result) {
        response.body = JSON.stringify({
            message: 'Successfully created a new checkout: ' + checkout.CheckoutID,
            checkout: checkout
        });
        callback(null, response);
    }).catch(function(err) {
        console.log(moduleName, 'there was an error creating the checkout');
        console.error(err);
    }).finally(function() {
        console.info(moduleName, 'completed the checkout model create');
    });
};

module.exports.update = (event, context, callback) => {
  context.callbackWaitsForEmptyEventLoop = false;
  var response = {
    statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin" : "*", // Required for CORS support to work
        "Access-Control-Allow-Credentials" : true // Required for cookies, authorization headers with HTTPS 
      },
      body: JSON.stringify({
      message: 'PUT from the checkout microservice for FuelStationApp'
    })
  };
    var json = JSON.parse(event.body);
    var id = (event.pathParameters && event.pathParameters.cid) ? event.pathParameters.cid : null;
	
  Checkout.update(json).then(function(checkout) {
      console.log('checkout updated using the SPORT utility module');
      callback(null, response);
  }).catch(function(err) {
      console.log('There was an error updating the checkout record');
      console.error(err);
      callback(err);
  });
};

module.exports.delete = (event, context, callback) => {
  context.callbackWaitsForEmptyEventLoop = false;
  var response = {
    statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin" : "*", // Required for CORS support to work
        "Access-Control-Allow-Credentials" : true // Required for cookies, authorization headers with HTTPS 
      },
      body: JSON.stringify({
      message: 'DELETE from the checkout microservice for FuelStationApp'
    })
  };

  var id = (event.pathParameters && event.pathParameters.cid) ? event.pathParameters.cid : null;
  if (!id) {
      callback(null, {
          statusCode: 400,
          body: JSON.stringify({ message: 'Valid checkout id was not passed to the delete method.' })
      })
  }
	
  Checkout.delete(id).then(function(count) {
      console.log('(' + count + ') - checkout successfully deleted');
      callback(null, response);
  }).catch(function(err) {
      console.log('There was an error deleting the checkout record');
      console.error(err);
      callback(err);
  });
};

module.exports.history = (event, context, callback) => {
  context.callbackWaitsForEmptyEventLoop = false;
  var response = {
    statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin" : "*", // Required for CORS support to work
        "Access-Control-Allow-Credentials" : true // Required for cookies, authorization headers with HTTPS 
      },
      body: JSON.stringify({
      message: 'REPORT from the checkout microservice for FuelStationApp'
    })
  };
	
  var id = (event.pathParameters && event.pathParameters.sid) ? event.pathParameters.sid : null;
  if (!id) {
      callback(null, {
          statusCode: 400,
          body: JSON.stringify({ message: 'Valid checkout id was not passed to the delete method.' })
      })
  }
	
  Checkout.history(id).then(function(data) {
      console.log('(' + data.length + ') - checkout history successfully run');
	  response.body = JSON.stringify(data);
      callback(null, response);
  }).catch(function(err) {
      console.log('There was an error running the checkout history');
      console.error(err);
      callback(err);
  });
};

module.exports.report = (event, context, callback) => {
  context.callbackWaitsForEmptyEventLoop = false;
  var response = {
    statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin" : "*", // Required for CORS support to work
        "Access-Control-Allow-Credentials" : true // Required for cookies, authorization headers with HTTPS 
      },
      body: JSON.stringify({
      message: 'REPORT from the checkout microservice for FuelStationApp'
    })
  };
	
  Checkout.report().then(function(data) {
      console.log('(' + data.length + ') - checkout report successfully run');
	  response.body = JSON.stringify(data);
      callback(null, response);
  }).catch(function(err) {
      console.log('There was an error deleting the checkout record');
      console.error(err);
      callback(err);
  });
};

module.exports.daily = (event, context, callback) => {
  context.callbackWaitsForEmptyEventLoop = false;
  var response = {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin" : "*", // Required for CORS support to work
        "Access-Control-Allow-Credentials" : true // Required for cookies, authorization headers with HTTPS 
      },
      body: ""
  };
	
  console.log('running daily_checkouts() sproc for todays checkouts');
  Checkout.daily().then(function(data) {
	  response.body = JSON.stringify(data);
	  callback(null, response);
  }).catch(function(err) {
      console.log('There was an error getting daily report of checkout records');
      console.error(err);
      callback(err);
  });
};

module.exports.monthly = (event, context, callback) => {
  context.callbackWaitsForEmptyEventLoop = false;
  var response = {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin" : "*", // Required for CORS support to work
        "Access-Control-Allow-Credentials" : true // Required for cookies, authorization headers with HTTPS 
      },
      body: ""
  };
	
  var month = (event.pathParameters && event.pathParameters.month) ? event.pathParameters.month : null;
  var year = (event.pathParameters && event.pathParameters.year) ? event.pathParameters.year : null;
  if (!month || !year) {
      callback(null, {
          statusCode: 400,
          body: JSON.stringify({ message: 'Valid month/year args not passed to the monthly item report.' })
      })
  }
	
  Checkout.monthly(month, year).then(function(data) {
      console.log('(' + data.length + ') - monthly item report successfully run');
	  response.body = JSON.stringify(data);
      callback(null, response);
  }).catch(function(err) {
      console.log('There was an error running the item monthly report');
      console.error(err);
      callback(err);
  });
};

module.exports.unarchived = (event, context, callback) => {
  context.callbackWaitsForEmptyEventLoop = false;
  var response = {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin" : "*", // Required for CORS support to work
        "Access-Control-Allow-Credentials" : true // Required for cookies, authorization headers with HTTPS 
      },
      body: ""
  };
	
  Checkout.today(false).then(function(result) {
      console.log('(' + result.length + ') - checkout UNarchive for today successfully run');
	  response.body = JSON.stringify(result);
      callback(null, response);
  }).catch(function(err) {
      console.log('There was an error running the list of checkout UNarchive for today');
      console.error(err);
      callback(err);
  });
};

module.exports.archived = (event, context, callback) => {
  context.callbackWaitsForEmptyEventLoop = false;
  var response = {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin" : "*", // Required for CORS support to work
        "Access-Control-Allow-Credentials" : true // Required for cookies, authorization headers with HTTPS 
      },
      body: ""
  };
	
  Checkout.today(true).then(function(result) {
      console.log('(' + result.length + ') - checkout archive for today successfully run');
	  response.body = JSON.stringify(result);
      callback(null, response);
  }).catch(function(err) {
      console.log('There was an error running the list of checkout archive for today');
      console.error(err);
      callback(err);
  });
};
