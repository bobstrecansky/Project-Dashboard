// resources.js
var express = require('express');
var pg      = require('pg');        // postgres database caller
var router = express.Router();

// pretty print an object to formatted JSON
function prettyPrint(a){
    var objToJson = { };
    objToJson = a.rows;
    apiOut = JSON.stringify(objToJson);
    return apiOut;
}

// REST Calls
// =============================================================================
// authenticate to the DB
var conString = "postgres://postgres:asdfjkl@localhost/postgres";

// Region PUT {UPDATE}
router.put('/:resource', function(req, res) {

    res.json({ message: 'Resource ' +req.body.resource_id + ' Updated!' });

    pg.connect(conString, function(err, client, done) {
        if(err) {
            return console.error('error fetching client from pool', err);
        }

client.query("UPDATE Resource set resource_id =" + req.body.resource_id + ", assigner_id= " + req.body.assigner_id + ", assigned_employee_id= " + req.body.assigned_employee_id + ", region_id = " + req.body.region_id + ", salesforce_link =" +req.body.salesforce_link + ", akamai_poc =" +req.body.akamai_poc + ", customer_name = " + req.body.customer_name + ", start_date = " + req.body.start_date + ", end_date = " + req.body.end_date + ", description = " + req.body.description + ", projected_loe = " +req.body.projected_loe + ", severity = " + req.body.severity + ", requested_date = " + req.body.requested_date + ", filled_date = " +req.body_filled_date + ", completed_date = " + req.body.completed_date + ", actual_loe = " + req.body.actual_loe + ", skill_pri = " + req.body.skill_pri + ", skill_sec = " + req.body.skill_sec + ", skill_ter = " + req.body.skill_ter + " WHERE resource_id= \'" + req.body.resource_id + "\'", function(err, result) {

        done(); //release the connection from the pool

        if(err){
            return console.error('error running PUT', err);
        }

        });
    });
});

// GET {READ}
router.get('/', function(req, res) {
        pg.connect(conString, function(err, client, done) {
                if(err) {
                        return console.error('error fetching client from pool', err);
                }
			            
		client.query('SELECT * from Resource', function(err, result) {
		done();
                res.send(prettyPrint(result));
            	});
	});
});

router.get('/open', function(req, res) {
        pg.connect(conString, function(err, client, done) {
                if(err) {
                        return console.error('error fetching client from pool', err);
                }

                        client.query('SELECT * from Resource where completed_date = \'1970-01-01 00:00:00\' AND filled_date = \'1970-01-01 00:00:00\'', function(err, result) {
			done();
                        res.send(prettyPrint(result));
                        });
        });
});

router.get('/active', function(req, res) {
        pg.connect(conString, function(err, client, done) {
                if(err) {
                        return console.error('error fetching client from pool', err);
                }

                        client.query('SELECT * from Resource where completed_date = \'1970-01-01 00:00:00\' AND filled_date != \'1970-01-01 00:00:00\'', function(err, result) {
			done();
                        res.send(prettyPrint(result));
                        });
        });
});

router.get('/closed', function(req, res) {
        pg.connect(conString, function(err, client, done) {
                if(err) {
                        return console.error('error fetching client from pool', err);
                }

                        client.query('SELECT * from Resource where completed_date != \'1970-01-01 00:00:00\' AND filled_date != \'1970-01-01 00:00:00\'', function(err, result) {
			done();
			res.send(prettyPrint(result));
                        });
        });
});

router.get('/:resource_id', function(req, res) {
        pg.connect(conString, function(err, client, done) {
                if(err) {
                        return console.error('error fetching client from pool', err);
                }

                        client.query('SELECT * from Resource where resource_id = ' + req.params.resource_id, function(err, result) {
			done();
			res.send(prettyPrint(result));
                        });
        });
});


// POST {CREATE}
router.post('*', function(req, res) {
        var Regions = req.body;
        res.json({ message: 'Backup ' +req.body.backup + ' added to the DB!' });
	pg.connect(conString, function(err, client, done) {
		if(err) {
                  return console.error('error fetching client from pool', err);
                }

client.query('INSERT into Resource(resource_id, assigner_id, assigned_employee_id, region_id, salesforce_link, akamai_poc, customer_name, start_date, end_date, description, projected_loe, severity, requested_date, filled_date, completed_date, actual_loe, skill_pri, skill_sec, skill_ter) values(' + '\'' + req.body.resource_id + '\'' + ',' + '\'' +req.body.assigner_id + '\'' + ',' + '\'' + req.body.assigned_employee_id + '\'' + ',' + '\'' + req.body.region_id + '\'' + ',' +'\'' + req.body.salesforce_link + '\'' + ',' + '\'' + req.body.akamai_poc + '\'' + ',' + '\'' + req.body.customer_name + '\'' + ',' + '\'' + req.body.start_date + '\'' + ',' + '\'' + req.body.end_date + '\'' + ',' + '\'' + req.body.description + '\'' + ',' + '\'' + req.body.projected_loe + '\'' + ',' + '\'' + req.body.severity + '\'' + ',' + '\'' + req.body.requested_date + '\'' + ',' + '\'' + req.body.filled_date + '\'' + ',' + '\'' + req.body.completed_date + '\'' + ',' + '\'' + req.body.actual_loe + '\'' + ',' + '\'' + req.body.skill_pri + '\'' + ',' + '\'' + req.body.skill_sec + '\'' + ',' + '\'' + req.body.skill_ter + '\');', function(err, result) {

        done();
            if(err) {
                return console.error('error running query', err);
                res.send(prettyPrint(result));
            }
        });
    });
});

module.exports = router;
