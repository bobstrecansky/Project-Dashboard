// pr.js
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

// PUT {UPDATE}
router.put('/:peer_review_id', function(req, res) {

    var Region = req.body;
    res.json({ message: 'Peer Review ' +req.body.peer_review_id + ' Updated!' });

    pg.connect(conString, function(err, client, done) {
        if(err) {
            return console.error('error fetching client from pool', err);
        }

client.query("UPDATE PeerReview set peer_review_id =" + req.body.peer_review_id + ", employee_id= " + req.body.employee_id + ", reviewer_id= " + req.body.reviewer_id + ", region_id = " + req.body.region_id + ", project_link =" +req.body.project_link + ",act_link =" +req.body.act_link + ", customer_name =" +req.body.customer_name + ", config_name =" + req.body.config_name + ", config_version = " + req.body.config_version + ", description = " + req.body.description + ", projected_loe = " + req.body.projected_loe + ", priority = " + req.body.priority + ", requested_date = " +req.body.requested_date + ", filled_date = " + req.body.filled_date + ", completed_date = " + req.body.completed_date + ", actual_loe = " +req.body_actual_loe + ", skill_pri = " + req.body.skill_pri + ", skill_sec = " + req.body.skill_sec + ", skill_ter = " + req.body.skill_ter + " WHERE peer_review_id= \'" + req.body.peer_review_id + "\'", function(err, result) {

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

			            
		client.query('SELECT * from PeerReview', function(err, result) {
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

                        client.query('select peerreview.*, skills.name from peerreview left outer join skills on peerreview.skill_pri = skills.skill_id where completed_date = ' + '\'' + '1970-01-01 00:00:00' + '\'' + 'AND filled_date = ' + '\'' + '1970-01-01 00:00:00' + '\'', function(err, result) {
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

                        client.query('select peerreview.*, skills.name from peerreview left outer join skills on peerreview.skill_pri = skills.skill_id where completed_date = ' + '\'' + '1970-01-01 00:00:00' + '\'' + 'AND filled_date !=' + '\'' + '1970-01-01 00:00:00' + '\'', function(err, result) {
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

                        client.query('select peerreview.*, skills.name from peerreview left outer join skills on peerreview.skill_pri = skills.skill_id where completed_date !=' + '\'' + '1970-01-01 00:00:00' + '\'' + 'AND filled_date != ' + '\'' + '1970-01-01 00:00:00' + '\'', function(err, result) {
			done();
			res.send(prettyPrint(result));
                        });
        });
});

router.get('/:peer_review_id', function(req, res) {
        pg.connect(conString, function(err, client, done) {
                if(err) {
                        return console.error('error fetching client from pool', err);
                }

                        client.query('SELECT * from PeerReview where peer_review_id = ' + '\'' + req.params.peer_review_id + '\'', function(err, result) {
			done();
			res.send(prettyPrint(result));
                        });
        });
});


// POST {CREATE}
router.post('*', function(req, res) {
        var Regions = req.body;
        res.json({ message: 'PR ' +req.body.peer_review_id + ' added to the DB!' });
	pg.connect(conString, function(err, client, done) {
		if(err) {
                  return console.error('error fetching client from pool', err);
                }

client.query('INSERT into PeerReview(peer_review_id, employee_id, reviewer_id, region_id, project_link, act_link, customer_name, config_name, config_version, description, projected_loe, priority, requested_date, filled_date, completed_date, actual_loe, skill_pri, skill_sec, skill_ter) values(' + '\'' + req.body.peer_review_id + '\'' + ',' + '\'' +req.body.employee_id + '\'' + ',' + '\'' + req.body.reviewer_id + '\'' + ',' + '\'' + req.body.region_id + '\'' + ',' +'\'' + req.body.project_link + '\'' + ',' + '\'' + req.body.act_link + '\'' + ',' + '\'' + req.body.customer_name + '\'' + ',' + '\'' + req.body.config_name + '\'' + ',' + '\'' + req.body.config_version  + '\'' + ',' + '\'' + req.body.description + '\'' + ',' + '\'' + req.body.projected_loe + '\'' + ',' + '\'' + req.body.priority + '\'' + ',' + '\'' + req.body.requested_date + '\'' + ',' + '\'' + req.body.filled_date + '\'' + ',' + '\'' + req.body.completed_date + '\'' + ',' + '\'' + req.body.actual_loe + '\'' + ',' + '\'' + req.body.skill_pri + '\'' + ',' + '\'' + req.body.skill_sec + '\'' + ',' + '\'' + req.body.skill_ter + '\');', function(err, result) {
        done();
        res.send(prettyPrint(result));
            if(err) {
                return console.error('error running query', err);
                res.send(prettyPrint(result));
            }
        });
    });
});

module.exports = router;
