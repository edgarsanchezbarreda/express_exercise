const express = require('express');
const app = express();
const ExpressError = require('./error');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ############################

const average = (array) => array.reduce((a, b) => a + b) / array.length;

app.get('/', (req, res) => {
	return res.send('Hello World');
});

app.get('/mean', function mean(req, res, next) {
	let queryArray = req.query.nums.split(',').map(function(item) {
		return parseInt(item, 10);
	});
	let avg = average(queryArray);
	console.log(res);

	if (queryArray.includes(NaN)) {
		const nonNumber = queryArray.find((n) => n === NaN);
		throw new ExpressError(`${nonNumber} is not a number.`, 400);
	}
	return res.json({
		response: {
			operation: 'mean',
			value: avg
		}
	});
});

// Error Handling
app.use(function(req, res, next) {
	const err = new ExpressError('Not Found', 404);

	// pass the error to the next piece of middleware
	return next(err);
});

/** general error handler */

app.use(function(err, req, res, next) {
	res.status(err.status || 500);

	return res.json({
		error: err,
		message: err.message
	});
});

app.listen(3000, () => {
	console.log('App on port 3000');
});
