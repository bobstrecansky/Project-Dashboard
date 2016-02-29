// employees.js
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

// [START] Employees REST Calls {CRUD}
// =============================================================================

// authenticate to the DB
var conString = "postgres://postgres:asdfjkl@localhost/postgres";

// Employees PUT {UPDATE}
router.put('*', function(req, res) {

    var Employee = req.body;
    res.json({ message: 'Employee ' +req.body.ldap + ' Updated!' });

    pg.connect(conString, function(err, client, done) {
        if(err) {
            return console.error('error fetching client from pool', err);
        }

client.query("UPDATE employee set employee_id =" + req.body.employee_id + ", title_id= " + req.body.title_id + ", name= \'"+ req.body.ldap+ "\', phone_extension= \'" +req.body.phone_primary + "\', phone_secondary= \'" +req.body.phone_secondary + "\', city= \'"+ req.body.city + "\', state= \'" + req.body.state + "\', country= \'" + req.body.country + "\', work_hours_begin= \'" + req.body.work_hours_begin + "\', work_hours_end= \'" + req.body.work_hours_end + "\', start_date= \'" + req.body.start_date + "\', birth_date= \'" + req.body.birth_date + "\', end_date=\'" + req.body.end_date + "\' WHERE ldap= \'" + req.body.ldap + "\'", function(err, result) {

        done(); //release the connection from the pool

        if(err){
            return console.error('error running PUT', err);
        }

        });
    });
});

// Employees Delete {DELETE}
router.delete('*', function(req, res) {
    var Employee = req.body;
    res.json({ message: 'Employee ' +req.body.ldap + ' Deleted!' });
    pg.connect(conString, function(err, client, done) {
        if(err) {
            return console.error('error fetching client from pool', err);
        }

	client.query("DELETE from employee where ldap =" +'\'' +req.body.ldap +'\'', function(err,result) {
        done(); //release the connection from the pool

        if(err){
            return console.error('error running DELETE', err);
        }

        });
    });
});

// POST {CREATE}
router.post('/', function(req, res) {

    res.json({ message: 'Employee ' +req.body.ldap + ' added to the DB!' });

    pg.connect(conString, function(err, client, done) {
        if(err) {
            return console.error('error fetching client from pool', err);
        }

        client.query('INSERT INTO employee(title_id, name, ldap, phone_extension, phone_primary, phone_secondary, city, state, country, work_hours_begin, work_hours_end, start_date, birth_date) values('+ '\'' + req.body.title_id + '\'' + ',' + '\'' + req.body.name + '\'' + ',' + '\'' + req.body.ldap + '\'' + ',' + '\'' + req.body.phone_extension + '\'' + ',' + '\'' + req.body.phone_primary + '\'' + ',' + '\'' + req.body.phone_secondary + '\'' + ',' + '\'' + req.body.city + '\'' + ',' + '\'' + req.body.state + '\'' + ',' + '\'' + req.body.country + '\'' + ',' + '\'' + req.body.work_hours_begin + '\'' + ',' + '\'' + req.body.work_hours_end + '\'' + ',' + '\'' + req.body.start_date + '\'' + ',' + '\'' + req.body.birth_date + '\')', function(err, result) {	
	done(); //release the connection from the pool
            if(err){
                return console.error('error running POST', err);
            }
        });
    });
});

// GET {READ}
router.get('/', function(req, res) {
    pg.connect(conString, function(err, client, done) {

        if(req.query.city){
            client.query('SELECT * from employee where city =' + '\'' + req.query.city + '\'', function(err, result) {
	    done();
            res.send(prettyPrint(result));
            });
        }
        else if(req.query.state){
            client.query('SELECT * from employee where state =' + '\'' + req.query.state + '\'', function(err, result) {
            done();
	    res.send(prettyPrint(result));
            });
        }
        else if(req.query.start_date){
            client.query('SELECT * from employee where start_date =' + '\'' + req.query.start_date + '\'', function(err, result) {
	    done();        
            res.send(prettyPrint(result));
            });
        }
        else if(req.query.work_hours_begin){
            client.query('SELECT * from employee where work_hours_begin =' + '\'' + req.query.work_hours_begin + '\'', function(err, result) {
            done();
	    res.send(prettyPrint(result));
            });
        }
        else if(req.query.work_hours_end){
            client.query('SELECT * from employee where work_hours_end =' + '\'' + req.query.work_hours_end + '\'', function(err, result) {
            done();
	    res.send(prettyPrint(result));
            });
        }
        else if(req.query.ldap){
	    
	    client.query('select EmployeeTitle.title, EmployeeTitle.title as Employee_title, Employee.* from Employee LEFT OUTER JOIN EmployeeTitle on Employee.title_id = EmployeeTitle.title_id where ldap = ' + '\'' + req.query.ldap + '\'' + 'ORDER BY Employee.name;', function(err, result) {
	    done();
            res.send(prettyPrint(result));
            });
        }

        else{
            client.query('select et.title, e.* from Employee e left outer join EmployeeTitle et on e.title_id = et.title_id ORDER BY e.name', function(err, result) {
	    done();            
	    res.send(prettyPrint(result));
            });
        }
        if(err){
            return console.error('error running query', err);
        }
        done();
    });
});

router.get('/birthday', function(req, res) {
        pg.connect(conString, function(err, client, done) {
                if(err) {
                        return console.error('error fetching client from pool', err);
                }

		var d = new Date();
		var m = (d.getMonth() + 1); 
		client.query('select name, birth_date from employee where EXTRACT(MONTH from employee.birth_date) <= EXTRACT(MONTH from CURRENT_DATE + interval' + '\'' + "7 days" + '\')', function(err, result) {
                done();
		res.send(prettyPrint(result));
                });
        });
});

router.get('/anniversary', function(req, res) {
        pg.connect(conString, function(err, client, done) {
                if(err) {
                        return console.error('error fetching client from pool', err);
                }

                var d = new Date();
                var m = (d.getMonth() + 1);
                client.query('select name, start_date from employee where EXTRACT(MONTH from employee.start_date) = EXTRACT(MONTH from CURRENT_DATE)', function(err, result) {
                done();
		res.send(prettyPrint(result));
                });
        });
});

router.get('/alerts', function(req, res) {
        pg.connect(conString, function(err, client, done) {
                if(err) {
                        return console.error('error fetching client from pool', err);
                }

                var d = new Date();
                var m = (d.getMonth() + 1);
                client.query('select * from alerts where start_date < CURRENT_TIMESTAMP and end_date > CURRENT_TIMESTAMP', function(err, result) {
                done();
		res.send(prettyPrint(result));
                });
        });
});

router.get('/titles', function(req, res) {
        pg.connect(conString, function(err, client, done) {
                if(err) {
                        return console.error('error fetching client from pool', err);
                }

                var d = new Date();
                var m = (d.getMonth() + 1);
                client.query('select * from EmployeeTitle', function(err, result) {
                done();
		res.send(prettyPrint(result));
                });
        });
});

router.get('/managers', function(req, res) {
        pg.connect(conString, function(err, client, done) {
                if(err) {
                        return console.error('error fetching client from pool', err);
                }

                client.query('select Employee.name, Employee.employee_id, employeetitle.title from employee LEFT OUTER JOIN employeetitle on Employee.title_id = employeetitle.title_id where employee.title_id BETWEEN 12 AND 14', function(err, result) {
                done();
                res.send(prettyPrint(result));
                });
        });
});

router.get('/architects', function(req, res) {
        pg.connect(conString, function(err, client, done) {
                if(err) {
                        return console.error('error fetching client from pool', err);
                }

                client.query('select Employee.name, employeetitle.title from employee LEFT OUTER JOIN employeetitle on Employee.title_id = employeetitle.title_id where employee.title_id BETWEEN 1 AND 5', function(err, result) {
                done();
                res.send(prettyPrint(result));
                });
        });
});

router.get('/tpms', function(req, res) {
        pg.connect(conString, function(err, client, done) {
                if(err) {
                        return console.error('error fetching client from pool', err);
                }

                client.query('select Employee.name, employeetitle.title from employee LEFT OUTER JOIN employeetitle on Employee.title_id = employeetitle.title_id where employee.title_id BETWEEN 6 AND 11', function(err, result) {
                done();
                res.send(prettyPrint(result));
                });
        });
});








router.get('/outofoffices/today', function(req, res) {
        pg.connect(conString, function(err, client, done) {
                if(err) {
                        return console.error('error fetching client from pool', err);
                }

                client.query('select outofoffice.ooo_id, Employee.name from outofoffice LEFT OUTER JOIN employee on Employee.employee_id = outofoffice.employee_id where outofoffice.start_date < CURRENT_DATE AND outofoffice.end_date > CURRENT_DATE', function(err, result) {
		done();
                res.send(prettyPrint(result));
                });
        });
});

router.get('/:ldap', function(req, res) {
    pg.connect(conString, function(err, client, done) {
        if(err) {
            return console.error('error fetching client from pool', err);
        }

        client.query('SELECT * from employee where ldap =' + '\'' + req.params.ldap + '\'', function(err, result) {
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

router.get('/:employee_id/peer-reviews/owner', function(req, res) {
        pg.connect(conString, function(err, client, done) {
                if(err) {
                        return console.error('error fetching client from pool', err);
                }

                client.query('SELECT Employee.name, peerreview.peer_review_id from peerreview LEFT OUTER JOIN employee on Employee.employee_id = peerreview.employee_id where completed_date < CURRENT_TIMESTAMP AND Employee.employee_id = ' + '\'' + req.params.employee_id + '\'', function(err, result) {
		done();                
		res.send(prettyPrint(result));
                });
        });
});

router.get('/:employee_id/peer-reviews/reviewer', function(req, res) {
        pg.connect(conString, function(err, client, done) {
                if(err) {
                        return console.error('error fetching client from pool', err);
                }

                client.query('SELECT Employee.name, peerreview.peer_review_id from peerreview LEFT OUTER JOIN employee on Employee.employee_id = peerreview.reviewer_id where completed_date < CURRENT_TIMESTAMP', function(err, result) {
                done();
		res.send(prettyPrint(result));
                });
        });
});

router.get('/:employee_id/resources/owner', function(req, res) {
        pg.connect(conString, function(err, client, done) {
                if(err) {
                        return console.error('error fetching client from pool', err);
                }

                client.query('SELECT Employee.name, resource.assigner_id from resource LEFT OUTER JOIN employee on Employee.employee_id = resource.assigner_id where completed_date < CURRENT_TIMESTAMP AND Employee.employee_id = ' + '\'' + req.params.employee_id + '\'', function(err, result) {
                done();
		res.send(prettyPrint(result));
                });
        });
});

router.get('/:employee_id/resources/reviewer', function(req, res) {
        pg.connect(conString, function(err, client, done) {
                if(err) {
                        return console.error('error fetching client from pool', err);
                }

                client.query('SELECT Employee.name, resource.assigned_employee_id from resource LEFT OUTER JOIN employee on Employee.employee_id = resource.assigned_employee_id where completed_date < CURRENT_TIMESTAMP', function(err, result) {
                done();
		res.send(prettyPrint(result));
                });
        });
});

module.exports = router;
