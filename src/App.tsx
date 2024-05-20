import { Box, Button } from '@chakra-ui/react'
import { FC, useState } from 'react'
import './App.css'
import AccountForm from './components/AccountForm/AccountForm'
import AccountsList from './components/AccountList/AccountList'
import TransferForm from './components/TransferForm/TransferForm'

const App: FC = () => {
	const [isAccountUpdated, setIsAccountUpdated] = useState<boolean>(false)
	const [showAccountForm, setShowAccountForm] = useState<boolean>(false)
	const [showTransferForm, setShowTransferForm] = useState<boolean>(false)

	const toggleAccountForm = () => {
		setShowAccountForm(prev => !prev)
	}

	const toggleTransferForm = () => {
		setShowTransferForm(prev => !prev)
	}

	return (
		<Box m={10}>
			<AccountsList
				isAccountUpdated={isAccountUpdated}
				setIsAccountUpdated={setIsAccountUpdated}
			/>
			<Button
				onClick={toggleAccountForm}
				colorScheme='green'
				my={3}
				mr={3}>
				{showAccountForm ? 'Hide' : 'Add account'}
			</Button>
			<Button
				onClick={toggleTransferForm}
				colorScheme='blue'>
				{showTransferForm ? 'Hide' : 'Transfer money'}
			</Button>
			{showAccountForm && (
				<AccountForm
					setIsAccountUpdated={setIsAccountUpdated}
					isAccountUpdated={isAccountUpdated}
				/>
			)}
			{showTransferForm && (
				<TransferForm
					isAccountUpdated={isAccountUpdated}
					setIsAccountUpdated={setIsAccountUpdated}
				/>
			)}
		</Box>
	)
}

export default App
