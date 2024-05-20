import axios from 'axios'
import { AccountI } from '../interfaces/account-i'

const API_URL = 'http://localhost:5000/accounts';

export const getAccounts = async (): Promise<AccountI[]> => {
	try {
		const response = await axios.get<AccountI[]>(API_URL);
		return response.data;
	} catch (error) {
		console.error('Error while fetching accounts:', error);
		throw error;
	}
};

export const createAccount = async (account: AccountI) => {
	try {
		await axios.post(API_URL, account);
	} catch (error) {
		console.error('Error while creating account:', error);
		throw error;
	}
};

export const updateAccount = async (id: string, account: AccountI) => {
	try {
		await axios.put(`${API_URL}/${id}`, account);
	} catch (error) {
		console.error('Error while updating account:', error);
		throw error;
	}
};

export const deleteAccount = async (id: string) => {
	try {
		await axios.delete(`${API_URL}/${id}`);
	} catch (error) {
		console.error('Error while deleting account:', error);
		throw error;
	}
};
