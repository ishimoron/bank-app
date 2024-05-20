import '@testing-library/jest-dom/extend-expect'
import { fireEvent, render, screen } from '@testing-library/react'
import { getAccounts } from '../../services/accountService'
import AccountsList from './AccountList'

jest.mock('../../services/accountService', () => ({
	getAccounts: jest.fn(),
}))

const accounts = [
	{ id: '1', currency: 'USD', balance: 100 },
	{ id: '2', currency: 'EUR', balance: 200 },
]

describe('AccountsList', () => {
	beforeEach(() => {
		(getAccounts as jest.Mock).mockResolvedValueOnce(accounts)
	})

	it('displays accounts properly', async () => {
		render(
			<AccountsList
				isAccountUpdated={false}
				setIsAccountUpdated={() => { }}
			/>
		)

		await screen.findByText('Owner ID: 1')

		expect(screen.getByText('Owner ID: 1')).toBeInTheDocument()
		expect(screen.getByText('Owner ID: 2')).toBeInTheDocument()
		expect(screen.getByText('Currency: USD')).toBeInTheDocument()
		expect(screen.getByText('Currency: EUR')).toBeInTheDocument()
		expect(screen.getByText('Balance: 100')).toBeInTheDocument()
		expect(screen.getByText('Balance: 200')).toBeInTheDocument()
	})

	it('filters accounts by currency', async () => {
		render(
			<AccountsList
				isAccountUpdated={false}
				setIsAccountUpdated={() => { }}
			/>
		)

		await screen.findByText('Owner ID: 1')

		fireEvent.change(screen.getByPlaceholderText('Filter accounts by currency'), { target: { value: 'USD' } })

		expect(screen.getByText('Owner ID: 1')).toBeInTheDocument()
		expect(screen.getByText('Currency: USD')).toBeInTheDocument()
		expect(screen.getByText('Balance: 100')).toBeInTheDocument()

		expect(screen.queryByText('Owner ID: 2')).not.toBeInTheDocument()
		expect(screen.queryByText('Currency: EUR')).not.toBeInTheDocument()
		expect(screen.queryByText('Balance: 200')).not.toBeInTheDocument()
	})
})
