const express = require('express');
const app = express();
const ExpressError = require('./error');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ############################

const average = (array) => array.reduce((a, b) => a + b) / array.length;

const medianValue = (arr) => {
	const mid = Math.floor(arr.length / 2),
		nums = [
			...arr
		].sort((a, b) => a - b);
	return arr.length % 2 !== 0 ? nums[mid] : (nums[mid - 1] + nums[mid]) / 2;
};

const modeValue = (arr) => {
	const mode = {};
	let max = 0,
		count = 0;

	for (let i = 0; i < arr.length; i++) {
		const item = arr[i];

		if (mode[item]) {
			mode[item]++;
		} else {
			mode[item] = 1;
		}

		if (count < mode[item]) {
			max = item;
			count = mode[item];
		}
	}

	return max;
};

app.get('/', (req, res) => {
	return res.send('Hello World');
});

app.get('/mean', function mean(req, res, next) {
	let queryArray = req.query.nums.split(',');
	let validNums = [];

	for (let i = 0; i < queryArray.length; i++) {
		let num = Number(queryArray[i]);

		if (Number.isNaN(num)) {
			return new ExpressError(`${num} is not a number.`);
		}
		validNums.push(num);
	}
	let avg = average(validNums);

	if (!req.query.nums) {
		throw new ExpressError('Nums are required.', 400);
	}
	let finalResult = {
		operation: 'mean',
		value: avg
	};
	return res.send(finalResult);
});

app.get('/median', function median(req, res, next) {
	let queryArray = req.query.nums.split(',');
	let validNums = [];

	for (let i = 0; i < queryArray.length; i++) {
		let num = Number(queryArray[i]);

		if (Number.isNaN(num)) {
			return new ExpressError(`${num} is not a number.`);
		}
		validNums.push(num);
	}
	let med = medianValue(validNums);

	if (!req.query.nums) {
		throw new ExpressError('Nums are required.', 400);
	}
	let finalResult = {
		operation: 'median',
		value: med
	};
	return res.send(finalResult);
});

app.get('/mode', function mode(req, res, next) {
	let queryArray = req.query.nums.split(',');
	let validNums = [];

	for (let i = 0; i < queryArray.length; i++) {
		let num = Number(queryArray[i]);

		if (Number.isNaN(num)) {
			return new ExpressError(`${num} is not a number.`);
		}
		validNums.push(num);
	}
	let modeResult = modeValue(validNums);

	if (!req.query.nums) {
		throw new ExpressError('Nums are required.', 400);
	}
	let finalResult = {
		operation: 'mode',
		value: modeResult
	};
	return res.send(finalResult);
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
