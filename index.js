var Checkout = require('./Checkout');

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

var id = '93265';
var sid = '704731996';
var filter = ('93265,93266').split(',');
console.log("FILTER: ", filter);

//Checkout.create(checkout).then(function(result) {
//Checkout.get(null, filter).then(function(result) {
//Checkout.get(id).then(function(result) {
    
//Checkout.report().then(function(result) {
Checkout.history(sid).then(function(result) {
	
//Checkout.get(null, filter).then(function(result) {
//Checkout.create(checkout).then(function(result) {
//Checkout.update(checkout).then(function(result) {
//Checkout.delete(checkout.CheckoutID).then(function(result) {

//Choice.get(null, filter).then(function(student) {
//Choice.create(choice).then(function(student) {
//Choice.update(choice).then(function(student) {
    
//Sport.get(null, filter).then(function(student) {
//Sport.get('XXX').then(function(student) {
//Sport.create(sport).then(function(student) {
//Sport.update(sport).then(function(student) {
//Sport.delete('XXX').then(function(result) {
	
//Athletes.delete(1165).then(function(result) {
//Athletes.update(ath).then(function(student) {
//Athletes.create(ath).then(function(student) {
//Athletes.get(id, filter).then(function(student) {
//	console.log(student);
    
//	console.log(result.count);
//    result.checkouts.forEach(function(co) {
//        console.log(co.CheckoutID, co.StudentSportID);
//        co.CheckoutChoices.forEach(function(ch) {
//            console.log('Choice: ', ch.ChoiceID, ch.isSnack);
//        })
//    })
    console.log(result);
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