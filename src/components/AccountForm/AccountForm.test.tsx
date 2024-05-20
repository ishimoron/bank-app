import '@testing-library/jest-dom/extend-expect'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'

import { AccountI } from '../../interfaces/account-i'
import AccountEditForm from '../AccountEditForm/AccountEditForm'

jest.mock('../../utils/validationsSchemas', () => ({
	validationSchemaForm: jest.requireActual('../../utils/validationsSchemas').validationSchemaForm,
}))

describe('AccountEditForm', () => {
	const mockAccount: AccountI = {
		id: '1',
		currency: 'USD',
		balance: 1000,
	}

	const mockOnSave = jest.fn()
	const mockOnCancel = jest.fn()

	beforeEach(() => {
		jest.clearAllMocks()
	})

	test('renders form with initial values', () => {
		render(
			<AccountEditForm
				account={mockAccount}
				onSave={mockOnSave}
				onCancel={mockOnCancel}
			/>
		)

		expect(screen.getByLabelText(/currency/i)).toHaveValue('USD')
		expect(screen.getByLabelText(/balance/i)).toHaveValue(1000)
	})

	test('calls onSave with correct values', async () => {
		render(
			<AccountEditForm
				account={mockAccount}
				onSave={mockOnSave}
				onCancel={mockOnCancel}
			/>
		)

		fireEvent.change(screen.getByLabelText(/currency/i), { target: { value: 'EUR' } })
		fireEvent.change(screen.getByLabelText(/balance/i), { target: { value: 1500 } })

		fireEvent.click(screen.getByText(/save/i))

		await waitFor(() => {
			expect(mockOnSave).toHaveBeenCalledWith('1', 'EUR', 1500)
		})
	})

	test('shows validation errors', async () => {
		render(
			<AccountEditForm
				account={mockAccount}
				onSave={mockOnSave}
				onCancel={mockOnCancel}
			/>
		)

		fireEvent.change(screen.getByLabelText(/currency/i), { target: { value: '' } })
		fireEvent.change(screen.getByLabelText(/balance/i), { target: { value: -100 } })

		fireEvent.blur(screen.getByLabelText(/currency/i))
		fireEvent.blur(screen.getByLabelText(/balance/i))

		await waitFor(() => {
			expect(screen.getByText(/currency is required/i)).toBeInTheDocument()
		})
		await waitFor(() => {
			expect(screen.getByText(/Balance must be greater than 0/i)).toBeInTheDocument()
		})
	})

	test('calls onCancel when cancel button is clicked', () => {
		render(
			<AccountEditForm
				account={mockAccount}
				onSave={mockOnSave}
				onCancel={mockOnCancel}
			/>
		)

		fireEvent.click(screen.getByText(/cancel/i))

		expect(mockOnCancel).toHaveBeenCalled()
	})
})
