import * as yup from 'yup'

export const validationSchemaForm = yup.object({
	currency: yup
		.string()
		.matches(/^[A-Z]{3}$/, 'Currency must be in three uppercase letters format for example: USD')
		.required('Currency is required'),
	balance: yup.number().required('Balance is required').min(0, 'Balance must be a positive number').typeError('Balance must be a number').moreThan(0, 'Balance must be greater than 0'),
});

export const transferValidationSchemaForm = yup.object({
	fromAccountId: yup.string().required('Account is required'),
	toAccountId: yup.string().required('Account is required'),
	amount: yup.number().required('Amount is required').min(0, 'Amount must be a positive number').typeError('Amount must be a number').moreThan(0, 'Amount must be greater than 0'),
});
