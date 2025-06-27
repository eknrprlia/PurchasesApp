import axios from 'axios';

export const getTransactions = async () => {
  const response = await axios.get('http://localhost:4000/api/transactions');
  return response.data;
};
