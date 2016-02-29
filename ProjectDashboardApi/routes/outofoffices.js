// ooo.js
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

// GET {READ}
router.get('/', function(req, res) {
        pg.connect(conString, function(err, client, done) {
                if(err) {
                        return console.error('error fetching client from pool', err);
                }

                client.query('select OutOfOffice.name, outofofficetype.name AS ooo_type, outofofficetype.ooo_type_id, outofoffice.ooo_availability_id, OutOfOffice.start_date, OutOfOffice.end_date from OutOfOffice LEFT OUTER JOIN outofofficetype on Outofoffice.ooo_type_id = outofofficetype.ooo_type_id', function(err, result) {
                        done();
                        res.send(prettyPrint(result));
                });

        });
});

router.get('/today', function(req, res) {
        pg.connect(conString, function(err, client, done) {
                if(err) {
                        return console.error('error fetching client from pool', err);
                }

                client.query('select OutOfOffice.name, outofofficetype.name AS ooo_type, OutOfOffice.start_date, OutOfOffice.end_date from OutOfOffice LEFT OUTER JOIN outofofficetype on Outofoffice.ooo_type_id = outofofficetype.ooo_type_id WHERE OutOfOffice.start_date <= CURRENT_DATE AND OutOfOffice.end_date >= CURRENT_DATE', function(err, result) {
                        done();
                        res.send(prettyPrint(result));
                });

        });
});

router.get('/region', function(req, res) {
        pg.connect(conString, function(err, client, done) {
                if(err) {
                        return console.error('error fetching client from pool', err);
                }

                client.query('select Employee.name, EmployeeToRegion.region_id from EmployeeToRegion LEFT OUTER JOIN Employee on Employee.employee_id = EmployeeToRegion.employee_id', function(err, result) {
                        done();
                        res.send(prettyPrint(result));
                });

        });
});

router.get('/teams/:team_id', function(req, res) {
    pg.connect(conString, function(err, client, done) {
        if(err) {
            return console.error('error fetching client from pool', err);
        }

        client.query('SELECT e.name as employee_name, e.city, et.team_id, o.* FROM OutOfOffice AS o LEFT OUTER JOIN Employee e ON e.employee_id = o.employee_id LEFT OUTER JOIN EmployeeToTeam et ON et.employee_id = o.employee_id WHERE et.team_id =' + req.params.team_id, function(err, result) {
        done();
        res.send(prettyPrint(result));
            if(err) {
                return console.error('error running query', err);
                done();
                res.send(prettyPrint(result));
            }
        });
    });
});

router.get('/employees/:ldap', function(req, res) {
    pg.connect(conString, function(err, client, done) {
        if(err) {
            return console.error('error fetching client from pool', err);
        }

        client.query('select outofoffice.name, outofoffice.ooo_id, outofoffice.description, outofoffice.start_date, outofoffice.end_date, outofoffice.ooo_type_id, outofoffice.ooo_availability_id from outofoffice LEFT OUTER JOIN employee on employee.employee_id = outofoffice.employee_id where employee.ldap=' + '\'' + req.params.ldap + '\'', function(err, result) {
        done();
        res.send(prettyPrint(result));
            if(err) {
                return console.error('error running query', err);
                done();
                res.send(prettyPrint(result));
            }
        });
    });
});

router.get('/regions/:region_id', function(req, res) {
    pg.connect(conString, function(err, client, done) {
        if(err) {
            return console.error('error fetching client from pool', err);
        }
        client.query('SELECT e.name as employee_name, e.city, er.region_id, o.* FROM OutOfOffice AS o LEFT OUTER JOIN Employee e ON e.employee_id = o.employee_id LEFT OUTER JOIN EmployeeToRegion er ON er.employee_id = o.employee_id WHERE er.region_id =' + req.params.region_id, function(err, result) {
        done();
        res.send(prettyPrint(result));
            if(err) {
                return console.error('error running query', err);
                done();
                res.send(prettyPrint(result));
            }
        });
    });
});

router.get('/types', function(req, res) {
    pg.connect(conString, function(err, client, done) {
        if(err) {
            return console.error('error fetching client from pool', err);
        }

        client.query('select name, ooo_type_id from outofofficetype', function(err, result) {
        done();
        res.send(prettyPrint(result));
            if(err) {
                return console.error('error running query', err);
                done();
                res.send(prettyPrint(result));
            }
        });
    });
});

router.get('/availabilities', function(req, res) {
    pg.connect(conString, function(err, client, done) {
        if(err) {
            return console.error('error fetching client from pool', err);
        }

        client.query('select name, ooo_availability_id from outofofficeavailability', function(err, result) {
        done();
        res.send(prettyPrint(result));
            if(err) {
                return console.error('error running query', err);
                done();
                res.send(prettyPrint(result));
            }
        });
    });
});

// POST {CREATE}
router.post('/', function(req, res) {

    res.json({ message: 'Out of Office for ' +req.body.name + ' added to the DB!' });

    pg.connect(conString, function(err, client, done) {
        if(err) {
            return console.error('error fetching client from pool', err);
        }

client.query('INSERT INTO OutOfOffice (employee_id, ooo_type_id, ooo_availability_id, name, description, start_date, end_date) values(' + '\'' + req.body.employee_id + '\'' + ',' + '\'' + req.body.ooo_type_id + '\'' + ',' + '\'' + req.body.ooo_availability_id + '\'' + ',' + '\'' + req.body.name + '\'' + ',' + '\'' + req.body.description + '\'' + ',' + '\'' + req.body.start_date + '\'' + ',' + '\'' + req.body.end_date + '\')', function(err, result) {
        done(); //release the connection from the pool
            if(err){
                return console.error('error running POST', err);
            }
        });
    });
});

// Out of Office Delete {DELETE}
router.delete('/:ooo_id', function(req, res) {
    var Employee = req.body;
    res.json({ message: 'Out Of Office ' +req.params.ooo_id + ' Deleted!' });
    pg.connect(conString, function(err, client, done) {
        if(err) {
            return console.error('error fetching client from pool', err);
        }

        client.query("DELETE from outofoffice where ooo_id =" +'\'' +req.params.ooo_id +'\'', function(err,result) {
        done(); //release the connection from the pool

        if(err){
            return console.error('error running DELETE', err);
        }

        });
    });
});


















module.exports = router;
