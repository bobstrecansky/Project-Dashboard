// assigners.js
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

// /Assigner REST Calls
// =============================================================================
// authenticate to the DB
var conString = "postgres://postgres:asdfjkl@localhost/postgres";
router.get('*', function(req, res) {
        pg.connect(conString, function(err, client, done) {
                if(err) {
                        return console.error('error fetching client from pool', err);
                }

		else{
                client.query('SELECT * from Assigner', function(err, result) {
                done(); //release the connection from the pool
                        if(err) {
                                return console.error('error running query', err);
                        }
                //create blank object and JSON format the response from the Postgres DB.
                res.send(prettyPrint(result));
                });
		}
        });
});

// POST
router.post('*', function(req, res) {
        var Assigners = req.body;
        res.json({ message: 'Assigner ' +req.body.assigner_id + ' added to the DB!' });
	pg.connect(conString, function(err, client, done) {
		if(err) {
                  return console.error('error fetching client from pool', err);
                }

              client.query('INSERT INTO assigner(assigner_id, employee_id, region_id) values(' +'\'' +req.body.assigner_id +'\'' + ', \''+ req.body.employee_id + '\'' + ', \''+ req.body.region_id + '\');', function(err, result) {

			done(); //release the connection from the pool
	      		if(err){
                    		return console.error('error running POST', err);
              		}
		});
	});
});
module.exports = router;
