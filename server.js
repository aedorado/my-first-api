// node modules
var express    = require('express');        
var app        = express();                 
var bodyParser = require('body-parser');
var mongoose   = require('mongoose');
var Request    = require('./app/models/request');

mongoose.connect('mongodb://localhost:27017/DipperAPI'); // connect to our database

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = process.env.PORT || 3000;        // set our port

// ROUTES FOR OUR API
// =============================================================================
var router = express.Router();		// get an instance of the express Router

router.route('/request')
    .get(function(req, res) {	    // accessed at GET http://localhost:3000/api/request

    	Request.find({connId: req.query.connId}, function(err, rec) {	// find item by id
    		if (rec.length == 0) {	// no such id
		    	var request   = new Request();	// create new instace
		    	request.connId    = req.query.connId;
		    	request.timeout   = req.query.timeout;
		    	request.active    = true;
		    	request.createdAt = new Date
		    	console.log(request.createdAt);

		    	request.save(function(err) {	// insert in to database
		            if (err) {	
		                res.send(err);
		            }
		            console.log({ message: 'Request created!' });
		        });

		        setTimeout(function() {
		        	res.json({status:"OK"});
		        }, req.query.timeout * 1000);
    		} else {
    			res.json({status: "Connection Id already exists " + req.query.connId});
    		}
    	});
    });

router.route('/serverStatus')
    .get(function(req, res) {	    // accessed at GET http://localhost:3000/api/request
    	var ctime = (new Date).getTime();	// get Epoch time

		Request.find({active: true}, function(err, activeReq) {	// only active requests considered

			var result = [];

			for (i = 0; i < activeReq.length; i++) {
				// console.log(activeReq[i].createdAt.getTime(), activeReq[i].timeout*1000);
				if (ctime < activeReq[i].createdAt.getTime() + activeReq[i].timeout*1000) {
					var id = activeReq[i].connId;
					var timeleft = Math.floor(((activeReq[i].createdAt.getTime() + activeReq[i].timeout*1000) - ctime) / 1000);
					var o = {
						id: id,
						timeleft: timeleft
					};
					result.push(o);
				}
			}
			res.json(result);
		});	
    });

router.route('/kill')
    .put(function(req, res) {	    // accessed at GET http://localhost:3000/api/request

    	Request.find({connId: req.query.connId}, function(err, rec) {	// find item by id
    		if (rec.length == 0) {	// no such id
    			res.json({status: "Invalid connection Id " + req.query.connId});
    		} else {
    			Request.update({connId: req.query.connId}, {$set: { active: false }}, function(err) {
    				if (err) {
    					console.log('An error occured.');
    				} else {
    					res.json({"status":"ok"});
    				}
    			});
    		}
    	});

    });

app.use('/api', router);	// all of our routes will be prefixed with /api


// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Server started.');
