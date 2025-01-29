import React, { useEffect, useState } from 'react';
import axios from 'axios';

const SkillList: React.FC = () => {

const baseUrl = 'https://vantage-eu.abbyy.com';

const token = 'eyJhbGciOiJSUzI1NiIsImtpZCI6IjQzNTdDRUIzMUYxMUYyMTY3QzQwQzE1RThFNkE2ODQ0N0VFOTUzNDZSUzI1NiIsInR5cCI6ImF0K2p3dCIsIng1dCI6IlExZk9zeDhSOGhaOFFNRmVqbXBvUkg3cFUwWSJ9.eyJuYmYiOjE3Mzc1MzM5NTMsImV4cCI6MTczNzYyMDM1MywiaXNzIjoiaHR0cHM6Ly92YW50YWdlLWV1LmFiYnl5LmNvbS9hdXRoMiIsImF1ZCI6Ikdsb2JhbCIsImNsaWVudF9pZCI6InRsSGdMcUdUbzdpbk5PLVNoRXlVNnM2d3Y1Z1BTOSIsInN1YiI6IjE5YjNmOGY3LWQ3M2MtNDMxNS04ODhlLWE2ZDczYzY3MzE2NSIsImF1dGhfdGltZSI6MTczNzUzMzk1MywiaWRwIjoibG9jYWwiLCJ0ZW5hbnQiOiI1NWRiMzdkNy1iMzJmLTQ2YmEtYjNjZS0wYzQzZjQ5YjI1M2IiLCJwZXJtaXNzaW9uIjpbInNraWxsLmRpc2NvdmVyIiwic2tpbGwuZXhlY3V0ZSIsInNraWxsLm1hbnVhbC1yZXZpZXciLCJza2lsbC50cnkiLCJza2lsbC52ZXJpZnkiLCJza2lsbC5jcmVhdGUiLCJza2lsbC5pbXBvcnQiLCJza2lsbC5jYXRhbG9ncyIsImF1dGhfYWRtaW5fYXBpLnRlbmFudF9hZG1pbiIsInNraWxsLm1vbml0b3IiLCJza2lsbC5lZGl0LXB1Ymxpc2giLCJza2lsbC5hZCIsInNraWxsLmRlbGV0ZSIsInNraWxsLmV4cG9ydCIsInNraWxsLmNvcHkiLCJza2lsbC5zdXBlcnZpc29yIl0sImp0aSI6IjY3QjMzNTRENDZENzNGMEJCRDM5NjM3QjE2M0YwNUU2IiwiaWF0IjoxNzM3NTMzOTUzLCJzY29wZSI6WyJnbG9iYWwud2lsZGNhcmQiLCJvcGVuaWQiLCJwZXJtaXNzaW9ucyJdLCJhbXIiOlsicHdkIl19.Tki0OzZGg4PtL2QpJ7OAZq6BURaL6vfMsroD9oAx0mPnDSEn-FVP-EVty3Wcm1IO6drJcfV1Y5VsUq84aMRZxLc6b8iswwz4c76wqsDKbDsbE2r7qV6tQ1Rja-Sh3Bqo8XWvcMU3SKMZvwtG1MVT3esGt_J-TRFJn6LaC931ia4HxUiY2Tz6nhFRsPAVIvbVaf3vC5_dIfiSbBOzapw9e1lfrvLwAq0ymEubOoHW0zJoLcmJ8PPtar4dlTxtP65F3PebWDgLwvdIq63um4vf44ilHxwTXlE0B9SYjx7aMUx5uh30GQNSddj3w5CbVxP-PPemFA5tU3JwtAKKAZMohQ';

const skill = '649c9962-22c6-4745-bac3-945277fa1359'

const getToken = () => {
  // Replace this with your actual token retrieval logic
  //return localStorage.getItem('authToken');
  return token;
};

const [file, setFile] = useState<File | null>(null);

interface Transaction {
  status: string;
  [key: string]: any;
}

const [transaction, setTransaction] = useState<Transaction | null>(null);

const [transactionStatus, setTransactionStatus] = useState('');

const [manualReviewLink, setManualReviewLink] = useState('');

const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  if (event.target.files) {
    setFile(event.target.files[0]);
  }
};

useEffect(() => {
  if (transaction && transactionStatus !== 'Processed' /*&& manualReviewLink.length === 0*/) {
    const interval = setInterval(myIntervalFunction, 1000);

    function myIntervalFunction() {
      if (transaction ) {
        fetchTransactionDetails(transaction.id).then(res => {
          console.log(res);
          if (res.manualReviewLink && res.status !=='Processed') {
            setManualReviewLink(res.manualReviewLink);
            console.log('Awaiting Manual Review')
          } if (res.status === 'Processed') {
            clearInterval(interval);
            console.log('Transaction Complete :',res);
            setTransaction(res);
            setTransactionStatus('Processed');
            setManualReviewLink('')
          }
        });
      }
    }
    return () => clearInterval(interval); // Cleanup interval on component unmount
  }

}, [transactionStatus]);

const handleFileUpload = async () => {
  if (file) {
    try {
      const response = await launchTransaction(file, skill);
      console.log('File uploaded successfully:', response);
      //console.log(response.transactionId)
      const transaction = await fetchTransactionDetails(response.transactionId);
      //console.log('Transaction Details:', transaction);
      setTransaction(transaction);
      setTransactionStatus(transaction.status);
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  }
};

 const launchTransaction = async (file: File, skillId: string) => {
  try {
    const token = getToken();
    const formData = new FormData();
    formData.append('file', file);

    const response = await axios.post(`${baseUrl}/api/publicapi/v1/transactions/launch?skillId=${skillId}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        'Authorization': `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error uploading file:', error);
    throw error;
  }
};

const fetchTransactionDetails = async (transactionId: string) => {
  try {
    const token = getToken();
    const response = await axios.get(`${baseUrl}/api/publicapi/v1/transactions/${transactionId}`, {
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching transaction details:', error);
    throw error;
  }
};
//transaction.documents[0].resultFiles.filter(function(el: { type: string; }){return el.type ==='FieldsJson'})[0].fileId
const fetchResults = async (transactionId: string, fileId: string) => {
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

  return (
    <div>
      <div>
        <h1>Upload File</h1>
        <input type="file"  onChange={handleFileChange} />
        <button onClick={handleFileUpload}>Upload</button>
      </div>
      {manualReviewLink && <div>
        <button onClick={()=>{ setTransactionStatus('Manual Review');}}><a href={manualReviewLink} target="_blank">Manual Review</a></button>
      </div>}
      {transaction && transaction.status === 'Processed' && <div>
        <button onClick={()=>{console.log(fetchResults(transaction.id,transaction.documents[0].resultFiles.filter(function(el: { type: string; }){return el.type ==='FieldsJson'})[0].fileId))
        }}>Download Data</button>
      </div>}
     
    </div>
  );
};

export default SkillList;
