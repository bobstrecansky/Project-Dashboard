// backups.js
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
router.put('/:backup_id', function(req, res) {

    var Region = req.body;
    res.json({ message: 'Backup ' +req.body.backup_id + ' Updated!' });

    pg.connect(conString, function(err, client, done) {
        if(err) {
            return console.error('error fetching client from pool', err);
        }

client.query("UPDATE Backup set backup_id =" + req.body.backup_id + ", employee_id= " + req.body.employee_id + ", backup_employee_id= " + req.body.backup_employee_id + ", region_id = " + req.body.region_id + ", project_link =" +req.body.project_link + ", customer_name =" +req.body.customer_name + ", description = " + req.body.description + ", projected_loe = " + req.body.projected_loe + ", start_date = " + req.body.start_date + ", end_date = " + req.body.end_date + ", requested_date = " +req.body.requested_date + ", filled_date = " + req.body.filled_date + ", completed_date = " + req.body.completed_date + ", actual_loe = " +req.body_actual_loe + ", skill_pri = " + req.body.skill_pri + ", skill_sec = " + req.body.skill_sec + ", skill_ter = " + req.body.skill_ter + " WHERE backup_id= \'" + req.body.backup_id + "\'", function(err, result) {

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

			            
		client.query('SELECT * from Backup', function(err, result) {
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

                        client.query('SELECT * from Backup where completed_date = \'1970-01-01 00:00:00\' AND filled_date = \'1970-01-01 00:00:00\'', function(err, result) {
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

                        client.query('SELECT * from Backup where completed_date = \'1970-01-01 00:00:00\' AND filled_date != \'1970-01-01 00:00:00\'', function(err, result) {
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

                        client.query('SELECT * from Backup where completed_date != \'1970-01-01 00:00:00\' AND filled_date != \'1970-01-01 00:00:00\'', function(err, result) {
			done();
			res.send(prettyPrint(result));
                        });
        });
});

router.get('/:backup_id', function(req, res) {
        pg.connect(conString, function(err, client, done) {
                if(err) {
                        return console.error('error fetching client from pool', err);
                }

                        client.query('SELECT * from Backup where backup_id = ' + '\'' + req.params.backup_id + '\'', function(err, result) {
			done();
			res.send(prettyPrint(result));
                        });
        });
});

router.get('/:employee_id/backups/owner', function(req, res) {
        pg.connect(conString, function(err, client, done) {
                if(err) {
                        return console.error('error fetching client from pool', err);
                }

                        client.query('select Employee.name, backup.backup_employee_id from backup LEFT OUTER JOIN employee on Employee.employee_id = backup.backup_employee_id where backup.start_date < CURRENT_TIMESTAMP AND backup.backup_employee_id = ' + '\'' +req.params.employee_id + '\'', function(err, result) {
			done();
                        res.send(prettyPrint(result));
                        });
        });
});

router.get('/:employee_id/backups/reviewer', function(req, res) {
        pg.connect(conString, function(err, client, done) {
                if(err) {
                        return console.error('error fetching client from pool', err);
                }

                        client.query('select Employee.name, backup.employee_id from backup LEFT OUTER JOIN employee on Employee.employee_id = backup.employee_id where backup.start_date < CURRENT_TIMESTAMP AND backup.employee_id = ' + '\'' +req.params.employee_id + '\'', function(err, result) {
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

client.query('INSERT into Backup(backup_id, employee_id, backup_employee_id, region_id, project_link, customer_name, description, projected_loe, start_date, end_date, requested_date, filled_date, completed_date, actual_loe, skill_pri, skill_sec, skill_ter) values(' + '\'' + req.body.backup_id + '\'' + ',' + '\'' +req.body.employee_id + '\'' + ',' + '\'' + req.body.backup_employee_id + '\'' + ',' + '\'' + req.body.region_id + '\'' + ',' +'\'' + req.body.project_link + '\'' + ',' + '\'' + req.body.customer_name + '\'' + ',' + '\'' + req.body.description + '\'' + ',' + '\'' + req.body.projected_loe + '\'' + ',' + '\'' + req.body.start_date + '\'' + ',' + '\'' + req.body.end_date + '\'' + ',' + '\'' + req.body.requested_date + '\'' + ',' + '\'' + req.body.filled_date + '\'' + ',' + '\'' + req.body.completed_date + '\'' + ',' + '\'' + req.body.actual_loe + '\'' + ',' + '\'' + req.body.skill_pri + '\'' + ',' + '\'' + req.body.skill_sec + '\'' + ',' + '\'' + req.body.skill_ter + '\');', function(err, result) {

        done();
            if(err) {
                return console.error('error running query', err);
                res.send(prettyPrint(result));
            }
        });
    });
});

module.exports = router;
