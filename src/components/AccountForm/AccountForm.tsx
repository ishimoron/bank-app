import { Box, Button, FormControl, FormErrorMessage, Input, Text } from '@chakra-ui/react'
import { useFormik } from 'formik'
import { FC, useEffect, useState } from 'react'
import { createAccount, getAccounts } from '../../services/accountService'
import { validationSchemaForm } from '../../utils/validationsSchemas'

interface AccountFormProps {
	setIsAccountUpdated: (value: boolean) => void
	isAccountUpdated: boolean
}

const AccountForm: FC<AccountFormProps> = ({ setIsAccountUpdated, isAccountUpdated }) => {
	const [nextOwnerId, setNextOwnerId] = useState<string | null>(null)

	const formik = useFormik({
		initialValues: {
			id: '',
			currency: '',
			balance: 0,
		},
		validationSchema: validationSchemaForm,
		onSubmit: (values, { resetForm }) => {
			createAccount(values)
			setIsAccountUpdated(true)
			resetForm()
		},
	})

	useEffect(() => {
		const getNextOwnerId = (): void => {
			getAccounts().then(data => {
				const maxId = data.reduce((max, account) => Math.max(max, parseInt(account.id)), 0)
				setNextOwnerId(String(maxId + 1))
			})
		}

		const updateFormOwnerId = (): void => {
			if (nextOwnerId !== null) {
				formik.setValues(values => ({
					...values,
					id: nextOwnerId,
				}))
			}
		}

		getNextOwnerId()
		updateFormOwnerId()
	}, [nextOwnerId, isAccountUpdated])

	return (
		<Box
			borderWidth='1px'
			rounded='lg'
			shadow='1px 1px 3px rgba(0,0,0,0.3)'
			maxWidth={800}
			p={6}
			my={5}>
			<form onSubmit={formik.handleSubmit}>
				<Text
					fontSize='2xl'
					fontWeight='bold'>
					Create new account
				</Text>

				<FormControl my={3}>
					<label>Owner ID</label>
					<Input
						type='text'
						name='ownerId'
						value={nextOwnerId ?? ''}
						readOnly
						variant='filled'
						onChange={formik.handleChange}
					/>
				</FormControl>

				<FormControl
					isInvalid={formik.touched.currency && !!formik.errors.currency}
					my={3}>
					<label htmlFor='currency'>Currency</label>
					<Input
						type='text'
						name='currency'
						id='currency'
						onChange={formik.handleChange}
						value={formik.values.currency}
						onBlur={formik.handleBlur}
					/>
					<FormErrorMessage>{formik.errors.currency}</FormErrorMessage>
				</FormControl>

				<FormControl
					isInvalid={formik.touched.balance && !!formik.errors.balance}
					my={3}>
					<label htmlFor='balance'>Balance</label>
					<Input
						type='number'
						name='balance'
						id='balance'
						onChange={formik.handleChange}
						value={formik.values.balance}
						onBlur={formik.handleBlur}
					/>
					<FormErrorMessage>{formik.errors.balance}</FormErrorMessage>
				</FormControl>

				<Button
					type='submit'
					variant='solid'
					colorScheme='blue'>
					Create Account
				</Button>
			</form>
		</Box>
	)
}

export default AccountForm
