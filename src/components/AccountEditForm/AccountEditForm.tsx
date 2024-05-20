import { Button, ButtonGroup, FormControl, FormErrorMessage, Input } from '@chakra-ui/react'
import { useFormik } from 'formik'
import { FC } from 'react'

import { AccountI } from '../../interfaces/account-i'
import { validationSchemaForm } from '../../utils/validationsSchemas'

interface AccountEditFormProps {
	account: AccountI
	onSave: (id: string, currency: string, balance: number) => void
	onCancel: () => void
}

const AccountEditForm: FC<AccountEditFormProps> = ({ account, onSave, onCancel }) => {
	const formik = useFormik({
		initialValues: {
			currency: account.currency,
			balance: account.balance,
		},
		validationSchema: validationSchemaForm,
		onSubmit: values => {
			onSave(account.id, values.currency, values.balance)
		},
	})

	return (
		<form onSubmit={formik.handleSubmit}>
			<FormControl
				isInvalid={formik.touched.currency && !!formik.errors.currency}
				my={3}>
				<label htmlFor='currency'>Currency</label>
				<Input
					placeholder='Currency'
					type='text'
					name='currency'
					id="currency"
					value={formik.values.currency}
					onChange={formik.handleChange}
					onBlur={formik.handleBlur}
				/>
				<FormErrorMessage>{formik.errors.currency}</FormErrorMessage>
			</FormControl>

			<FormControl
				isInvalid={formik.touched.balance && !!formik.errors.balance}
				my={3}>
				<label htmlFor='balance'>Balance</label>
				<Input
					placeholder='Balance'
					type='number'
					name='balance'
					id="balance"
					value={formik.values.balance}
					onChange={formik.handleChange}
					onBlur={formik.handleBlur}
				/>
				<FormErrorMessage>{formik.errors.balance}</FormErrorMessage>
			</FormControl>

			<ButtonGroup>
				<Button
					type='submit'
					colorScheme='teal'>
					Save
				</Button>
				<Button
					onClick={onCancel}
					variant='outline'
					colorScheme='orange'>
					Cancel
				</Button>
			</ButtonGroup>
		</form>
	)
}

export default AccountEditForm
