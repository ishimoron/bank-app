import { act, render, screen } from '@testing-library/react'
import TransferForm from './TransferForm'

jest.mock('../../services/accountService', () => ({
	getAccounts: jest.fn().mockResolvedValue([]),
}))

describe('TransferForm', () => {
	test('should render TransferForm component', async () => {
		const setIsAccountUpdated = jest.fn()
		const isAccountUpdated = false

		// eslint-disable-next-line testing-library/no-unnecessary-act
		await act(async () => {
			render(
				<TransferForm
					setIsAccountUpdated={setIsAccountUpdated}
					isAccountUpdated={isAccountUpdated}
				/>
			)
		})

		expect(screen.getByText('From Account')).toBeInTheDocument()
		expect(screen.getByText('To Account')).toBeInTheDocument()
		expect(screen.getByLabelText('Amount')).toBeInTheDocument()
		expect(screen.getByText('Transfer')).toBeInTheDocument()
	})
})
