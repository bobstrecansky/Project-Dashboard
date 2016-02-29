
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

// /Region REST Calls
// =============================================================================
// authenticate to the DB
var conString = "postgres://postgres:asdfjkl@localhost/postgres";

// Region PUT {UPDATE}
router.put('*', function(req, res) {

    var Region = req.body;
    res.json({ message: 'Team ' +req.body.team_id + ' Updated!' });

    pg.connect(conString, function(err, client, done) {
        if(err) {
            return console.error('error fetching client from pool', err);
        }

client.query("UPDATE Team set team_id =" + req.body.team_id + ", manager_id= " + req.body.manager_id + ", name= " + req.body.name + ", mailing_list = " + req.body.mailing_list + "\' WHERE team_id= \'" + req.body.team_id + "\'", function(err, result) {

        done(); //release the connection from the pool

        if(err){
            return console.error('error running PUT', err);
        }

        });
    });
});

// Region DELETE {DELETE}
router.delete('/', function(req, res) {
    var Region = req.body;
    res.json({ message: 'Team ' +req.body.team_id + ' Deleted!' });
    pg.connect(conString, function(err, client, done) {
        if(err) {
            return console.error('error fetching client from pool', err);
        }

        client.query("DELETE from team where team_id =" +req.body.team_id, function(err,result) {
        done(); //release the connection from the pool

        if(err){
            return console.error('error running DELETE', err);
        }

        });
    });
});

router.delete('/:team_id/employees/:employee_id', function(req, res) {
    var Region = req.body;
    res.json({ message: 'Employee ' + req.params.employee_id + ' Deleted from Team ' +req.params.team_id });
    pg.connect(conString, function(err, client, done) {
        if(err) {
            return console.error('error fetching client from pool', err);
        }

        client.query("DELETE from EmployeeToTeam where team_id =" +'\'' +req.params.team_id +'\'' + 'AND employee_id = ' +'\'' +req.params.employee_id +'\'', function(err,result) {
        done(); //release the connection from the pool

        if(err){
            return console.error('error running DELETE', err);
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

		else if(req.query.team_id){
            		client.query('SELECT * from team where team_id =' + '\'' + req.query.team_id + '\'', function(err, result) {
                		res.send(prettyPrint(result));
            		});
        	}

		else{
                client.query('SELECT Employee.name as manager_name, team.* from team LEFT OUTER JOIN Employee on team.manager_id = employee.employee_id ORDER BY team.name', function(err, result) {
                done();
                        if(err) {
                                return console.error('error running query', err);
                        }
                //create blank object and JSON format the response from the Postgres DB.
                res.send(prettyPrint(result));
                });
		}
        });
});

router.get('/:team_id', function(req, res) {
        pg.connect(conString, function(err, client, done) {
                if(err) {
                        return console.error('error fetching client from pool', err);
                }

	client.query('select e.name as manager_name, e.ldap as manager_ldap, t.* from Team t left outer join Employee e on e.employee_id = t.manager_Id where t.team_id = ' + '\'' + req.params.team_id + '\'', function(err, result) {
        done();
        	if(err) {
                	return console.error('error running query', err);
                }
                //create blank object and JSON format the response from the Postgres DB.
                res.send(prettyPrint(result));
                });
	});
});

router.get('/:team_id/employees', function(req, res) {
    pg.connect(conString, function(err, client, done) {
        if(err) {
            return console.error('error fetching client from pool', err);
        }
        client.query('Select e.name, e.ldap, e.city, t.title, et.* from EmployeeToTeam et Left outer join Employee e ON et.employee_id = e.employee_id Left outer join EmployeeTitle t ON e.title_id = t.title_id Where et.team_id = ' + '\'' + req.params.team_id + '\'', function(err, result) {
        done();
            if(err) {
                return console.error('error running query', err);
            }
        res.send(prettyPrint(result));
        });
    });
});







// POST {CREATE}
router.post('/', function(req, res) {
    res.json({ message: 'Team ' +req.body.name + ' added to the DB!' });
    pg.connect(conString, function(err, client, done) {
        if(err) {
            return console.error('error fetching client from pool', err);
        }
        client.query('INSERT INTO team(manager_id, name, mailing_list) values(' + '\'' + req.body.manager_id + '\'' + ',' + '\'' + req.body.name + '\'' + ',' + '\'' + req.body.mailing_list + '\')', function(err, result) {
        done(); //release the connection from the pool
            if(err){
                return console.error('error running POST', err);
            }
        });
    });
});

router.post('/:team_id/employee', function(req, res) {
    res.json({ message: 'Employee ' + req.body.employee_id + ' Added to the Team ' +req.params.team_id + ' DB!' });
    pg.connect(conString, function(err, client, done) {
        if(err) {
            return console.error('error fetching client from pool', err);
        }
        client.query('INSERT INTO EmployeeToTeam (employee_id, team_id) values (' + req.body.employee_id + ',' + req.params.team_id + ')', function(err, result) {
        done(); //release the connection from the pool
            if(err){
                return console.error('error running POST', err);
            }
        });
    });
});















module.exports = router;
