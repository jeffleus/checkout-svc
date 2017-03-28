'use strict';
var Sequelize = require('sequelize');
var sequelize = new Sequelize('FuelStation_EDA', 'XXXX', 'XXXX', {
	host: 'callsheet-mysql.cn6x6nhayn9c.us-west-2.rds.amazonaws.com',
	port: 3306,
    pool: {
        max: 10,
        min: 1,
        idle: 100
    }
});

var Checkout = sequelize.define('checkout', {
  CheckoutID: { 
	  type: Sequelize.INTEGER, 
	  primaryKey: true, 
      autoincrement: true, 
	  field: 'CheckoutID' 
  }, 
  StudentSportID: { type: Sequelize.INTEGER, field: 'StudentSportID' },
  isArchived: { type: Sequelize.BOOLEAN, field: 'isArchived' },
  CreateDate: { type: Sequelize.DATE, field: 'CreateDate' },
  ArchiveDate: { type: Sequelize.DATE, field: 'ArchiveDate' }
}, {
	tableName: 'Checkouts'
});

var moduleName = "CHECKOUTS:";

module.exports.get = function(id,filter) {
    if (!id) return list(filter);
    console.log(moduleName, 'calling getSingle with id: ' + id);
    return sequelize.sync().then(function() {
        return Checkout.findById(id).then(function(checkout) {
            console.info(moduleName, 'checkout record found');
            return {
                count: (checkout)?1:0,
                checkouts: [ (checkout)?checkout.dataValues:null ]
            };
        })
    });
}

function list(filter) {
    console.log(moduleName, 'calling getAll because no id provided');
	return sequelize.sync().then(function() {
        if (filter) {
            var filterOption = {
                where: {
                    CheckoutID: filter 
                } 
            };
            return Checkout.findAndCountAll(filterOption);
        } else return Checkout.findAndCountAll();
    }).then(function(result) {
		//return Athlete.findAndCountAll().then(function(result) {
        var checkouts = [];
        result.rows.forEach(function(checkoutRow) {
            checkouts.push(checkoutRow.dataValues);
        });
        return {
            count: result.count,
            checkouts: checkouts
        };
	});
}

module.exports.create = function(json) {
	return sequelize.sync().then(function() {
		console.info(moduleName, 'create a new checkout using JSON provided');
		console.error('need to add json validation to checkout creation');
		var checkoutJson = json;//JSON.parse(json);
		return Checkout.create(json).then(function(checkout) {
			console.info('checkout successfully created');
			return checkout;
		});
	});
};

module.exports.update = function(json) {
	return sequelize.sync().then(function() {
		console.info(moduleName, 'update a single checkout using JSON provided');
		console.error('need to add json validation to checkout update');
		var c = json;//JSON.parse(json);
		return Checkout.update(
			json,
			{ where: { CheckoutID: json.CheckoutID } }
		).then(function(result) {
			console.info(moduleName, 'checkout successfully updated');
			return result;
		});
	});
};

module.exports.delete = function(id) {
	return sequelize.sync().then(function() {
		console.info(moduleName, 'delete a checkout by id');
		return Checkout.destroy({ where: { CheckoutID: id } }).then(function(count) {
			console.info(moduleName, '(' + count.toString() + ') checkouts successfully deleted');
			return count;
		});
	});
};

module.exports.close = function() {
	sequelize.close();
};