import { Button, Card, CardBody, CardFooter, CardHeader, Flex, Heading, Input, SimpleGrid, Text } from '@chakra-ui/react'
import { FC, useCallback, useEffect, useState } from 'react'
import { AccountI } from '../../interfaces/account-i'
import { deleteAccount, getAccounts, updateAccount } from '../../services/accountService'
import AccountEditForm from '../AccountEditForm/AccountEditForm'

interface AccountsListProps {
	isAccountUpdated: boolean
	setIsAccountUpdated: (value: boolean) => void
}

const AccountsList: FC<AccountsListProps> = ({ isAccountUpdated, setIsAccountUpdated }) => {
	const [accounts, setAccounts] = useState<AccountI[]>([])
	const [filteredAccounts, setFilteredAccounts] = useState<AccountI[]>([])
	const [isFiltering, setIsFiltering] = useState<boolean>(false)
	const [editingAccountId, setEditingAccountId] = useState<string | null>(null)

	useEffect(() => {
		const fetchAccountsData = async (): Promise<void> => {
			try {
				const data = await getAccounts()
				setAccounts(data)
				// Update the filteredAccounts array if an account is edited while filtering.
				setFilteredAccounts(data)
				setIsAccountUpdated(false)
			} catch (error) {
				console.error('Error fetching accounts:', error)
			}
		}

		fetchAccountsData()
	}, [isAccountUpdated, setIsAccountUpdated])

	const deleteAccountHandler = async (id: string): Promise<void> => {
		try {
			await deleteAccount(id)
			setIsAccountUpdated(true)
		} catch (error) {
			console.error('Error deleting account:', error)
		}
	}

	const startEditing = (account: AccountI): void => {
		setEditingAccountId(account.id)
	}

	const cancelEditing = useCallback((): void => {
		setEditingAccountId(null)
	}, [])

	const saveChanges = useCallback(
		(id: string, currency: string, balance: number): void => {
			const update = { id: id, currency: currency, balance: balance }
			updateAccount(id, update)
			setIsAccountUpdated(true)
			cancelEditing()
		},
		[cancelEditing, setIsAccountUpdated]
	)

	const filterCurrencyAccounts = (value: string): void => {
		setIsFiltering(true)
		const filteredAccounts = accounts.filter(({ currency }) => currency.toLowerCase().includes(value.toLowerCase()))
		setFilteredAccounts(filteredAccounts)
		setIsFiltering(false)
	}

	const displayAccounts = filteredAccounts?.length ? filteredAccounts : accounts

	return (
		<Flex flexDirection='column'>
			<Text
				fontSize='3xl'
				fontWeight='bold'>
				Accounts List
			</Text>
			<Input
				placeholder='Filter accounts by currency'
				my='3'
				onChange={e => filterCurrencyAccounts(e.target.value)}
			/>
			<SimpleGrid spacing={4}>
				{!accounts?.length && <Text>No accounts</Text>}
				{isFiltering && <Text>Filtering...</Text>}
				{!isFiltering && !filteredAccounts?.length && accounts?.length > 0 && <Text>No accounts were found with your request.</Text>}
				{displayAccounts &&
					displayAccounts.map(account => (
						<Card
							key={account.id}
							variant='filled'
							size='sm'>
							<CardHeader>
								<Heading size='md'>Owner ID: {account.id}</Heading>
							</CardHeader>
							<CardBody>
								{editingAccountId === account.id ? (
									<AccountEditForm
										account={account}
										onSave={(id, currency, balance) => saveChanges(id, currency, balance)}
										onCancel={cancelEditing}
									/>
								) : (
									<>
										<Text>Currency: {account.currency}</Text>
										<Text>Balance: {account.balance}</Text>
									</>
								)}
							</CardBody>
							<CardFooter>
								{editingAccountId === account.id ? null : (
									<>
										<Button
											variant='solid'
											colorScheme='teal'
											mr='2'
											data-testid='edit-account-button'
											onClick={() => startEditing(account)}>
											Edit account
										</Button>
										<Button
											variant='solid'
											colorScheme='red'
											onClick={() => deleteAccountHandler(account.id)}>
											Delete
										</Button>
									</>
								)}
							</CardFooter>
						</Card>
					))}
			</SimpleGrid>
		</Flex>
	)
}

export default AccountsList
