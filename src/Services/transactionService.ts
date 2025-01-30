import axios from 'axios';

const baseUrl = process.env.REACT_APP_BASE_URL!;
const token = process.env.REACT_APP_TOKEN!;

const getToken = () => {
  return token;
};

export const fetchTransactionDetails = async (transactionId: string) => {
  try {
    const token = getToken();
    const response = await axios.get(`${baseUrl}/api/publicapi/v1/transactions/${transactionId}`, {
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });
    console.log(response);
    return response.data;
  } catch (error) {
    console.error('Error fetching transaction details:', error);
    throw error;
  }
};

export const fetchResults = async (transaction: any) => {
  if (transaction && transaction.documents) {
    try {
      const results = await Promise.all(
        transaction.documents.map(async (document: any) => {
          const resultFile = document.resultFiles.find((file: any) => file.type === 'FieldsJson');
          if (resultFile) {
            const data = await fetchResultFile(transaction.id, resultFile.fileId);
            return data;
          }
          return null;
        })
      );
      console.log('Fetched results:', results);
      return results;
    } catch (error) {
      console.error('Error fetching results:', error);
    }
  }
};

export const fetchResultFile = async (transactionId: string, fileId: string) => {
  try {
    const token = getToken();
    const response = await axios.get(`${baseUrl}/api/publicapi/v1/transactions/${transactionId}/files/${fileId}/download`, {
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching result files:', error);
    throw error;
  }
};