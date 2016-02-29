// regions.js
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
router.put('/', function(req, res) {

    var Region = req.body;
    res.json({ message: 'Region ' +req.body.region_id + ' Updated!' });

    pg.connect(conString, function(err, client, done) {
        if(err) {
            return console.error('error fetching client from pool', err);
        }

client.query("UPDATE Region set region_id =" + req.body.region_id + ", manager_id= " + req.body.manager_id + ", assigner_id= " + req.body.assigner_id + ", lead_id= " + req.body.lead_id + "\', name= \'" +req.body.lead_id + "\', name= \'"+ req.body.name + "\', cmg_partner= \'" + req.body.cmg_partner + "\', tsg_partner= \'" + req.body.tsg_partner + "\', mailing_list= \'" + req.body.mailing_list + "\' WHERE region_id= \'" + req.body.region_id + "\'", function(err, result) {

        done(); //release the connection from the pool

        if(err){
            return console.error('error running PUT', err);
        }

        });
    });
});

router.put('/:region_id/assigner', function(req, res) {
    res.json({ message: 'Assigner for Region ' +req.params.region_id + ' Updated!' });
    pg.connect(conString, function(err, client, done) {
        if(err) {
            return console.error('error fetching client from pool', err);
        }
client.query("UPDATE Region set assigner_id  =" + req.body.assigner_id + ' WHERE region_id= ' + req.params.region_id, function(err, result) {
        done(); //release the connection from the pool

        if(err){
            return console.error('error running PUT', err);
        }

        });
    });
});

router.put('/:region_id/lead', function(req, res) {

    res.json({ message: 'Lead for Region ' +req.params.region_id + ' Updated!' });

    pg.connect(conString, function(err, client, done) {
        if(err) {
            return console.error('error fetching client from pool', err);
        }

client.query("UPDATE Region set lead_id  =" + req.body.lead_id + ' WHERE region_id= ' + req.params.region_id, function(err, result) {

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
    res.json({ message: 'Region ' +req.body.region_id + ' Deleted!' });
    pg.connect(conString, function(err, client, done) {
        if(err) {
            return console.error('error fetching client from pool', err);
        }

        client.query("DELETE from region where region_id =" +'\'' +req.body.region_id +'\'', function(err,result) {
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

		else if(req.query.region_id){
            		client.query('SELECT * from region where region_id =' + '\'' + req.query.region_id + '\'', function(err, result) {
                		res.send(prettyPrint(result));
            		});
        	}

		else{
                client.query('select e1.name as manager_name, e2.name as assigner_name, e3.name as lead_name, Region.* from Region left outer join Employee e1 on e1.employee_id = region.manager_id left outer join Employee e2 on e2.employee_id = region.assigner_id left outer join Employee e3 on e3.employee_id = region.lead_id ORDER BY Region.name', function(err, result) {
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

router.get('/:id', function(req, res) {
    pg.connect(conString, function(err, client, done) {
        if(err) {
            return console.error('error fetching client from pool', err);
        }
        client.query('select e.name as manager_name, e.ldap as manager_ldap, a.name as assigner_name, a.ldap as assigner_ldap, l.name as lead_name, l.ldap as lead_ldap, r.* from Region as r left outer join Employee as e on r.manager_id = e.employee_id left outer join Employee as a on r.assigner_id = a.employee_id left outer join Employee as l on r.lead_id = l.employee_id where r.region_id='  + req.params.id, function(err, result) {
        done();
            if(err) {
                return console.error('error running query', err);
            }
	res.send(prettyPrint(result));
        });
    });
});

router.get('/:region_id/employees', function(req, res) {
    pg.connect(conString, function(err, client, done) {
        if(err) {
            return console.error('error fetching client from pool', err);
        }
        client.query('Select e.name, e.ldap, e.city, t.title, er.* from EmployeeToRegion er Left outer join Employee e ON er.employee_id = e.employee_id Left outer join EmployeeTitle t ON e.title_id = t.title_id Where er.region_id = ' + '\'' + req.params.region_id + '\'', function(err, result) {
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
    res.json({ message: 'Region ' +req.body.name + ' added to the DB!' });
    pg.connect(conString, function(err, client, done) {
        if(err) {
            return console.error('error fetching client from pool', err);
        }
        client.query('INSERT INTO region(manager_id, assigner_id, lead_id, name, cmg_partner, tsg_partner, mailing_list) values(' + '\'' + req.body.manager_id + '\'' + ',' + '\'' + req.body.assigner_id + '\'' + ',' + '\'' + req.body.lead_id + '\'' + ',' + '\'' + req.body.name + '\'' + ',' + '\'' + req.body.cmg_partner + '\'' + ',' + '\'' + req.body.tsg_partner + '\'' + ',' + '\'' + req.body.mailing_list + '\')', function(err, result) {
        done(); //release the connection from the pool
            if(err){
                return console.error('error running POST', err);
            }
        });
    });
});

router.post('/:region_id/employees', function(req, res) {
    res.json({ message: 'Employee ' + req.body.employee_id + ' Added to the Region ' +req.params.region_id + ' DB!' });
    pg.connect(conString, function(err, client, done) {
        if(err) {
            return console.error('error fetching client from pool', err);
        }
        client.query('INSERT INTO EmployeeToRegion (employee_id, region_id) values (' + req.body.employee_id + ',' + req.params.region_id + ')', function(err, result) {
        done(); //release the connection from the pool
            if(err){
                return console.error('error running POST', err);
            }
        });
    });
});

router.delete('/:region_id/employees/:employee_id', function(req, res) {
    var Region = req.body;
    res.json({ message: 'Employee ' + req.params.employee_id + ' Deleted from Region ' +req.params.region_id });
    pg.connect(conString, function(err, client, done) {
        if(err) {
            return console.error('error fetching client from pool', err);
        }

        client.query('DELETE from EmployeeToRegion where region_id =' + req.params.region_id + ' AND employee_id = ' +req.params.employee_id, function(err,result) {
        done(); //release the connection from the pool

        if(err){
            return console.error('error running DELETE', err);
        }

        });
    });
});





















module.exports = router;
