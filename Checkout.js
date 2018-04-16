'use strict';
var Sequelize = require('sequelize');
var Config = require('./Config')();
var sequelize = new Sequelize('FuelStation_GVSU', Config.username, Config.password, {
	host: 'callsheet-mysql.cn6x6nhayn9c.us-west-2.rds.amazonaws.com',
	port: 3306,
    pool: {
        max: 10,
        min: 1,
        idle: 100
    }
});
var moduleName = "CHECKOUTS:";

var Checkout = sequelize.define('checkout', {
  CheckoutID: { 
	  type: Sequelize.INTEGER, 
	  primaryKey: true, 
      autoIncrement: true, 
	  field: 'CheckoutID' 
  }, 
//  StudentSportID: { type: Sequelize.INTEGER, field: 'StudentSportID' },
  LocationID: { type: Sequelize.INTEGER, field: 'LocationID' },
  isArchived: { type: Sequelize.BOOLEAN, field: 'isArchived' },
  CreateDate: { type: Sequelize.DATE, field: 'CreateDate' },
  ArchiveDate: { type: Sequelize.DATE, field: 'ArchiveDate' }
}, {
	tableName: 'Checkouts'
});

var CheckoutChoice = sequelize.define('checkoutchoice', {
  CheckoutChoiceID: { 
	  type: Sequelize.INTEGER, 
	  primaryKey: true, 
      autoincrement: true, 
	  field: 'CheckoutChoiceID' 
  }, 
  //CheckoutID: { type: Sequelize.INTEGER, field: 'CheckoutID' },
  ChoiceID: { type: Sequelize.INTEGER, field: 'ChoiceID' },
  isSnack: { type: Sequelize.BOOLEAN, field: 'IsSnack' },
  type: { type: Sequelize.INTEGER, field: 'Type' }
}, {
	tableName: 'CheckoutChoices'
});
console.info(moduleName, ' create Checkout hasMany association');
Checkout.hasMany(CheckoutChoice, {as: 'CheckoutChoices', foreignKey: 'CheckoutID'});
CheckoutChoice.belongsTo(Checkout, {foreignKey: 'CheckoutID'});

var Athlete = sequelize.define('athlete', {
  AthleteID: { 
	  type: Sequelize.INTEGER, 
	  primaryKey: true, 
	  autoincrement: true, 
	  field: 'StudentSportID' 
  }, 
  firstName: { type: Sequelize.STRING, field: 'firstname' }, 
  lastName: { type: Sequelize.STRING, field: 'lastname' }, 
  schoolid: { type: Sequelize.STRING, field: 'schoolsidnumber' },
  sportCode: { type: Sequelize.STRING, field: 'SportCodeID' }
}, {
	tableName: 'StudentSport'
});
console.info(moduleName, ' create Checkout hasMany association');
Athlete.hasMany(Checkout, {as: 'Checkouts', foreignKey: 'StudentSportID'});
Checkout.belongsTo(Athlete, {as: 'Athlete', foreignKey: 'StudentSportID'});

var Choice = sequelize.define('choice', {
  ChoiceID: { 
	  type: Sequelize.INTEGER, 
	  primaryKey: true, 
      autoincrement: true, 
	  field: 'ChoiceID' 
  }, 
  CategoryID: { type: Sequelize.INTEGER, field: 'CategoryID' },
  name: { type: Sequelize.STRING, field: 'Name' }, 
  description: { type: Sequelize.STRING, field: 'Description' },
  type: { type: Sequelize.INTEGER, field: 'Type' },
  isActive: { type: Sequelize.BOOLEAN, field: 'IsActive' }
}, {
	tableName: 'Choices'
});
console.info(moduleName, ' create CheckoutChoice belongsTo Choice association');
Choice.hasMany(CheckoutChoice, {as: 'CheckoutChoices', foreignKey: 'ChoiceID'});
CheckoutChoice.belongsTo(Choice, {as: 'Choice', foreignKey: 'ChoiceID'});


module.exports.get = function(id,filter) {
    if (!id) return list(filter);
    console.log(moduleName, 'calling getSingle with id: ' + id);
    var options = {
        where: { CheckoutID: id },
        include: [ {model: CheckoutChoice, as: 'CheckoutChoices', include: [{model:Choice, as:'Choice'}]}, {model:Athlete, as:'Athlete'} ]
    };
    return sequelize.sync().then(function() {
        return Checkout.findOne(options).then(function(checkout) {
            console.info(moduleName, 'checkout record found');
            checkout.Athlete = checkout.Athlete.dataValues;
            return {
                count: (checkout)?1:0,
                checkouts: [ (checkout)?checkout.get({plain:true}):null ]
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
                },
                include: [ {model: CheckoutChoice, as: 'CheckoutChoices'}, {model:Athlete, as:'Athlete'} ]
            };
            return Checkout.findAndCountAll(filterOption);
        } else return Checkout.findAndCountAll({ include: [ {model: CheckoutChoice, as: 'CheckoutChoices'} ] });
    }).then(function(result) {
		//return Athlete.findAndCountAll().then(function(result) {
        var checkouts = [];
        result.rows.forEach(function(checkoutRow) {
            checkouts.push(checkoutRow.get({plain:true}));
        });
        return {
            count: result.rows.length,
            checkouts: checkouts
        };
	});
}

module.exports.today = function(isArchive) {
    console.log(moduleName, 'calling getAll because no id provided');
	return sequelize.sync().then(function() {
		var today = new Date();
		var start = new Date(today.getFullYear(), today.getMonth(), today.getDate());
		var end = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);
        var filterOption = {
            where:{
                $and: [
                    { isArchived: isArchive },
                    {
                      CreateDate: { between: [ start, end] }
                    }
                  ]
                },
            include: [ {model: CheckoutChoice, as: 'CheckoutChoices', include: [{model:Choice, as:'Choice'}]}, {model:Athlete, as:'Athlete'} ]
        };
		console.log(filterOption);
        return Checkout.findAndCountAll(filterOption);
    }).then(function(result) {
		//return Athlete.findAndCountAll().then(function(result) {
        var checkouts = [];
        result.rows.forEach(function(checkoutRow) {
            checkouts.push(checkoutRow.get({plain:true}));
        });
        return {
            count: result.rows.length,
            checkouts: checkouts
        };
	});
}

module.exports.daily = function(id) {
	console.info(moduleName, 'daily checkout report');
	//offset from UTC to acheive PDT for summer daylight savings on the west coast
	var offset = (-7) * 60 * 60 * 1000;
	//get the date using the offset for proper date only portion
	console.log('now_local: ' + (new Date()).toString());
	var now = new Date( (new Date()).getTime() + offset );
	console.log('now_offset: ' + now.toString());
	var sql = 'CALL daily_checkouts();' ;
	//	+ id + '\', \'' + JSON.stringify(now).substring(1,11) + '\')';
	console.info (sql);
	return sequelize.query(sql).then(function(result) {
		return result;
	});
};

module.exports.monthly = function(month, year) {
	console.info(moduleName, 'monthly item report');
	//get the date using the offset for proper date only portion
	var sql = 'CALL item_monthly(' + month + ', ' + year + ');' ;
	//	+ id + '\', \'' + JSON.stringify(now).substring(1,11) + '\')';
	console.info (sql);
	return sequelize.query(sql).then(function(result) {
		return result;
	});
};

module.exports.summary = function(start, end) {
	console.info(moduleName, 'fuelstation daily summary report');
	//get the date using the offset for proper date only portion
	var sql = 'CALL daily_summary(\'' + start + '\', \'' + end + '\');' ;
	//	+ id + '\', \'' + JSON.stringify(now).substring(1,11) + '\')';
	console.info (sql);
	return sequelize.query(sql).then(function(result) {
		return result;
	});
};

module.exports.create = function(json) {
	var _checkout = Checkout.build(json);
//	json.CheckoutChoices.forEach(function(choiceJSON) {
//		var _choice = CheckoutChoice.build(choiceJSON);
//		console.log(_choice);
//		_checkout.
//	}
	//console.info(sequelize.models);	
	
	return sequelize.sync().then(function() {
		console.info(moduleName, 'create a new checkout using JSON provided');
		console.error('need to add json validation to checkout creation');
		var checkoutJson = json;//JSON.parse(json);
		return Checkout.create(json, { include: [ {model: CheckoutChoice, as: 'CheckoutChoices'} ] }).then(function(checkout) {
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
			{ where: { CheckoutID: json.CheckoutID },
                include: [ {model: CheckoutChoice, as: 'CheckoutChoices'} ]}
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

module.exports.history = function(id) {
	console.info(moduleName, 'checkout hisotry by student id');
	//offset from UTC to acheive PDT for summer daylight savings on the west coast
	var offset = (-7) * 60 * 60 * 1000;
	//get the date using the offset for proper date only portion
	console.log('now_local: ' + (new Date()).toString());
	var now = new Date( (new Date()).getTime() + offset );
	console.log('now_offset: ' + now.toString());
	var sql = 'CALL checkout_history (\'' 
		+ id + '\', \'' + JSON.stringify(now).substring(1,11) + '\')';
	console.info (sql);
	return sequelize.query(sql).then(function(result) {
		return result[0];
	});
};

module.exports.report = function() {
	return sequelize.query('CALL team_checkouts()').then(function(result) {
		console.info(moduleName, 'completed team checkout summary report.');
		return result;
	});
}

module.exports.close = function() {
	sequelize.close();
};