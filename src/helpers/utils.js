const lettersField = (val) => {
	const errors = [];
	if (val.length === 0) errors.push('This field must not be empty.');
	if (!/^[A-Za-z\s]*$/.test(val)) errors.push('This field can only contain letters.');
	return errors.length === 0;
};

const numbersField = (val) => {
	const errors = [];
	if (val.length === 0) errors.push('This field must not be empty.');
	if (!/^[0-9]*$/.test(val)) errors.push('This field can only contain numbers.');
	return errors.length === 0;
};

const lettersNumbersField = (val) => {
	const errors = [];
	if (val.length === 0) errors.push('This field must not be empty.');
	if (!/^[A-Za-z0-9\s]*$/.test(val)) errors.push('This field can only contain letter or numbers.');
	return errors.length === 0;
};

const emailField = (val) => {
	const errors = [];
	if (val.length === 0) errors.push('This field must not be empty.');
	if (!/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(val))
		errors.push('This field must be a valid email address.');
	return errors.length === 0;
};

module.exports = { lettersField, numbersField, lettersNumbersField, emailField };
