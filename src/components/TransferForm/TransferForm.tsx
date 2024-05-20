import { Box, Button, FormControl, FormErrorMessage, Input, Select } from '@chakra-ui/react'
import { useFormik } from 'formik'
import { FC, useEffect, useState } from 'react'
import { AccountI } from '../../interfaces/account-i'
import { TransferFormValues } from '../../interfaces/form-i'
import { getAccounts, updateAccount } from '../../services/accountService'
import { transferValidationSchemaForm } from '../../utils/validationsSchemas'

interface TransferFormProps {
	isAccountUpdated: boolean
	setIsAccountUpdated: (value: boolean) => void
}

const TransferForm: FC<TransferFormProps> = ({ setIsAccountUpdated, isAccountUpdated }) => {
	const [accountsForTransfer, setAccountForTransfer] = useState<AccountI[]>([])

	const formik = useFormik({
		initialValues: {
			fromAccountId: '',
			toAccountId: '',
			amount: 0,
		},
		validationSchema: transferValidationSchemaForm,
		onSubmit: (values, { resetForm }) => {
			transferMoney(values)
			resetForm({ values: { ...values, amount: 0 } })
		},
	})

	const findAccountById = (accountId: string, accounts: AccountI[]): AccountI | undefined => {
		return accounts.find(({ id }) => id === accountId)
	}

	const processTransaction = (fromAccount: AccountI, toAccount: AccountI, amount: number): void => {
		if (fromAccount.balance >= amount) {
			fromAccount.balance -= amount
			toAccount.balance += amount

			updateAccount(fromAccount.id, fromAccount)
			updateAccount(toAccount.id, toAccount)

			setIsAccountUpdated(true)
		} else {
			alert('Insufficient balance')
		}
	}

	const transferMoney = (values: TransferFormValues): void => {
		const { amount, fromAccountId, toAccountId } = values
		const fromAccount = findAccountById(fromAccountId, accountsForTransfer)
		const toAccount = findAccountById(toAccountId, accountsForTransfer)

		if (fromAccount === toAccount) {
			alert('You can not transfer money to the same account')
			return
		}

		if (!fromAccount || !toAccount) {
			alert('Account not found')
			return
		}

		processTransaction(fromAccount, toAccount, amount)
	}

	useEffect(() => {
		const fetchAccountsData = async (): Promise<void> => {
			try {
				const data = await getAccounts()
				setAccountForTransfer(data)
			} catch (error) {
				console.error('Error fetching accounts:', error)
			}
		}

		fetchAccountsData()
	}, [isAccountUpdated])

	const SelectAccount = ({ name }: { name: keyof TransferFormValues }) => (
		<Select
			name={name}
			onChange={formik.handleChange}
			value={formik.values[name]}>
			{!accountsForTransfer?.length ? <option>No accounts</option> : <option>Choose</option>}
			{accountsForTransfer &&
				accountsForTransfer.map(account => (
					<option
						key={account.id}
						value={account.id}>
						Id:{account.id} - Currency:{account.currency} - Balance:{account.balance}
					</option>
				))}
		</Select>
	)

	return (
		<Box
			borderWidth='1px'
			rounded='lg'
			shadow='1px 1px 3px rgba(0,0,0,0.3)'
			maxWidth={800}
			p={6}
			my={5}>
			<form onSubmit={formik.handleSubmit}>
				<FormControl
					my={3}
					isInvalid={formik.touched.fromAccountId && !!formik.errors.fromAccountId}>
					<h1>From Account</h1>
					<SelectAccount name='fromAccountId' />
					<FormErrorMessage>{formik.errors.fromAccountId}</FormErrorMessage>
				</FormControl>

				<FormControl
					my={3}
					isInvalid={formik.touched.toAccountId && !!formik.errors.toAccountId}>
					<h1>To Account</h1>
					<SelectAccount name='toAccountId' />
					<FormErrorMessage>{formik.errors.toAccountId}</FormErrorMessage>
				</FormControl>

				<FormControl
					isInvalid={formik.touched.amount && !!formik.errors.amount}
					my={3}>
					<label htmlFor='amount'>Amount</label>
					<Input
						type='number'
						name='amount'
						id='amount'
						onChange={formik.handleChange}
						value={formik.values.amount}
						onBlur={formik.handleBlur}
					/>
					<FormErrorMessage>{formik.errors.amount}</FormErrorMessage>
				</FormControl>

				<Button
					type='submit'
					variant='solid'
					colorScheme='blue'
					my={3}>
					Transfer
				</Button>
			</form>
		</Box>
	)
}

export default TransferForm
