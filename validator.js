// validator.js
import validate from 'validate.js';

// Validation function for registration numbers
validate.validators.regNumber = (value, options, key, attributes) => {
    const regex = /^(CA|CY|CF|CAA)\d{3}-\d{3}$/;
    if (!regex.test(value)) {
        return 'is invalid';
    }
};

export { validate };
