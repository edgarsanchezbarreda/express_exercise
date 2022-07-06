const express = require('express');
const ExpressError = require('./error');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ############################

// const integerArray = (arr) => {
// 	arr.split(',').map(function(item) {
// 		return parseInt(item, 10);
// 	});
// };

const average = (array) => array.reduce((a, b) => a + b) / array.length;

app.get('/', (req, res) => {
	return res.send('Hello World');
});

app.get('/mean', function mean(req, res, next) {
	let queryArray = req.query.nums.split(',').map(function(item) {
		return parseInt(item, 10);
	});

	let avg = average(queryArray);

	console.log(req.query);
	console.log(req.query.nums);
	console.log(queryArray);
	console.log(avg);
	try {
		if (!avg || req.query != nums) {
			throw new ExpressError('Invalid query.', 404);
		}
		return res.json({
			response: {
				operation: 'mean',
				value: avg
			}
		});
	} catch (e) {
		return next(e);
	}
});

// Error Handling
app.use((req, res, next) => {
	const e = new ExpressError('Page Not Found', 404);
	next(e);
});

app.use((error, req, res, next) => {
	let status = error.status || 500;
	let message = error.msg;

	return res.status(status).json({
		error: { message, status }
	});
});

app.listen(3000, () => {
	console.log('App on port 3000');
});
