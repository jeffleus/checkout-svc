var Checkout = require('./Checkout');
//var mock = require('./mockDaily');

var args = process.argv.slice(2);
//console.log(process.argv);

var checkout = {
    //CheckoutID: 93267,
	StudentSportID: 1060, 
    isArchived: true,
    CreateDate: new Date(2017,2,26,12,30),
    ArchiveDate: new Date(2017,2,26,15,20),
	CheckoutChoices: [
		{ ChoiceID: 4, isSnack: 1, type: 0},
		{ ChoiceID: 3198, isSnack: 0, type: 1}
	]
};

var id = '96562';
var items = "3371,3325,3338";
//var sid = '905';
//var filter = ('93265,93266').split(',');
//console.log("FILTER: ", filter);
//console.log(mock);

Checkout.items('2018-02-01', '2018-02-14', items).then(function(result) {
//Checkout.create(checkout).then(function(result) {
//Checkout.get(id, null).then(function(result) {
//Checkout.today(false).then(function(result) {
//Checkout.get(id).then(function(result) {
    
//Checkout.report().then(function(result) {

//run Checkout history to test for proper offset work
//Checkout.daily().then(function(result) {
//Checkout.history(sid).then(function(result) {
//Checkout.monthly(6, 2017).then(function(result) {
	
    //console.log(result);
	//console.log(result.checkouts[0].CheckoutChoices);
    console.log("FOUND: ", result?result.length:0);
	return;
}).catch(function(err) {
	console.error(err);
	return;
}).finally(function() {
	Checkout.close();
	return;
});

function _logTest(id, filter) {
    console.log('ID: ', id);
    console.log('FILTER: ', filter);
};