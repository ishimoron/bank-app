import '@testing-library/jest-dom/extend-expect'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { AccountI } from '../../interfaces/account-i'
import AccountEditForm from './AccountEditForm'

jest.mock('../../utils/validationsSchemas', () => {
	const yup = require('yup')
	return {
		validationSchemaForm: yup.object({
			currency: yup
				.string()
				.matches(/^[A-Z]{3}$/, 'Currency must be in three uppercase letters format for example: USD')
				.required('Currency is required'),
			balance: yup.number().required('Balance is required').min(0, 'Balance must be a positive number').typeError('Balance must be a number').moreThan(0, 'Balance must be greater than 0'),
		}),
	}
})

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
		fireEvent.change(screen.getByLabelText(/balance/i), { target: { value: '1500' } })

		fireEvent.click(screen.getByText(/save/i))

		await waitFor(() => {
			expect(mockOnSave).toHaveBeenCalledWith('1', 'EUR', 1500)
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
